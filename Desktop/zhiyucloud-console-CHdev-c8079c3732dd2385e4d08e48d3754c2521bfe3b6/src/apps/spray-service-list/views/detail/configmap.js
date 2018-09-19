import Vue from 'vue';
import Component from 'vue-class-component';
// import _ from 'lodash';
import qs from 'qs';
import request from '@/common/utils/request';


@Component({
    components: {
    },

    filters: {
        statusType(value) {
            let statusName = '';
            switch (value) {
                case 1:
                    statusName = '创建中';
                    break;
                case 2:
                    statusName = '运行中';
                    break;
                case 3:
                    statusName = '创建失败';
                    break;
                default:
                    statusName = '--';
            }
            return statusName;
        },
    },

    beforeRouteUpdate(to, from, next) {
        this.keyword = to.params.keyword || '';
        this.page.current = parseInt(to.params.page, 10) || 1;
        this.fetchInstanceListByPage();
        next();
    },
})

export default class Configmap extends Vue {
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

    isCreating = false;

    keyword = '';

    created() {
        this.page.current = parseInt(this.$route.params.page, 10) || 1;
        this.fetchInstanceListByPage();
    }

    handleCreateOpen() {
        this.isCreating = true;
    }

    checkConfig(item) {
        this.$router.push({ name: 'configMapDetail', query: { name: item.configMapName } });
    }

    handleCreateSuccess() {
        this.isCreating = false;
        // Todo 在第一页是是否触发beforeRouteUpdate
        if (/\/spray-service-list(?:\/1)?\/?$/.test(this.$route.path)) {
            this.keyword = '';
            this.page.current = 1;
            this.fetchInstanceListByPage();
        } else {
            this.$router.push('/spray-service-list/1');
        }
    }

    handleCreateClose() {
        this.isCreating = false;
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.$router.push(`/spray-service-list/${page}`);
    }

    handleDelete(item) {
        const ids = item.applicationID;
        this.$Modal.confirm({
            title: '确定删除吗？',
            content: '您将无法恢复该删除文件！',
            onOk: () => {
                this.deleteService({ ids });
            },
        });
    }

    fetchInstanceListByPage(preventLoadingTip = false) {
        if (!preventLoadingTip) {
            this.loading = true;
        }
        const payload = {
            applicationID: this.$route.params.id,
            page: this.page.current,
            pageSize: this.page.size,
        };
        request({
            url: '/sprayBack/appmgr/searchConfigMapList',
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

    deleteService(payload) {
        request({
            method: 'POST',
            url: '/sprayBack/appmgr/delConfigMap',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                applicationID: payload.ids,
                configMapName: this.$route.query.name,
            }),
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.list = this.list.filter(item => !(item.applicationID === payload.ids));
            this.fetchInstanceListByPage(true);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }
}
