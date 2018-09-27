import Vue from 'vue';
import Component from 'vue-class-component';

import request from '@/common/utils/request';
import RegRules from '@/common/utils/validate-rules';

@Component()
export default class Login extends Vue {
    status = '';

    form = {
        username: '',
        password: '',
    };

    rules = {
        username: [
            { required: true, message: '请输入您的手机号码', trigger: 'blur' },
            { pattern: RegRules.phoneNumber, message: '请输入正确格式的手机号码', trigger: 'blur' },
        ],
        password: [
            {
                required: true,
                message: '请输入您的密码',
                trigger: 'blur',
            },
        ],
    };

    submit() {
        this.$refs.iForm.validate((valid) => {
            if (valid) {
                this.status = 'request';

                request({
                    method: 'POST',
                    url: '/auth/auth/token',
                    data: this.form,
                }).then((data) => {
                    this.status = 'success';
                    localStorage.setItem('CONSOLE_USER_IDENTITY', JSON.stringify(data.resultBean));

                    const { from } = this.$route.query;
                    if (from) {
                        this.$router.replace(decodeURIComponent(from));
                    } else {
                        this.$router.replace('/');
                    }
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
