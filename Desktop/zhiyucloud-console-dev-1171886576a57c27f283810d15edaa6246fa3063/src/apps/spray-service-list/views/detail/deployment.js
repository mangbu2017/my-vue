import Vue from 'vue';
import Component from 'vue-class-component';
// import qs from 'qs';
import request from '@/common/utils/request';

import BlankIframe from '@/common/components/blank-iframe.vue';

@Component({
    components: {
        BlankIframe,
    },

    filters: {
        valShow(value) {
            let val = '';
            if (value === '') {
                val = '—';
                return val;
            }
            return value;
        },
    },
})

export default class Deployment extends Vue {
    url = '';

    loading = true;
    // details = null;

    details = {};

    created() {
        this.url = `/console/monitor/spray-service/deployment.html?id=${this.$route.params.id}`;
        this.fetchInstance();
    }

    fetchInstance() {
        this.loading = true;
        const myDate = new Date();
        const year = myDate.getFullYear();
        const month = (myDate.getMonth() + 1) < 10 ? (`0${myDate.getMonth() + 1}`) : (myDate.getMonth() + 1);
        const currentDay = myDate.getDate() < 10 ? (`0${myDate.getDate()}`) : myDate.getDate();

        const startTime = Date.parse(`${year}-${month}-${currentDay} 00:00:00`);
        const endTime = startTime + 86400000;

        request({
            url: '/sprayBack/appmgr/searchDeployInfo',
            params: {
                applicationID: this.$route.params.id,
                startTime,
                endTime,
                timeUnit: 1,
                interval: 2,
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
