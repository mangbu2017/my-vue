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
        bind: {
            type: Boolean,
            default: false,
        },
        'on-success': Function,
        'on-close': Function,
    },
})

export default class CreateDatabase extends Vue {
    status = '';

    isBindOpen = this.bind;

    form = {
        dbName: '',
        charset: '1',
        explain: '',
    };

    formRules = {
        dbName: [
            {
                required: true,
                message: '请输入数据库名称',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.dbName)) {
                        callback();
                    } else {
                        callback(['请按照正确格式输入名称']);
                    }
                },
                trigger: 'blur',
            },
        ],
        charset: [
            {
                required: true,
                message: '请选择字符集',
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
            url: '/ecsalgaBack/mysqldbmgr/createMysqlDb',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                instanceID: this.instance,
                dbName: this.form.dbName,
                charset: this.form.charset,
                remark: this.form.remark,
            }),
        }).then((data) => {
            const dataItem = {
                isBind: this.isBindOpen,
                item: data.resultBean,
            };
            this.status = 'success';
            this.$Modal.confirm({
                title: '是否授权账号',
                content: '<p>为该数据库进行账号授权</p>',
                okText: '创建',
                cancelText: '稍后',
                onOk: () => {
                    dataItem.isBind = true;
                    this.$emit('on-success', dataItem);
                },
                onCancel: () => {
                    dataItem.isBind = false;
                    this.$emit('on-success', dataItem);
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
