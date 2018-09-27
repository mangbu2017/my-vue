import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';
import RunningStatus from '@/common/components/running-status.vue';

@Component({
    components: {
        RunningStatus,
    },
    filters: {
        version(value) {
            let versionName = '';
            switch (value) {
                case 0:
                    versionName = 'RabbitMQ 3.7';
                    break;
                default:
                    versionName = '--';
            }
            return versionName;
        },
        isBoundPublic(value) {
            let BoundPublicName = '';
            switch (value) {
                case 1:
                    BoundPublicName = '已申请';
                    break;
                case 0:
                    BoundPublicName = '未申请';
                    break;
                default:
                    BoundPublicName = '--';
            }
            return BoundPublicName;
        },
        nodeNum(value) {
            let nodeNumName = '';
            switch (value) {
                case 1:
                    nodeNumName = '单节点';
                    break;
                case 2:
                    nodeNumName = '双节点';
                    break;
                case 3:
                    nodeNumName = '三节点';
                    break;
                default:
                    nodeNumName = '--';
            }
            return nodeNumName;
        },
    },
})
export default class Overview extends Vue {
    loading = true;
    instance = {};

    created() {
        this.fetchInstance({
            id: Number(this.$route.params.id),
        });
    }

    handleGetLinkInfo() {
        request({
            method: 'POST',
            url: '/ecsspringrbqBack/instance/getLinkInfo',
            data: {
                instanceID: Number(this.$route.params.id),
            },
        }).then((data) => {
            const content = `<p>账号: ${data.resultBean.user}    密码：${data.resultBean.password}</p>`;
            if (data.resultBean) {
                this.$Modal.info({
                    title: '账号密码',
                    content,
                });
            }
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    fetchInstance(payload) {
        this.loading = true;
        request({
            url: '/ecsspringrbqBack/instance/detail',
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
