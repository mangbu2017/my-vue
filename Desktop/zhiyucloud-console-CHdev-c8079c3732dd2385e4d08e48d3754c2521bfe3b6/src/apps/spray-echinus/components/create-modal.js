// 创建 mangodb 实例弹窗
import Vue from 'vue';
import request from '@/common/utils/request';
import qs from 'qs';
import Component from 'vue-class-component';
import RegRules from '../../../common/utils/validate-rules';

@Component({
    props: {
        'on-success': Function,
        'on-close': Function,
    },
})

export default class CreateModal extends Vue {
    status = '';

    flavorLoading = true;

    form = {
        name: '',
        type: '0',
        region: '0',
        flavorID: 1,
        typeList: [],
        password: '',
        confirmedPassword: '',
        number: 1,
    };

    formRules = {
        name: [
            {
                required: true,
                message: '请输入实例名称',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.shiliName)) {
                        callback();
                    } else {
                        callback(['请按照正确格式输入名称']);
                    }
                },
                trigger: 'blur',
            },
        ],
        flavorID: [
            {
                required: true,
                message: '请选择一种规格',
                trigger: 'change',
            },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: this.validatePassword, trigger: 'blur' },
        ],
        confirmedPassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: this.validateRetypePassword, trigger: 'blur' },
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

    getFlavorList() {
        request({
            url: '/echinusBack/instance/searchflavorList',
        }).then((data) => {
            if (data.resultBean) {
                this.form.typeList = data.resultBean;
                this.flavorLoading = false;
            }
        }).catch((error) => {
            this.$Message.error({
                content: error.message,
            });
        });
    }

    submitData() {
        this.status = 'request';
        request({
            method: 'POST',
            url: '/echinusBack/instance/createInstance',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                name: this.form.name,
                type: this.form.type,
                region: this.form.region,
                flavorID: Number(this.form.flavorID),
                password: this.form.password,
                number: Number(this.form.number),
            }),
        }).then(() => {
            this.$Message.success({
                content: '实例创建成功',
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

    created() {
        this.getFlavorList();
    }
}
