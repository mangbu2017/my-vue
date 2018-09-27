import Vue from 'vue';
import Component from 'vue-class-component';

import request from '@/common/utils/request';

import FetchSmsButton from './fetch-sms-button.vue';

@Component({
    components: {
        FetchSmsButton,
    },
})
export default class ReAuthorize extends Vue {
    status = '';
    form = {
        code: '',
        requestId: '',
    };

    rules = {
        code: [
            { required: true, message: '需要输入短信验证码', trigger: 'blur' },
            { pattern: /^\d{6}$/, message: '需要输入正确格式的短信验证码', trigger: 'blur' },
        ],
    };

    mobile = '';

    constructor() {
        super();

        const identity = JSON.parse(localStorage.getItem('CONSOLE_USER_IDENTITY'));
        if (identity && identity.mobile) {
            this.mobile = identity.mobile;
        }
    }

    handleSmsVerifyRequestIdChange({ requestId }) {
        this.form.requestId = requestId;
    }

    handleCancel() {
        this.$emit('on-failure');
    }

    handleSubmit() {
        if (!this.form.requestId) {
            this.$Message.error({
                content: '请获取验证码',
            });
            return;
        }
        this.$refs.iForm.validate((valid) => {
            if (valid) {
                this.status = 'request';

                request({
                    method: 'POST',
                    url: '/auth/auth/verifyMessage',
                    data: this.form,
                }).then(() => {
                    this.status = 'success';
                    this.$emit('on-success');
                    this.$Message.success({
                        content: '二次校验成功',
                    });
                }).catch((error) => {
                    this.status = 'failure';
                    this.disabled = false;
                    this.$Message.error({
                        content: error.message,
                    });
                });
            }
        });
    }
}
