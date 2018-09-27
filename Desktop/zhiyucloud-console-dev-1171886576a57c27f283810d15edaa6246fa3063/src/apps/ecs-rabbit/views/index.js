import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import request from '@/common/utils/request';
import RunningStatus from '@/common/components/running-status.vue';

import CreateModal from '../components/create-modal.vue';

@Component({
    components: {
        CreateModal,
        RunningStatus,
    },

    filters: {
        version(value) {
            let versionName = '';
            switch (value) {
                case 0:
                    versionName = 'RabbitMQ 3.7';
                    break;
                default:
                    versionName = '--';
            }
            return versionName;
        },
        isBoundPublic(value) {
            let BoundPublicName = '';
            switch (value) {
                case 1:
                    BoundPublicName = '已申请';
                    break;
                case 0:
                    BoundPublicName = '申请';
                    break;
                default:
                    BoundPublicName = '--';
            }
            return BoundPublicName;
        },
        nodeNum(value) {
            let nodeNumName = '';
            switch (value) {
                case 1:
                    nodeNumName = '单节点';
                    break;
                case 2:
                    nodeNumName = '双节点';
                    break;
                case 3:
                    nodeNumName = '三节点';
                    break;
                default:
                    nodeNumName = '--';
            }
            return nodeNumName;
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

    isCreating = false;

    timeout = 0;

    keyword = '';

    created() {
        this.keyword = this.$route.params.keyword || '';
        this.page.current = parseInt(this.$route.params.page, 10) || 1;

        this.fetchInstanceListByPage();
    }

    handleCreateOpen() {
        this.isCreating = true;
    }

    handleCreateSuccess() {
        this.isCreating = false;
        // Todo 在第一页是是否触发beforeRouteUpdate
        if (/\/ecs-rabbit(?:\/1)?\/?$/.test(this.$route.path)) {
            this.keyword = '';
            this.page.current = 1;
            this.fetchInstanceListByPage();
        } else {
            this.$router.push('/ecs-rabbit/1');
        }
    }

    handleCreateClose() {
        this.isCreating = false;
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.$router.push(`/ecs-rabbit/${page}/${this.keyword}`);
    }

    handleSearch() {
        this.$router.push(`/ecs-rabbit/1/${this.keyword}`);
    }

    handleDeleteClick(item) {
        const id = item.instanceID;
        this.$Modal.confirm({
            title: '确定删除吗？',
            content: '您将无法恢复该删除文件！',
            onOk: () => {
                this.deleteInstanceList({ id });
            },
        });
    }

    handlebindIP(item) {
        const id = item.instanceID;
        this.$Modal.confirm({
            title: '确定申请公网IP？',
            content: `是否为实例${id}申请公网IP？`,
            onOk: () => {
                this.BoundPublicIP({ id });
            },
        });
    }

    fetchInstanceListByPage(preventLoadingTip = false) {
        if (!preventLoadingTip) {
            this.loading = true;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        const payload = {
            page: this.page.current,
            pageSize: this.page.size,
            name: this.keyword,
        };
        request({
            url: '/ecsspringrbqBack/instance/instanceList',
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

                this.timeout = setTimeout(() => {
                    this.fetchInstanceListByPage(true);
                }, 10000);
            }
        }).catch((error) => {
            this.loading = false;
            this.$Message.error({
                content: error.message,
            });
            this.timeout = setTimeout(() => {
                this.fetchInstanceListByPage(true);
            }, 10000);
        });
    }

    deleteInstanceList(payload) {
        request({
            method: 'POST',
            url: '/ecsspringrbqBack/instance/deleteInstance',
            data: {
                instanceID: payload.id,
            },
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.list = this.list.filter(item => !(item.instanceID === payload.id));
            this.fetchInstanceListByPage(true);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    BoundPublicIP(payload) {
        this.fillInstance({
            instanceID: payload.id,
            isBoundPublic: 100,
        });
        request({
            method: 'POST',
            url: '/ecsspringrbqBack/netWork/bindFloatingIP',
            data: {
                instanceID: payload.id,
            },
        }).then((data) => {
            this.$Message.success({
                content: data.msg,
            });
            this.fillInstance({
                instanceID: payload.id,
                isBoundPublic: 1,
            });
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
            this.fillInstance({
                instanceID: payload.id,
                isBoundPublic: 0,
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

    beforeDestroy() {
        clearTimeout(this.timeout);
    }
}
