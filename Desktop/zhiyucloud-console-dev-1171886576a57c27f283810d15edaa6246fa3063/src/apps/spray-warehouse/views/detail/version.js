import Vue from 'vue';
import Component from 'vue-class-component';
import qs from 'qs';
import request from '@/common/utils/request';

@Component()
export default class Index extends Vue {
    page = {
        total: 0,
        size: 10,
        current: 1,
    };
    list = [];

    loading = false;

    created() {
        this.fetchMirrorVersionListByPage();
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.page.current = page;
        this.fetchMirrorVersionListByPage();
        this.$router.push(`/spray-warehouse/detail/${this.$route.params.id}/version/${page}`);
    }

    handleDeleteClick(item) {
        this.$Modal.confirm({
            title: '确定删除吗？',
            content: '您将无法恢复该删除文件！',
            onOk: () => {
                this.deleteInstanceList({ item });
            },
        });
    }

    fetchMirrorVersionListByPage(preventLoadingTip = false) {
        if (!preventLoadingTip) {
            this.loading = true;
        }
        const payload = {
            page: this.page.current,
            pageSize: this.page.size,
            wareHouseID: this.$route.params.id,
        };
        request({
            url: '/sprayBack/mirrorwarehouse/searchMirrorVersionList',
            params: payload,
        }).then((data) => {
            this.loading = false;
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
            url: '/sprayBack/mirrorwarehouse/deleteMirrorVersion',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                wareHouseID: this.$route.params.id,
                imageID: payload.item.imageID,
                version: payload.item.version,
            }),
        }).then(() => {
            // this.page.total -= payload.ids.length;
            this.$Message.success({
                content: '删除成功',
            });
            this.fetchMirrorVersionListByPage(true);
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }
}
