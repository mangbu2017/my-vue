import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';
import qs from 'qs';
import RegRules from '../../../common/utils/validate-rules';

@Component({
    props: {
        id: {
            type: Number,
            default: '',
        },
        'on-ok': Function,
        'on-cancel': Function,
    },
})

export default class CreateModal extends Vue {
    status = '';

    wareHouseID = this.id;

    form = {
        houseType: '2',
        digest: '',
        descInfo: '',
    };

    formRules = {
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

    handleOk() {
        this.$refs.form.validate((valid) => {
            if (valid) {
                this.submitData();
            }
        });
    }

    handleCancel() {
        this.$emit('on-cancel', this.modal);
    }

    submitData() {
        this.status = 'request';
        request({
            method: 'POST',
            url: '/sprayBack/mirrorwarehouse/updateMirrorInfo',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                wareHouseID: this.wareHouseID,
                houseType: this.form.houseType,
                digest: this.form.digest,
                descInfo: this.form.descInfo,
            }),
        }).then(() => {
            this.$Message.success({
                content: '修改成功',
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
