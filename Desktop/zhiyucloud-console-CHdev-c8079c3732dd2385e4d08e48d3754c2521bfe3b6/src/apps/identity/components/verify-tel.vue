<template>
    <i-form
        v-timely-validate
        ref="iForm"
        :model="form"
        :rules="rules"
        class="form"
        @submit.native.prevent="submit"
    >
        <i-form-item prop="mobile">
            <i-input
                v-model="form.mobile"
                autofocus
                name="mobile"
                placeholder="请输入手机号码"
                size="large"
                type="tel"
            />
        </i-form-item>
        <div class="sms-container">
            <i-form-item prop="code">
                <i-input
                    v-model="form.code"
                    autofocus
                    class="sms-input"
                    name="code"
                    placeholder="请输入短信验证码"
                    size="large"
                    type="text"
                />
            </i-form-item>
            <sms-verify-button
                :mobile="form.mobile"
                @on-change="handleSmsVerifyRequestIdChange"
                @on-error="handleSmsVerifyError"
            />
        </div>
        <i-form-item class="form-footer">
            <i-button
                :disabled="status === 'request'"
                :loading="status === 'request'"
                html-type="submit"
                long
                size="large"
                type="primary"
            >下一步</i-button>
        </i-form-item>
    </i-form>
</template>
<script src="./verify-tel.js" />
<style scoped lang="less" src="./verify-tel.less" />
