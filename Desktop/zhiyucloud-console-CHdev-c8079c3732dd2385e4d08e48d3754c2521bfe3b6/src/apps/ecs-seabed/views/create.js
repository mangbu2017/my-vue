import Vue from 'vue';
import Component from 'vue-class-component';
import iView from 'iview';

import request from '@/common/utils/request';

@Component()

export default class Create extends Vue {
    loading = '';
    status = '';

    form = {
        areaID: '',
        flavorID: '',
        isBoundPublic: '1',
    };

    rules = {
        instanceNum: [
            {
                required: true,
                type: 'integer',
                message: '需要输入实例数量',
                trigger: 'blur',
            },
            {
                type: 'integer',
                min: 1,
                message: '实例数量不能小于1',
                trigger: 'blur',
            },
            {
                type: 'integer',
                max: 10,
                message: '实例数量不能大于10',
                trigger: 'blur',
            },
        ],
        imageID: [
            {
                required: true,
                message: '需要选择系统镜像',
                trigger: 'blur',
            },
        ],
        disk: [
            {
                required: true,
                type: 'integer',
                message: '需要输入数据盘大小',
                trigger: 'blur',
            },
            {
                type: 'integer',
                min: 20,
                message: '数据盘大小不能小于20',
                trigger: 'blur',
            },
            {
                type: 'integer',
                max: 500,
                message: '数据盘大小不能大于500',
                trigger: 'blur',
            },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 8, message: '密码需要8个字符及以上', trigger: 'blur' },
            { max: 30, message: '密码需要30个字符及以下', trigger: 'blur' },
            { validator: this.validatePassword, trigger: 'blur' },
        ],
        retypePassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: this.validateRetypePassword, trigger: 'change' },
        ],
        name: [
            { required: true, message: '需要输入实例名称', trigger: 'blur' },
            { pattern: /^[a-zA-Z\u4e00-\u9fa5][0-9a-zA-Z\u4e00-\u9fa5._:-]{1,127}$/, message: '2-128个字符，以大小写字母或中文开头，可包含数字、"."、"_"、或"-"', trigger: 'blur' },
        ],
        description: [
            { validator: this.validateDescription, trigger: 'blur' },
        ],
    };

    validatePassword(rule, value, callback) {
        if (this.form.retypePassword !== '') {
            this.$refs.iForm.validateField('retypePassword');
        }

        return request({
            method: 'POST',
            url: '/seabedBack/instance/checkpassword',
            data: {
                password: this.form.password,
            },
        }).then(() => {
            callback();
        }).catch((error) => {
            callback(error);
        });
    }

    validateRetypePassword(rule, value, callback) {
        if (this.form.password && value !== this.form.password) {
            callback(new Error('两次输入的密码不一致'));
        } else {
            callback();
        }
    }

    validateDescription(rule, value, callback) {
        if (this.form.description) {
            const { description } = this.form;

            if (/^https?:\/\/.*/i.test(description)) {
                callback(new Error('不能以http://或https://开头'));
            }
            if (description.length < 2 || description.length > 256) {
                callback(new Error('长度为2-256个字符'));
            }
        }
        callback();
    }

    arealist = [];
    templateList = [];
    imageList = {};
    imageSelected = '';

    fetchAreaList() {
        return request({
            url: '/seabedBack/instance/arealist',
        }).then((data) => {
            this.arealist = data.resultBean;
            this.form.areaID = data.resultBean[0].areaID;
        });
    }

    fetchTemplateList() {
        return request({
            url: '/seabedBack/instance/searchflavorList',
        }).then((data) => {
            this.templateList = data.resultBean;
            this.form.flavorID = data.resultBean[0].flavorID;
        });
    }

    fetchImageList() {
        return request({
            url: '/seabedBack/instance/imagelist',
            type: 'GET',
        }).then(({ resultBean }) => {
            const map = {};
            resultBean.forEach((item) => {
                if (!item.platform) {
                    item.platform = '其他';
                }
                if (!map[item.platform]) {
                    map[item.platform] = [];
                }
                map[item.platform].push({
                    version: item.version || item.name,
                    id: item.imageID,
                });
            });
            this.imageList = map;
        });
    }

    handlePlatformChange() {
        this.form.imageID = '';
    }

    handleSubmit() {
        this.$refs.iForm.validate((valid) => {
            if (valid) {
                this.status = 'request';

                request({
                    method: 'POST',
                    url: '/seabedBack/instance/createInstance',
                    data: this.form,
                }).then(() => {
                    this.status = 'success';
                    this.$Message.success({
                        content: '创建成功',
                    });
                    this.$router.push('/ecs-seabed');
                }).catch((error) => {
                    this.status = 'failure';
                    this.$Message.error({
                        content: error.message,
                    });
                });
            }
        });
    }

    handleReset() {
        this.$Modal.confirm({
            title: '确定取消吗？',
            buttons: ['关闭', '确定'],
            onOk: () => {
                this.$router.push('/ecs-seabed');
            },
        });
    }

    handleRefresh() {
        iView.LoadingBar.start();
        this.loading = 'request';
        Promise.all([
            this.fetchAreaList(),
            this.fetchTemplateList(),
            this.fetchImageList(),
        ]).then(() => {
            this.loading = 'success';
            iView.LoadingBar.finish();
        }).catch(() => {
            this.loading = 'failure';
            iView.LoadingBar.finish();
            this.$Message.error({
                content: '页面加载错误，请刷新页面',
            });
        });
    }

    created() {
        this.handleRefresh();
    }
}
