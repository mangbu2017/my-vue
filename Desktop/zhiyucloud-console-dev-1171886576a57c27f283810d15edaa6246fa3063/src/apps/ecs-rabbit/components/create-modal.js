import Vue from 'vue';
import request from '@/common/utils/request';
import Component from 'vue-class-component';
import TaiSlider from '@/common/components/tai-slider.vue';
import RegRules from '@/common/utils/validate-rules';

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
        flavor: [],
        nodeNum: '1',
        isBoundPublic: '1',
        disk: 20,
        des: '',
    };

    flavor = [];

    formRules = {
        name: [
            {
                required: true,
                message: '请输入名称',
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
        flavor: [
            {
                required: true,
                type: 'number',
                message: '请选择一种配置',
                trigger: 'change',
            },
        ],
        des: [
            {
                required: false,
                message: '请输入描述信息',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (this.form.des) {
                        if (!value.match(RegRules.des)) {
                            callback(new Error('描述信息长度为2-256字符'));
                        }
                    }
                    callback();
                },
                trigger: 'blur',
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

    submitData() {
        this.status = 'request';
        request({
            method: 'POST',
            url: '/ecsspringrbqBack/instance/createInstance',
            data: {
                name: this.form.name,
                version: this.form.version,
                flavor: this.form.flavor,
                isBoundPublic: this.form.isBoundPublic,
                nodeNum: this.form.nodeNum,
                disk: this.form.disk,
                des: this.form.des,
            },
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

    getFlavorList() {
        request({ url: '/ecsspringrbqBack/instance/searchflavorList' })
            .then((data) => {
                const flavorList = data.resultBean.map(item => ({ value: item.flavorID, label: item.des }));
                this.flavor = Object.assign({}, this.flavor, flavorList);
            })
            .catch((error) => {
                this.$Message.error({
                    content: error.message,
                });
            });
    }

    created() {
        this.getFlavorList();
    }
}
