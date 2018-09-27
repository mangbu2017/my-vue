import Vue from 'vue';
import Component from 'vue-class-component';


@Component({
    props: {
        status: {
            type: String,
            required: true,
        },
    },
})
export default class ResetPassword extends Vue {
    status = '';

    form = {
        newPassword: '',
        retypePassword: '',
    };

    rules = {
        newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: this.validatePassword, trigger: 'blur' },
        ],
        retypePassword: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { validator: this.validateRetypePassword, trigger: 'blur' },
        ],
    };

    validatePassword(rule, value, callback) {
        if (this.form.newPassword) {
            const np = this.form.newPassword;
            if (np.length < 6 || np.length > 16 || !/[a-zA-Z]/.test(np) || !/\d/.test(np)) {
                callback(new Error('密码需要6-16位数字与字母组合'));
            }
        }
        if (this.form.retypePassword !== '') {
            this.$refs.iForm.validateField('retypePassword');
        }
        callback();
    }

    validateRetypePassword(rule, value, callback) {
        if (this.form.newPassword && value !== this.form.newPassword) {
            callback(new Error('两次输入的密码不一致'));
        } else {
            callback();
        }
    }

    submit() {
        this.$refs.iForm.validate((valid) => {
            if (valid) {
                this.$emit('on-success', this.form);
            }
        });
    }
}
