import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';

import DetailModal from '../components/detail-modal.vue';

@Component({
    components: {
        DetailModal,
    },
})

export default class Index extends Vue {
    page = {
        total: 0,
        size: 10,
        current: 1,
    };
    list = [];

    form = {
        dateTime: '',
        keywords: '',
        endpoint: '',
    };

    loading = false;

    isDetailing = false;

    detail = {
        name: null,
        id: null,
    };

    created() {
        this.fetchCoralListByPage();
    }

    handleDateChange(date) {
        this.form.dateTime = date;
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.page.current = page;
        this.fetchCoralListByPage();
        this.$router.push(`/coral/${page}`);
    }

    handleDetailClick(item) {
        this.isDetailing = true;
        this.detail = {
            name: item.indexName,
            id: item.id,
        };
    }

    handleDetailCancel() {
        this.isDetailing = false;
        this.detail = {
            name: null,
            id: null,
        };
    }

    fetchCoralListByPage() {
        const payload = {
            page: this.page.current,
            pageSize: this.page.size,
            keywords: this.form.keywords,
            endpoint: this.form.endpoint,
            startDate: this.form.dateTime ? Date.parse(this.form.dateTime[0]) : null,
            endDate: this.form.dateTime ? Date.parse(this.form.dateTime[1]) : null,
        };
        request({
            url: '/coralBack/query/searchloglist',
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

    handleSubmit() {
        this.fetchCoralListByPage();
    }

    handleReset(name) {
        this.$refs[name].resetFields();
    }
}
