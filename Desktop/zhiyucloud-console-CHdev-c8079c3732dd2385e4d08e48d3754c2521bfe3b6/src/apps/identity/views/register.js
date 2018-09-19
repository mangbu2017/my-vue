import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';
import RegRules from '@/common/utils/validate-rules';

import SmsVerifyButton from '@/common/components/sms-verify-button.vue';

@Component({
    components: {
        SmsVerifyButton,
    },
})
export default class Register extends Vue {
    status = '';

    form = {
        realName: '',
        department: '',
        mobile: '',
        code: '',
        requestId: '',
    };

    rules = {
        realName: [
            { required: true, message: '需要输入您的姓名', trigger: 'blur' },
        ],
        department: [
            { required: true, message: '需要输入部门名称', trigger: 'blur' },
        ],
        mobile: [
            { required: true, message: '需要输入手机号码', trigger: 'blur' },
            { pattern: RegRules.phoneNumber, message: '需要输入正确格式的手机号码', trigger: 'blur' },
        ],
        code: [
            { required: true, message: '需要输入短信验证码', trigger: 'blur' },
            { pattern: /^\d{6}$/, message: '需要输入正确格式的短信验证码', trigger: 'blur' },
        ],
    };

    handleSmsVerifyRequestIdChange({ requestId }) {
        this.form.requestId = requestId;
    }

    handleSmsVerifyError() {
        this.$refs.iForm.validateField('mobile');
    }

    submit() {
        this.$refs.iForm.validate((valid) => {
            if (valid) {
                this.status = 'request';

                request({
                    method: 'POST',
                    url: '/auth/user/register',
                    data: this.form,
                }).then(() => {
                    this.status = 'success';
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
