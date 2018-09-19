import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';
import UpdateModal from '../../components/update-modal.vue';

@Component({
    components: {
        UpdateModal,
    },
})
export default class Detail extends Vue {
    loading = true;
    instance = null;

    isUpdating = false;

    warehouseID = null;

    handleActivateEdit() {
        this.warehouseID = Number(this.$route.params.id);
        this.isUpdating = true;
    }

    handleUpdateModalOk() {
        this.isUpdating = false;
        this.fetchInstance({
            id: Number(this.$route.params.id),
        });
    }

    handleUpdateModalCancel() {
        this.isUpdating = false;
    }

    created() {
        this.fetchInstance({
            id: Number(this.$route.params.id),
        });
    }

    fetchInstance(payload) {
        this.loading = true;
        request({
            url: '/sprayBack/mirrorwarehouse/searchMirrorDetail',
            params: {
                wareHouseID: payload.id,
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
}
