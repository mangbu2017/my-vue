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

    form = {
        name: '',
        version: '0',
        storeType: '0',
        frame: '0',
        isBoundPublic: '1',
        typeAndRam: [],
        disk: 20,
        password: '',
        confirmedPassword: '',
    }

    cascaderData = [
        {
            value: 1,
            label: '双副本',
            loading: true,
            children: [],
        }, {
            value: 0,
            label: '单副本',
            loading: true,
            children: [],
        },
    ]

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
        typeAndRam: [
            {
                required: true,
                type: 'array',
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
    }

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

    getRamList() {
        request({ url: '/ecsSeahareBack/instance/searchflavorList' })
            .then((data) => {
                const cascaderDetail = data.resultBean.map(item => ({ value: item.cid, label: item.des }));
                this.cascaderData = this.cascaderData.map(item => Object.assign({}, item, {
                    loading: false,
                    children: cascaderDetail,
                }));
            })
            .catch((error) => {
                this.$Message.error({
                    content: error.message,
                });
            });
    }

    submitData() {
        this.status = 'request';
        request({
            method: 'POST',
            url: '/ecsSeahareBack/instance/createInstance',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                name: this.form.name,
                version: this.form.version,
                storeType: this.form.storeType,
                frame: this.form.frame,
                type: this.form.typeAndRam[0],
                flavor: this.form.typeAndRam[1],
                disk: this.form.disk,
                password: this.form.password,
                isBoundPublic: this.form.isBoundPublic,
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
        this.getRamList();
    }
}
