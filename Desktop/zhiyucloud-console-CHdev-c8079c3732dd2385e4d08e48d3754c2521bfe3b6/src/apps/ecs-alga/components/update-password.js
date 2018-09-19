import Vue from 'vue';
import request from '@/common/utils/request';
import qs from 'qs';
import Component from 'vue-class-component';
import RegRules from '../../../common/utils/validate-rules';

@Component({
    props: {
        name: {
            type: String,
            default: '',
        },
        account: {
            type: Number,
            default: null,
        },
        instance: {
            type: Number,
            default: null,
        },
        'on-ok': Function,
        'on-close': Function,
    },
})

export default class updatePassword extends Vue {
    status = '';
    formItem = {
        password: '',
        confirmedPassword: '',
    };

    accountName = this.name;
    accountId = this.account;
    instanceId = this.instance;

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
            url: '/ecsalgaBack/accountmgr/modifyPassword',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                instanceID: this.instanceId,
                accountID: this.accountId,
                newDbPassword: this.formItem.password,
            }),
        }).then(() => {
            this.$Message.success({
                content: '重置密码成功',
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
