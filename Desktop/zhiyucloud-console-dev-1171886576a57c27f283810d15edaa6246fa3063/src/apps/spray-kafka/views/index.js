import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import qs from 'qs';
import request from '@/common/utils/request';

import CreateModal from '../components/create-modal.vue';
import UpdateModal from '../components/update-modal.vue';

@Component({
    components: {
        CreateModal,
        UpdateModal,
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
        status: '',
    };

    isCreating = false;

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
        if (/\/spray-kafka(?:\/1)?\/?$/.test(this.$route.path)) {
            this.keyword = '';
            this.page.current = 1;
            this.fetchInstanceListByPage();
        } else {
            this.$router.push('/spray-kafka/1');
        }
    }

    handleCreateClose() {
        this.isCreating = false;
    }

    handlePageChange(page) {
        if (this.loading) {
            return;
        }
        this.$router.push(`/spray-kafka/${page}/${this.keyword}`);
    }

    handleDropdownClick(name) {
        // iView 中 Dropdown Item disabled后还可以点击，所以用btnDeleteDisabled做限制
        if (name === 'delete' && !this.btnDeleteDisabled) {
            const ids = this.list.filter(item => item.checked).map(item => item.instanceID);
            if (ids.length === 0) {
                this.$Message.warning({
                    content: '请选择要删除的实例',
                });
                return;
            }
            this.$Modal.confirm({
                title: '删除实例',
                content: `您要立即删除这${ids.length}个实例吗？`,
                onOk: () => {
                    this.deleteInstanceList({ ids });
                },
            });
        }
    }

    handleSearch() {
        this.$router.push(`/spray-kafka/1/${this.keyword}`);
    }

    handleAddNodeNum(item) {
        this.update = {
            item,
            status: '',
        };
    }

    handleUpdateNodeNumModalOk(nodeNum) {
        this.updateInstance({
            instanceID: this.update.item.instanceID,
            nodeNum,
        });
    }

    handleUpdateNodeNumModalCancel() {
        this.update = {
            item: null,
            status: '',
        };
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
            url: '/kafkaBack/instance/instanceList',
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
            url: '/kafkaBack/instance/updateInstance',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                instanceID: payload.instanceID,
                num: payload.nodeNum,
            }),
        }).then(() => {
            this.update = {
                status: 'success',
                item: null,
            };
            this.$Message.success({
                content: '添加成功',
            });
            this.fetchInstanceListByPage();
        }).catch((error) => {
            this.update.status = 'failure';
            this.$Message.error({
                content: error.message,
            });
        });
    }

    deleteInstanceList(payload) {
        request({
            method: 'POST',
            url: '/kafkaBack/instance/deleteInstance',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                instanceIDs: JSON.stringify(payload.ids),
            }),
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
