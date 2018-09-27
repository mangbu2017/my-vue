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
        version: '0',
        isBoundPublic: '1',
        typeAndFlavor: [],
        disk: 20,
    };

    cascaderData = [
        {
            value: 1,
            label: '基础版',
            loading: true,
            children: [],
        }, {
            value: 2,
            label: '高可用版',
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
    };

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
        request({ url: '/ecsalgaBack/instance/searchflavorList' })
            .then((data) => {
                const cascaderDetail = data.resultBean.specs.map(item => ({ value: item.flavorID, label: item.spceDesc }));
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
            url: '/ecsalgaBack/instance/createInstance',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                name: this.form.name,
                version: this.form.version,
                type: this.form.typeAndFlavor[0],
                flavorID: this.form.typeAndFlavor[1],
                disk: this.form.disk,
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
        this.getFlavorList();
    }
}
