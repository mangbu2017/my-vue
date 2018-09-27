import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';
import TogglePassword from '../../components/toggle-password.vue';

@Component({
    components: {
        TogglePassword,
    },
})
export default class Overview extends Vue {
    loading = true;
    instance = {};

    password = 'Facethink2016';

    created() {
        this.fetchInstance({
            id: Number(this.$route.params.id),
        });
    }

    fetchInstance(payload) {
        this.loading = true;
        request({
            url: '/rabbitmqBack/instance/detail',
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
