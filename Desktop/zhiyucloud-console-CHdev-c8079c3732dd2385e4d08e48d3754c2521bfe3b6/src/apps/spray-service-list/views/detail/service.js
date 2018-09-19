import Vue from 'vue';
import Component from 'vue-class-component';
// import qs from 'qs';
import request from '@/common/utils/request';

@Component({
    components: {

    },

    filters: {
        valShow(value) {
            let val = '';
            if (value === '') {
                val = '—';
                return val;
            } else if (value === 'null') {
                val = '—';
                return val;
            }
            return value;
        },

        arrShow(value) {
            let showVal = '';
            if (value && value !== '') {
                showVal = value.join(' , ');
            } else {
                showVal = '--';
            }
            return showVal;
        },
    },
})

export default class Service extends Vue {
    loading = true;

    details = {};

    created() {
        this.fetchInstance();
    }

    fetchInstance() {
        this.loading = true;
        request({
            url: '/sprayBack/appmgr/searchServiceInfo',
            params: {
                applicationID: this.$route.params.id,
            },
        }).then((data) => {
            if (data.resultBean) {
                this.details = data.resultBean;
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
