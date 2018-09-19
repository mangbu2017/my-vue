import Vue from 'vue';
import Component from 'vue-class-component';
import qs from 'qs';
import request from '@/common/utils/request';

import CreateModal from '../components/create-image.vue';
import UpdateLogin from '../components/update-login.vue';
import InitPassword from '../components/init-password.vue';

@Component({
    components: {
        CreateModal,
        UpdateLogin,
        InitPassword,
    },
})

export default class Index extends Vue {
    page = {
        total: 0,
        size: 10,
        current: 1,
    };
    list = [];

    namespaceList = [];

    namespace = '';

    loading = false;

    isCreating = false;
    isUpdating = false;
    isInitSetting = false;

    keyword = '';
    keySpace = null;

    created() {
        this.keyword = this.$route.params.keyword || '';
        this.page.current = parseInt(this.$route.params.page, 10) || 1;

        this.fetchInstanceListByPage();
        this.getNameSpace();
    }

    handleCreateOpen() {
        this.isCreating = true;
    }

    handleCreateSuccess() {
        this.isCreating = false;
        this.keyword = '';
        this.namespace = '';
        this.keySpace = '';
        this.page.current = 1;
        this.fetchInstanceListByPage();
        this.$router.push('/spray-warehouse/1');
    }

    handleCreateClose() {
        this.isCreating = false;
    }

    handleLoginPWOpen() {
        this.isUpdating = true;
    }

    handleUpdateModalOk() {
        this.isUpdating = false;
    }

    handleUpdateModalCancel() {
        this.isUpdating = false;
    }

    handleInitPasswordModalOk() {
        this.isInitSetting = false;
    }

    handleInitPasswordModalCancel() {
        this.isInitSetting = false;
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.page.current = page;
        this.fetchInstanceListByPage();
        this.$router.push(`/spray-warehouse/${page}/${this.keyword}`);
    }

    changeNameSpace(namespace) {
        this.keySpace = namespace;
        this.page.current = 1;
        this.fetchInstanceListByPage();
        this.$router.push(`/spray-warehouse/1/${this.keyword}`);
    }

    handleSearch() {
        this.page.current = 1;
        this.fetchInstanceListByPage();
        this.$router.push(`/spray-warehouse/1/${this.keyword}`);
    }

    handleDeleteClick(item) {
        const ids = item.wareHouseID;
        this.$Modal.confirm({
            title: '确定删除吗？',
            content: '您将无法恢复该删除文件！',
            onOk: () => {
                this.deleteInstanceList({ ids });
            },
        });
    }

    fetchInstanceListByPage(preventLoadingTip = false) {
        if (!preventLoadingTip) {
            this.loading = true;
        }
        const payload = {
            page: this.page.current,
            pageSize: this.page.size,
            wareHouseName: this.keyword,
            nameSpaceID: this.keySpace,
        };
        request({
            url: '/sprayBack/mirrorwarehouse/searchWareHouseList',
            params: payload,
        }).then((data) => {
            this.loading = false;
            if (data.resultBean.isSetting === 0) {
                this.isInitSetting = true;
            } else if (data.resultBean.items) {
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
            url: '/sprayBack/mirrorwarehouse/deleteWareHouse',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                wareHouseID: payload.ids,
            }),
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.list = this.list.filter(item => !(item.wareHouseID === payload.ids));
            this.fetchInstanceListByPage(true);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    getNameSpace() {
        request({
            url: '/sprayBack/namespace/searchNameSpaceList',
        }).then((data) => {
            if (data.resultBean.list) {
                const nameSpaceLists = data.resultBean.list.map(item => ({ value: item.nameSpaceID, label: item.nameSpace }));
                this.namespaceList = Object.assign({}, this.namespaceList, nameSpaceLists);
            }
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }
}
