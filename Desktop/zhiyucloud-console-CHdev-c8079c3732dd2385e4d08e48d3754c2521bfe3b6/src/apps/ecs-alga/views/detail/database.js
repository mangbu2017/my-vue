import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import qs from 'qs';
import request from '@/common/utils/request';
import CreateDatabase from '../../components/create-database.vue';
import CreateAccount from '../../components/create-account.vue';
import TransferModal from '../../components/transfer-modal.vue';


@Component({
    components: {
        CreateDatabase,
        TransferModal,
        CreateAccount,
    },

    computed: {
        allChecked() {
            return Boolean(this.list.length && !this.list.find(item => !item.checked));
        },
        btnDeleteDisabled() {
            return Boolean(!this.list.length || !this.list.find(item => item.checked));
        },
    },

    beforeRouteUpdate(to, from, next) {
        this.keyword = to.params.keyword || '';
        this.page.current = parseInt(to.params.page, 10) || 1;
        this.fetchDatabaseListByPage();
        next();
    },
})

export default class Index extends Vue {
    page = {
        total: 0,
        size: 10,
        current: 1,
    };
    list = [];
    loading = false;

    insId = null;

    isCreating = false;
    isCreatingAccount = false;

    keyword = '';

    bind = {
        item: null,
    };

    userList = [];
    isBindOpen = false;
    bindStatus = '';

    created() {
        this.keyword = this.$route.params.keyword || '';
        this.page.current = parseInt(this.$route.params.page, 10) || 1;
        this.fetchDatabaseListByPage();
    }

    handleCreateOpen() {
        this.isCreating = true;
    }

    handleCreateSuccess(payload) {
        this.isBindOpen = payload.isBind;
        this.isCreating = false;
        this.bind.item = payload.item;
        this.fetchUserList(this.bind.item);

        const regUrl = `/ecs-alga/detail/${this.$route.params.id}/database`;
        const urlRule = new RegExp(`${regUrl}(?:/1)?/?$`);

        // Todo 在第一页是是否触发beforeRouteUpdate
        if (urlRule.test(this.$route.path)) {
            this.keyword = '';
            this.page.current = 1;
            this.fetchDatabaseListByPage();
        } else {
            // this.$router.push('/ecs-alga/1');
            this.$router.push(`${regUrl}/1`);
        }
    }

    handleCreateClose() {
        this.isCreating = false;
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.$router.push(`/ecs-alga/detail/${this.$route.params.id}/database/${page}/${this.keyword}`);
    }

    handleDropdownClick(name) {
        // iView 中 Dropdown Item disabled后还可以点击，所以用btnDeleteDisabled做限制
        if (name === 'delete' && !this.btnDeleteDisabled) {
            const ids = this.list.filter(item => item.checked).map(item => item.databaseID);
            if (ids.length === 0) {
                this.$Message.warning({
                    content: '请选择要删除的数据库',
                });
                return;
            }
            this.$Modal.confirm({
                title: '删除数据库',
                content: `您要立即删除这${ids.length}个数据库吗？`,
                onOk: () => {
                    this.deleteDatabaseList({ ids });
                },
            });
        }
    }

    handleSearch() {
        this.$router.push(`/ecs-alga/detail/${this.$route.params.id}/database/1/${this.keyword}`);
    }


    fetchDatabaseListByPage(preventLoadingTip = false) {
        if (!preventLoadingTip) {
            this.loading = true;
        }
        const payload = {
            page: this.page.current,
            pageSize: this.page.size,
            instanceID: this.$route.params.id,
            dbName: this.keyword,
        };
        request({
            url: '/ecsalgaBack/mysqldbmgr/searchMysqlDbList',
            params: payload,
        }).then((data) => {
            this.loading = false;
            if (data.resultBean.items) {
                let { totalItems, currentPage } = data.resultBean;
                // 兼容当前分页无数据的情况
                if (data.resultBean.items.length === 0) {
                    currentPage = parseInt(this.$route.params.page, 10) || 1;
                    totalItems = data.resultBean.pageSize * currentPage;
                }
                this.page = {
                    total: totalItems,
                    size: data.resultBean.pageSize,
                    current: currentPage,
                };
                this.list = data.resultBean.items;
            }
        }).catch((error) => {
            this.loading = false;
            this.$Message.error({
                content: error.message,
            });
        });
    }

    deleteDatabaseList(payload) {
        request({
            method: 'POST',
            url: '/ecsalgaBack/mysqldbmgr/deleteMysqlDb',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                instanceID: this.$route.params.id,
                databaseID: JSON.stringify(payload.ids),

            }),
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.list = this.list.filter(item => !payload.ids.find(id => item.databaseID === id));
            this.fetchDatabaseListByPage(true);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    setIndexAllItemCheck(payload) {
        this.list = this.list.map(item => (_.merge({}, item, { checked: payload.checked })));
    }

    setIndexItemCheck(payload) {
        const index = this.list.findIndex(item => item.databaseID === payload.databaseID);
        const mergedItem = _.merge({}, this.list[index], payload);
        this.list.splice(index, 1, mergedItem);
    }

    handleCreateAccountSuccess() {
        this.isCreatingAccount = false;
        this.fetchUserList(this.bind.item);
    }

    handleCreateAccountClose() {
        this.isCreatingAccount = false;
    }

    handleCreateDatabase() {
        this.isCreating = true;
        this.insId = Number(this.$route.params.id);
    }

    handleBindOpen(item) {
        this.isBindOpen = true;
        this.bind.item = item;
        this.fetchUserList(item);
    }

    handleBindCreate() {
        this.isCreatingAccount = true;
        this.insId = Number(this.$route.params.id);
    }

    handleBindOk(selectedItems) {
        this.bindStatus = 'request';
        this.submitAuthData(selectedItems);
        this.bind.item = null;
    }

    submitAuthData(payload) {
        const authData = [];
        payload.forEach((item) => {
            authData.push({
                accountID: item.key,
                authID: item.radios.find(i => i.selected).value,
            });
        });
        request({
            method: 'POST',
            url: '/ecsalgaBack/mysqldbmgr/modifyAuthority',
            data: qs.stringify({
                instanceID: this.$route.params.id,
                databaseID: this.bind.item.databaseID,
                accountInfo: JSON.stringify(authData),
            }),
        }).then(() => {
            this.isBindOpen = false;
            this.bind.item = null;
            this.bindStatus = 'success';
            this.userList = [];

            this.$Message.success({
                content: '授权操作成功',
            });

            this.fetchDatabaseListByPage();
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    handleBindCancel() {
        this.isBindOpen = false;
    }

    fetchUserList(payload) {
        request({
            url: '/ecsalgaBack/mysqldbmgr/searchAccountList',
            params: {
                instanceID: this.$route.params.id,
                databaseID: payload.databaseID,
            },
        }).then((data) => {
            this.userList = this.transformData(data.resultBean);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    transformData({ unauth = [], auth = [], authority = [] }) {
        const unauthData = unauth.map(i => ({
            key: i.accountID,
            label: i.dbAccountName,
            disabled: false,
            selected: false,
            radios: authority.map((j, index) => ({
                value: j.authID,
                label: j.authType,
                selected: index === 0,
            })),
        }));

        const authData = auth.map(i => ({
            key: i.accountID,
            label: i.dbAccountName,
            disabled: false,
            selected: true,
            radios: authority.map(j => ({
                value: j.authID,
                label: j.authType,
                selected: i.authID === j.authID,
            })),
        }));

        return unauthData.concat(authData);
    }
}
