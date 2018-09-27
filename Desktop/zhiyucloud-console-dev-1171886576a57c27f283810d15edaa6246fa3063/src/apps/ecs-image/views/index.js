import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';

import RunningStatus from '@/common/components/running-status.vue';

@Component({
    components: {
        RunningStatus,
    },

    beforeRouteUpdate(to, from, next) {
        this.keyword = to.params.keyword || '';
        this.page.current = parseInt(to.params.page, 10) || 1;
        this.fetchInstanceListByPage();
        next();
    },
})

export default class Index extends Vue {
    list = [];
    loading = false;

    isCreating = false;

    timeout = null;

    page = {
        total: 0,
        size: 10,
        current: 1,
    };

    keyword = '';

    mounted() {
        this.keyword = this.$route.params.keyword || '';
        this.page.current = parseInt(this.$route.params.page, 10) || 1;
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

    handleSearch() {
        this.$router.push(`/ecs-image/1/${this.keyword}`);
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.$router.push(`/ecs-image/${page}/${this.keyword}`);
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
            url: '/seabedBack/Image/searchImagesList',
            params: payload,
        }).then((data) => {
            this.loading = false;
            if (data.code === 0) {
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
        });
    }

    handleDeleteClick(item) {
        const id = item.imageID;
        const name = item.imageName;
        this.$Modal.confirm({
            title: `确定删除镜像${name}吗`,
            content: '您将无法恢复该删除文件！',
            onOk: () => {
                this.deleteInstanceList({ id });
            },
        });
    }

    deleteInstanceList(payload) {
        request({
            method: 'POST',
            url: '/seabedBack/Image/deleteImage',
            data: {
                imageID: payload.id,
            },
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.list = this.list.filter(item => !(item.imageID === payload.id));
            this.fetchInstanceListByPage(true);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    beforeDestroy() {
        clearTimeout(this.timeout);
    }
}
