import Vue from 'vue';
import request from '@/common/utils/request';
import Component from 'vue-class-component';

@Component({
    props: {
        name: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: null,
        },
        'on-close': Function,
    },
})

export default class updatePassword extends Vue {
    detailName = this.name;
    detailID = this.id;

    coralName = '--';
    coralMsg = '--';

    handleCancel() {
        this.$emit('on-close', this.modal);
    }

    getDetailMsg() {
        request({
            url: '/coralBack/query/searchrecorddetail',
            params: {
                indexName: this.detailName,
                id: this.detailID,
            },
        }).then((data) => {
            if (data.resultBean) {
                this.coralName = data.resultBean.indexName;
                this.coralMsg = data.resultBean.msg;
            }
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    created() {
        this.getDetailMsg();
    }
}
