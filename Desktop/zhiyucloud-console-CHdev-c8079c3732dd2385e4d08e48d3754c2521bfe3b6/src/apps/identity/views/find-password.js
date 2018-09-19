import Vue from 'vue';
import Component from 'vue-class-component';

import request from '@/common/utils/request';
import VerifyTel from '../components/verify-tel.vue';
import ResetPassword from '../components/reset-password.vue';


@Component({
    components: {
        VerifyTel,
        ResetPassword,
    },
})
export default class FindPassword extends Vue {
    current = 0;
    status = '';

    form = {
        operatevoucher: '',
    };

    handleVerifyTelSuccess(payload) {
        this.status = 'request';

        request({
            method: 'POST',
            url: '/auth/user/verifyMessageCode',
            data: payload,
        }).then((data) => {
            this.status = 'success';
            this.form.operatevoucher = data.resultBean.operatevoucher;
            this.current += 1;
        }).catch((error) => {
            this.status = 'failure';
            this.disabled = false;
            this.$Message.error({
                content: error.message,
            });
        });
    }

    handleResetPasswordSuccess(payload) {
        this.status = 'request';

        request({
            method: 'POST',
            url: '/auth/user/modifyPassword',
            data: Object.assign({}, payload, this.form),
        }).then(() => {
            this.status = 'success';
            this.current += 1;
        }).catch((error) => {
            this.status = 'failure';
            this.disabled = false;
            this.$Message.error({
                content: error.message,
                onClose: () => {
                    if (error.message === '修改密码时效已过，请重新验证身份') {
                        this.current -= 1;
                    }
                },
            });
        });
    }
}
