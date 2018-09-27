import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import qs from 'qs';
import request from '@/common/utils/request';
import CreateAccount from '../../components/create-account.vue';
import UpdatePassword from '../../components/update-password.vue';
import TransferModal from '../../components/transfer-modal.vue';

@Component({
    components: {
        CreateAccount,
        UpdatePassword,
        TransferModal,
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
        this.fetchInstanceListByPage();
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

    update = {
        item: null,
    };
    insId = null;

    bind = {
        item: null,
    };

    isCreating = false;
    isUpdating = false;

    keyword = '';

    dbList = [];
    isBindOpen = false;
    bindStatus = '';

    created() {
        this.keyword = this.$route.params.keyword || '';
        this.page.current = parseInt(this.$route.params.page, 10) || 1;

        this.fetchInstanceListByPage();
    }

    handleCreateAccountOpen() {
        this.insId = Number(this.$route.params.id);
        this.isCreating = true;
    }

    handleCreateSuccess() {
        this.isCreating = false;

        const regUrl = `/ecs-alga/detail/${this.$route.params.id}/account`;
        const urlRule = new RegExp(`${regUrl}(?:/1)?/?$`);

        // Todo 在第一页是是否触发beforeRouteUpdate
        if (urlRule.test(this.$route.path)) {
            this.keyword = '';
            this.page.current = 1;
            this.fetchInstanceListByPage();
        } else {
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
        this.$router.push(`/ecs-alga/detail/${this.$route.params.id}/account/${page}/${this.keyword}`);
    }

    handleDropdownClick(name) {
        // iView 中 Dropdown Item disabled后还可以点击，所以用btnDeleteDisabled做限制
        if (name === 'delete' && !this.btnDeleteDisabled) {
            const ids = this.list.filter(item => item.checked).map(item => item.accountID);
            if (ids.length === 0) {
                this.$Message.warning({
                    content: '请选择要删除的账号',
                });
                return;
            }
            this.$Modal.confirm({
                title: '删除账号',
                content: `您要立即删除这${ids.length}个账号吗？`,
                onOk: () => {
                    this.deleteInstanceList({ ids });
                },
            });
        }
    }

    handleSearch() {
        this.$router.push(`/ecs-alga/detail/${this.$route.params.id}/account/1/${this.keyword}`);
    }

    handleUpdatePassword(item) {
        this.insId = Number(this.$route.params.id);
        this.isUpdating = true;
        this.update = {
            item,
        };
    }

    handleUpdatePasswordOk() {
        this.isUpdating = false;
        this.update = {
            item: null,
        };
    }

    handleUpdatePasswordCancel() {
        this.isUpdating = false;
        this.update = {
            item: null,
        };
    }

    fetchInstanceListByPage(preventLoadingTip = false) {
        if (!preventLoadingTip) {
            this.loading = true;
        }
        const payload = {
            page: this.page.current,
            pageSize: this.page.size,
            instanceID: this.$route.params.id,
            dbAccount: this.keyword,
        };
        request({
            url: '/ecsalgaBack/accountmgr/searchAccountList',
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

    deleteInstanceList(payload) {
        request({
            method: 'POST',
            url: '/ecsalgaBack/accountmgr/deleteDbAccount',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                instanceID: this.$route.params.id,
                accountIDs: JSON.stringify(payload.ids),
            }),
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.list = this.list.filter(item => !payload.ids.find(id => item.accountID === id));
            this.fetchInstanceListByPage(true);
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
        const index = this.list.findIndex(item => item.accountID === payload.accountID);
        const mergedItem = _.merge({}, this.list[index], payload);
        this.list.splice(index, 1, mergedItem);
    }

    handleBindOpen(item) {
        this.isBindOpen = true;
        this.bind.item = item;
        this.fetchDbList(item);
    }

    handleBindOk(selectedItems) {
        this.bindStatus = 'request';
        this.submitAuthData(selectedItems);
    }

    submitAuthData(payload) {
        const authData = [];
        payload.forEach((item) => {
            authData.push({
                databaseID: item.key,
                authID: item.radios.find(i => i.selected).value,
                dbName: item.label,
            });
        });
        request({
            method: 'POST',
            url: '/ecsalgaBack/accountmgr/modifyAuthority',
            data: qs.stringify({
                instanceID: this.$route.params.id,
                accountID: this.bind.item.accountID,
                auths: JSON.stringify(authData),
            }),
        }).then(() => {
            this.isBindOpen = false;
            this.bind.item = null;
            this.bindStatus = 'success';
            this.dbList = [];

            this.$Message.success({
                content: '授权操作成功',
            });

            this.fetchInstanceListByPage();
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    handleBindCancel() {
        this.isBindOpen = false;
    }

    fetchDbList(payload) {
        request({
            url: '/ecsalgaBack/accountmgr/searchDatabaseList',
            params: {
                instanceID: this.$route.params.id,
                accountID: payload.accountID,
            },
        }).then((data) => {
            this.dbList = this.transformData(data.resultBean);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    transformData({ unauth = [], auth = [], authority = [] }) {
        const unauthData = unauth.map(i => ({
            key: i.databaseID,
            label: i.dbName,
            disabled: false,
            selected: false,
            radios: authority.map((j, index) => ({
                value: j.authID,
                label: j.authType,
                selected: index === 0,
            })),
        }));

        const authData = auth.map(i => ({
            key: i.databaseID,
            label: i.dbName,
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
