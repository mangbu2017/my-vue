import Vue from 'vue';
import request from '@/common/utils/request';
import qs from 'qs';
import Component from 'vue-class-component';
import RegRules from '../../../common/utils/validate-rules';

@Component({
    props: {
        'on-ok': Function,
        'on-close': Function,
    },
})

export default class InitPassword extends Vue {
    status = '';
    formItem = {
        password: '',
        confirmedPassword: '',
    };

    formRules = {
        password: [
            {
                required: true,
                message: '请输入密码',
                trigger: 'blur',
            },
            {
                validator: this.validatePassword,
                trigger: 'blur',
            },
        ],
        confirmedPassword: [
            {
                required: true,
                message: '请再次输入密码',
                trigger: 'blur',
            },
            {
                validator: this.validateRetypePassword,
                trigger: 'blur',
            },
        ],
    };

    validatePassword(rule, value, callback) {
        if (!value.match(RegRules.pw)) {
            callback(['请按照正确格式输入密码']);
        }
        if (this.formItem.confirmedPassword !== '') {
            this.$refs.formItem.validateField('confirmedPassword');
        }
        callback();
    }

    validateRetypePassword(rule, value, callback) {
        if (this.formItem.password && value !== this.formItem.password) {
            callback(['两次输入的密码不一致']);
        } else {
            callback();
        }
    }

    handleSubmit() {
        this.$refs.formItem.validate((valid) => {
            if (valid) {
                this.submitData();
            }
        });
    }

    handleCancel() {
        this.$emit('on-close', this.modal);
    }


    submitData() {
        this.status = 'request';
        request({
            method: 'POST',
            url: '/sprayBack/mirrorwarehouse/updateDockerPassword',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                password: this.formItem.password,
            }),
        }).then(() => {
            this.$Message.success({
                content: '密码设置成功',
                onClose: () => {
                    this.$emit('on-ok');
                    this.status = 'success';
                },
            });
        }).catch((error) => {
            this.status = 'failure';
            this.$Message.error({
                content: error.message,
            });
        });
    }
}
