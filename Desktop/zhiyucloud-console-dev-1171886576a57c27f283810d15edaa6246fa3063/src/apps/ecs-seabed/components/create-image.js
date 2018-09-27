import Vue from 'vue';
import Component from 'vue-class-component';
import request from '@/common/utils/request';
import RegRules from '../../../common/utils/validate-rules';

@Component({
    props: {
        name: {
            type: String,
            default: '',
        },
        id: {
            type: Number,
            default: '',
        },
        watch: {
        },
        'on-success': Function,
        'on-close': Function,
    },
})

export default class CreateImage extends Vue {
    status = '';

    form = {
        imageName: '',
        error: false,
    }

    formRules = {
        imageName: [
            {
                required: true,
                message: '请输入镜像名称',
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value.match(RegRules.shiliName)) {
                        callback();
                    } else {
                        callback(['请按照正确格式输入名称']);
                        this.error = true;
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
            url: '/seabedBack/Image/createImage',
            data: {
                instanceID: this.id,
                name: this.form.imageName,
            },
        }).then(() => {
            this.$Message.success({
                content: '创建成功',
                onClose: () => {
                    this.$emit('on-success');
                    this.$router.push('/ecs-image/1');
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
