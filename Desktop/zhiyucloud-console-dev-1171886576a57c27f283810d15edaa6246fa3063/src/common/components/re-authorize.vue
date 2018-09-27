<template>
    <i-modal
        :value="true"
        :transfer="false"
        :closable="false"
        :mask-closable="false"
        title="手机验证"
        width="700"
        @on-ok="handleSubmit"
        @on-close="handleCancel"
    >
        <p>您接下来的操作需要二次验证操作，您绑定的手机号为{{ mobile }}<br><br></p>
        <i-form
            v-timely-validate
            ref="iForm"
            :model="form"
            :rules="rules"
            class="form"
            @submit.native.prevent="handleSubmit"
        >
            <div class="sms-container">
                <i-form-item prop="code" class="sms-wrap">
                    <i-input
                        v-model="form.code"
                        name="code"
                        placeholder="请输入短信验证码"
                        size="large"
                        type="text"
                        long
                    />
                </i-form-item>
                <fetch-sms-button
                    @on-change="handleSmsVerifyRequestIdChange"
                />
            </div>
        </i-form>
        <div slot="footer">
            <i-button
                :disabled="status === 'request'"
                type="text"
                @click="handleCancel"
            >取消</i-button>
            <i-button
                :loading="status === 'request'"
                type="primary"
                @click="handleSubmit"
                @on-enter="handleSubmit"
            >
                <span v-if="status !== 'request'">确定</span>
                <span v-else>验证中...</span>
            </i-button>
        </div>
    </i-modal>
</template>

<script src="./re-authorize.js"></script>
<style scoped src="./re-authorize.less"></style>

