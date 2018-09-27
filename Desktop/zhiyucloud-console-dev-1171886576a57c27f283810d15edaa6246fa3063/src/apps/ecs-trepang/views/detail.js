import Vue from 'vue';
import Component from 'vue-class-component';
import qs from 'qs';
import request from '@/common/utils/request';
import UpdateModal from '../components/update-modal.vue';

@Component({
    components: {
        UpdateModal,
    },
})
export default class Detail extends Vue {
    loading = true;
    instance = {};

    update = {
        status: '',
    };

    handleActivateEdit() {
        this.update.status = 'ready';
    }

    handleUpdateModalOk(name) {
        this.updateInstance({
            instanceID: this.instance.mongodbInstance.instanceID,
            name,
        });
    }

    handleUpdateModalCancel() {
        this.update.status = '';
    }

    created() {
        this.fetchInstance({
            id: Number(this.$route.params.id),
        });
    }

    fetchInstance(payload) {
        this.loading = true;
        request({
            url: '/ecstrepangBack/instance/detail',
            params: {
                instanceID: payload.id,
            },
        }).then((data) => {
            if (data.resultBean) {
                this.instance = data.resultBean;
            }
            this.loading = false;
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
            url: '/ecstrepangBack/instance/updateInstance',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                instanceID: payload.instanceID,
                newInstanceName: payload.name,
            }),
        }).then(() => {
            this.$Message.success({
                content: '修改成功',
            });
            this.update.status = 'success';
            this.instance.mongodbInstance.name = payload.name;
        }).catch((error) => {
            this.update.status = 'failure';
            this.$Message.error({
                content: error.message,
            });
        });
    }
}
