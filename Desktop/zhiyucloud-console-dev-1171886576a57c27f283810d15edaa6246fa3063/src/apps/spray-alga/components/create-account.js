import Vue from 'vue';
import request from '@/common/utils/request';
import qs from 'qs';
import Component from 'vue-class-component';
import RegRules from '../../../common/utils/validate-rules';

@Component({
    props: {
        instance: {
            type: Number,
            default: null,
        },
        'on-success': Function,
        'on-close': Function,
    },
})

export default class CreateAccount extends Vue {
    status = '';

    instanceId = this.instance;

    form = {
        dbAccount: '',
        password: '',
        remark: '',
        confirmedPassword: '',
    };

    formRules = {
        dbAccount: [
            {
                required: true,
                message: '请输入账号名称',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.accountName)) {
                        callback();
                    } else {
                        callback(['请按照正确格式输入名称']);
                    }
                },
                trigger: 'blur',
            },
        ],
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
        if (this.form.confirmedPassword !== '') {
            this.$refs.form.validateField('confirmedPassword');
        }
        callback();
    }

    validateRetypePassword(rule, value, callback) {
        if (this.form.password && value !== this.form.password) {
            callback(['两次输入的密码不一致']);
        } else {
            callback();
        }
    }


    handleSubmit() {
        this.$refs.form.validate((valid) => {
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
            url: '/mysqlclientBack/accountmgr/createDbAccount',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                instanceID: this.instanceId,
                dbAccount: this.form.dbAccount,
                password: this.form.password,
                remark: this.form.remark,
            }),
        }).then(() => {
            this.$Message.success({
                content: '账号创建成功',
                onClose: () => {
                    this.$emit('on-success');
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
