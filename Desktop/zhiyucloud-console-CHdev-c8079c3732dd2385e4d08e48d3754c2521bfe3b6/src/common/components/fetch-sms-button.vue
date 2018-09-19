<template>
    <i-button
        :disabled="disabled"
        :icon="icon"
        :loading="status === 'request'"
        class="sms-verify-button"
        html-type="button"
        long
        size="large"
        type="primary"
        @click.prevent="handleClick"
    >{{ buttonText }}</i-button>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

import request from '@/common/utils/request';

@Component({
    props: {
    },
})
export default class SmsVerifyButton extends Vue {
    buttonText = '获取验证码';
    disabled = false;
    icon = '';
    status = '';

    setTimer() {
        const startTs = Date.now();
        this.icon = 'ios-timer-outline';

        this.timer = setInterval(() => {
            const diff = Math.ceil((Date.now() - startTs) / 1000);
            if (diff >= 0 && diff < 60) {
                this.buttonText = `${60 - diff}秒重新获取`;
            } else {
                clearInterval(this.timer);
                this.icon = '';
                this.buttonText = '重新获取';
                this.disabled = false;
            }
        }, 500);
    }

    tryDestroyTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    handleClick() {
        this.status = 'request';
        this.disabled = true;

        request({
            method: 'GET',
            url: '/auth/auth/queryMessage',
        }).then((data) => {
            if (!data.resultBean || !data.resultBean.requestId) {
                throw new Error('RequestId获取失败');
            }
            this.status = 'success';
            this.setTimer();
            this.$emit('on-change', {
                requestId: data.resultBean.requestId,
            });
            this.$Message.success({
                content: '短信验证码发送成功，请注意查收',
            });
        }).catch((error) => {
            this.status = 'failure';
            this.disabled = false;
            this.$Message.error({
                content: error.message,
            });
        });
    }

    beforeDestroy() {
        this.tryDestroyTimer();
    }
}
</script>

<style scoped lang="less">
    .sms-verify-button {
        width: 150px;
    }
</style>
