import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';

@Component()
export default class Overview extends Vue {
    loading = true;
    instance = {};

    created() {
        this.fetchInstance({
            id: Number(this.$route.params.id),
        });
    }

    fetchInstance(payload) {
        this.loading = true;
        request({
            url: '/kafkaBack/instance/detail',
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
}
