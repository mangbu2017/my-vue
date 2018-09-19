import Vue from 'vue';
import Component from 'vue-class-component';

import RegRules from '@/common/utils/validate-rules';
import SmsVerifyButton from '@/common/components/sms-verify-button.vue';

@Component({
    props: {
        status: {
            type: String,
            required: true,
        },
    },
    components: {
        SmsVerifyButton,
    },
})
export default class VerifyTel extends Vue {
    form = {
        mobile: '',
        code: '',
        requestId: '',
    };

    rules = {
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
                this.$emit('on-success', this.form);
            }
        });
    }
}
