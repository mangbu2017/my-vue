import Vue from 'vue';
import Component from 'vue-class-component';
import qs from 'qs';
import request from '@/common/utils/request';

import CreateSpace from '../components/create-space.vue';
import InitPassword from '../components/init-password.vue';

@Component({
    components: {
        CreateSpace,
        InitPassword,
    },
})

export default class Index extends Vue {
    list = [];
    loading = false;

    isCreating = false;
    isInitSetting = false;

    created() {
        this.fetchInstanceListByPage();
    }

    handleCreateOpen() {
        this.isCreating = true;
    }

    handleCreateSuccess() {
        this.isCreating = false;
        this.fetchInstanceListByPage();
    }

    handleCreateClose() {
        this.isCreating = false;
    }

    handleInitPasswordModalOk() {
        this.isInitSetting = false;
    }

    handleInitPasswordModalCancel() {
        this.isInitSetting = false;
    }

    handleDeleteClick(item) {
        const ids = item.nameSpaceID;
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
        request({
            url: '/sprayBack/namespace/searchNameSpaceList',
        }).then((data) => {
            this.loading = false;
            if (data.resultBean.isSetting === 0) {
                this.isInitSetting = true;
            } else if (data.resultBean.list) {
                this.list = data.resultBean.list;
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
            url: '/sprayBack/namespace/deleteNameSpace',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                nameSpaceID: payload.ids,
            }),
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.list = this.list.filter(item => !(item.nameSpaceID === payload.ids));
            this.fetchInstanceListByPage(true);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }
}
