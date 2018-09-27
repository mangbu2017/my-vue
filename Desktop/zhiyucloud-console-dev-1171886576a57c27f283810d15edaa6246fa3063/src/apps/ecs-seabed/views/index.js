import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import request from '@/common/utils/request';

import RunningStatus from '@/common/components/running-status.vue';

import UpdateModal from '../components/update-modal.vue';
import CreateImage from '../components/create-image.vue';

@Component({
    components: {
        UpdateModal,
        CreateImage,
        RunningStatus,
    },

    computed: {
        allChecked() {
            return Boolean(this.list.length && !this.list.find(item => !item.checked));
        },
        btnDisabled() {
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
        status: '',
    };

    createImage = {
        instanceName: '',
        instanceID: '',
    }


    keyword = '';

    isCreating = false;

    created() {
        this.keyword = this.$route.params.keyword || '';
        this.page.current = parseInt(this.$route.params.page, 10) || 1;

        this.fetchInstanceListByPage();
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.$router.push(`/ecs-seabed/${page}/${this.keyword}`);
    }

    handleDropdownClick(name) {
        // iView 中 Dropdown Item disabled后还可以点击，所以用btnDisabled做限制
        if (!this.btnDisabled) {
            let actionMessage = '';
            let url = '';
            let type;
            if (name === 'start') {
                actionMessage = '启动';
                url = '/seabedBack/instance/bootAndStop';
                type = 0;
            } else if (name === 'restart') {
                actionMessage = '重启';
                url = '/seabedBack/instance/restart';
            } else if (name === 'stop') {
                actionMessage = '关机';
                url = '/seabedBack/instance/bootAndStop';
                type = 1;
            } else if (name === 'delete') {
                actionMessage = '删除';
                url = '/seabedBack/instance/deleteInstance';
            }

            const ids = this.list.filter(item => item.checked).map(item => item.instanceID);
            if (ids.length === 0) {
                this.$Message.warning({
                    content: `请选择要${actionMessage}实例`,
                });
                return;
            }

            this.$Modal.confirm({
                title: `${actionMessage}实例`,
                content: `您要立即${actionMessage}这${ids.length}个实例吗？`,
                onOk: () => {
                    if (name === 'delete') {
                        this.deleteInstanceList({ ids });
                    } else {
                        this.operateInstanceList({ ids, type }, url, actionMessage);
                    }
                },
            });
        }
    }

    handleSearch() {
        this.$router.push(`/ecs-seabed/1/${this.keyword}`);
    }

    handleUpdateName(item) {
        this.update = {
            item,
            status: '',
        };
    }

    handleUpdateModalOk(name) {
        this.updateInstance({
            instanceID: this.update.item.instanceID,
            name,
        });
    }

    handleUpdateModalCancel() {
        this.update = {
            item: null,
            status: '',
        };
    }

    handleBindIP(item) {
        this.$set(item, 'ipLoading', true);
        const payload = {
            instanceID: item.instanceID,
        };
        request({
            method: 'POST',
            url: '/seabedBack/instance/bindPublicNetworkIP',
            data: payload,
        }).then(() => {
            this.fetchInstanceListByPage();
        }).catch((error) => {
            this.$set(item, 'ipLoading', false);
            this.$Message.error({
                content: error.message,
            });
        });
    }

    handleUnbindIP(item) {
        this.$set(item, 'ipLoading', true);
        const payload = {
            instanceID: item.instanceID,
        };
        request({
            method: 'POST',
            url: '/seabedBack/instance/removePublicNetworkIP',
            data: payload,
        }).then(() => {
            this.$set(item, 'ipLoading', false);
            // API数据不纯粹，Hack处理
            item.publicIP = '--';
        }).catch((error) => {
            this.$set(item, 'ipLoading', false);
            this.$Message.error({
                content: error.message,
            });
        });
    }

    handleCreateOpen(item) {
        this.isCreating = true;
        this.createImage.instanceName = item.name;
        this.createImage.instanceID = item.instanceID;
    }

    handleCreateSuccess() {
        this.isCreating = false;
    }

    handleCreateClose() {
        this.isCreating = false;
    }

    fetchInstanceListByPage(preventLoadingTip = false) {
        if (!preventLoadingTip) {
            this.loading = true;
        }
        const payload = {
            page: this.page.current,
            pageSize: this.page.size,
            name: this.keyword,
        };
        request({
            url: '/seabedBack/instance/instanceList',
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

    updateInstance(payload) {
        this.update.status = 'request';
        request({
            method: 'POST',
            url: '/seabedBack/instance/updateInstance',
            data: {
                instanceID: payload.instanceID,
                newInstanceName: payload.name,
            },
        }).then(() => {
            this.update = {
                status: 'success',
                item: null,
            };
            this.$Message.success({
                content: '修改成功',
            });

            this.fillInstance({
                instanceID: payload.instanceID,
                name: payload.name,
            });
        }).catch((error) => {
            this.update.status = 'failure';
            this.$Message.error({
                content: error.message,
            });
        });
    }

    fillInstance(payload) {
        const index = this.list.findIndex(oldInstance => oldInstance.instanceID === payload.instanceID);

        if (index >= 0) {
            const mergedInstance = _.merge({}, this.list[index], payload);
            this.list.splice(index, 1, mergedInstance);
        }
    }

    operateInstanceList(payload, url, actionMessage) {
        request({
            method: 'POST',
            url,
            data: {
                instanceIDs: JSON.stringify(payload.ids),
                type: payload.type,
            },
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: `${actionMessage}成功`,
            });
            this.fetchInstanceListByPage(true);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    deleteInstanceList(payload) {
        request({
            method: 'POST',
            url: '/seabedBack/instance/deleteInstance',
            data: {
                instanceIDs: JSON.stringify(payload.ids),
            },
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.list = this.list.filter(item => !payload.ids.find(id => item.instanceID === id));
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
        const index = this.list.findIndex(item => item.instanceID === payload.instanceID);
        const mergedItem = _.merge({}, this.list[index], payload);
        this.list.splice(index, 1, mergedItem);
    }
}
