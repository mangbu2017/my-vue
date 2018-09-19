<template>
    <i-modal
        :value="true"
        :transfer="false"
        :closable="false"
        :mask-closable="false"
        title="登录超时"
        width="700"
        @on-ok="handleSubmit"
        @on-close="handleCancel"
    >
        <p>登录超时，请重新登录<br><br></p>
        <div slot="footer">
            <i-button
                type="primary"
                @click="handleSubmit"
            >
                重新登录
            </i-button>
        </div>
    </i-modal>
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component()
export default class ExpireConfirm extends Vue {
    handleSubmit() {
        this.$emit('on-ok');
        this.$router.push(`/login?from=${encodeURIComponent(this.$route.fullPath)}`);
    }
    handleCancel() {
        this.$emit('on-close');
    }
}
</script>
