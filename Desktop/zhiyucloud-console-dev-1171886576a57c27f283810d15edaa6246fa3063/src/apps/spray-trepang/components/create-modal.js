// 创建 mangodb 实例弹窗
import Vue from 'vue';
import request from '@/common/utils/request';
import qs from 'qs';
import Component from 'vue-class-component';
import TaiSlider from '@/common/components/tai-slider.vue';
import RegRules from '../../../common/utils/validate-rules';

@Component({
    components: {
        TaiSlider,
    },
    props: {
        'on-success': Function,
        'on-close': Function,
    },
})

export default class CreateModal extends Vue {
    status = '';

    form = {
        name: '',
        type: '0',
        region: '0',
        version: '0',
        triger: '0',
        netWork: '0',
        nodeNum: '',
        typeAndFlavor: [],
        disk: 10,
        password: '',
        confirmedPassword: '',
        count: '1',
    };

    cascaderData = [
        {
            value: 1,
            label: '三节点',
            loading: true,
            children: [],
        }, {
            value: 0,
            label: '单节点',
            loading: true,
            children: [],
        },
    ];

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
        typeAndFlavor: [
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
            url: '/mongodbserviceBack/instance/searchflavorList',
            params: ({
                classes: 0,
            }),
        }).then((data) => {
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
            url: '/mongodbserviceBack/instance/createInstance',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                name: this.form.name,
                type: this.form.type,
                region: this.form.region,
                version: this.form.version,
                triger: this.form.triger,
                netWork: this.form.netWork,
                nodeNum: this.form.typeAndFlavor[0],
                flavor: this.form.typeAndFlavor[1],
                disk: this.form.disk,
                password: this.form.password,
                count: this.form.count,
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
