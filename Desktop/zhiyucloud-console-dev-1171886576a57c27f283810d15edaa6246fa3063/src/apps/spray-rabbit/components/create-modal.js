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
        cpuSize: [],
        memSize: [],
        nodeNum: 1,
        disk: 10,
        des: '',
    };

    cpuSize = [];

    memSize = [];

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
        cpuSize: [
            {
                required: true,
                type: 'number',
                message: '请选择一种CPU',
                trigger: 'change',
            },
        ],
        memSize: [
            {
                required: true,
                type: 'number',
                message: '请选择一种内存',
                trigger: 'change',
            },
        ],
        nodeNum: [
            {
                required: true,
                type: 'number',
                message: '节点数量支持1-10个节点',
                trigger: 'blur',
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
                    if (value.match(RegRules.des)) {
                        callback();
                    } else {
                        callback(['描述信息最大长度为100字符']);
                    }
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
            url: '/rabbitmqBack/instance/createInstance',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                name: this.form.name,
                version: this.form.version,
                cpuSize: this.form.cpuSize,
                memSize: this.form.memSize,
                nodeNum: this.form.nodeNum,
                disk: this.form.disk,
                des: this.form.des,
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

    getCpuSizeList() {
        request({ url: '/rabbitmqBack/instance/getCpuSizeList' })
            .then((data) => {
                const cpuSizeList = data.resultBean.map(item => ({ value: item.cid, label: item.des }));
                this.cpuSize = Object.assign({}, this.cpuSize, cpuSizeList);
            })
            .catch((error) => {
                this.$Message.error({
                    content: error.message,
                });
            });
    }

    getMemorySizeList() {
        request({ url: '/rabbitmqBack/instance/getMemorySizeList' })
            .then((data) => {
                const memSizeList = data.resultBean.map(item => ({ value: item.mid, label: item.des }));
                this.memSize = Object.assign({}, this.memSize, memSizeList);
            })
            .catch((error) => {
                this.$Message.error({
                    content: error.message,
                });
            });
    }

    created() {
        this.getCpuSizeList();
        this.getMemorySizeList();
    }
}
