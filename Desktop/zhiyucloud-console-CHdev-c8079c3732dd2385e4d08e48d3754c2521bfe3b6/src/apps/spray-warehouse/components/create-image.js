import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';
import qs from 'qs';
import RegRules from '../../../common/utils/validate-rules';

@Component({
    props: {
        list: {
            type: Array,
            default: [],
        },
        'on-success': Function,
        'on-close': Function,
    },
    watch: {
        list() {
            this.namespaceList = Object.assign({}, this.namespaceList, this.list);
            this.namespaceLength = this.list.length;
        },
    },
})

export default class CreateModal extends Vue {
    status = '';

    namespaceList = Object.assign({}, this.namespaceList, this.list);
    namespaceLength = this.list.length;

    form = {
        nameSpaceID: '',
        wareHouseName: '',
        digest: '',
        descInfo: '',
        houseType: '2',
    };

    formRules = {
        nameSpaceID: [
            {
                required: true,
                message: '请选择一个命名空间',
                trigger: 'change',
            },
        ],
        wareHouseName: [
            {
                required: true,
                message: '请输入仓库名称',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.wareHouseName)) {
                        callback();
                    } else {
                        callback(['请按照正确格式输入名称']);
                    }
                },
                trigger: 'blur',
            },
        ],
        digest: [
            {
                required: true,
                message: '请输入摘要',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.des)) {
                        callback();
                    } else {
                        callback(['摘要最大长度为100字符']);
                    }
                },
                trigger: 'blur',
            },
        ],
        descInfo: [
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
            url: '/sprayBack/mirrorwarehouse/createMirrorWareHouse',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                nameSpaceID: this.form.nameSpaceID,
                wareHouseName: this.form.wareHouseName,
                digest: this.form.digest,
                descInfo: this.form.descInfo,
                houseType: this.form.houseType,
            }),
        }).then(() => {
            this.$Message.success({
                content: '创建成功',
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

    handleCreateNamespace() {
        this.$emit('on-success', true);
    }
}
