<template>
    <i-form
        v-timely-validate
        ref="iForm"
        :model="form"
        :rules="rules"
        class="form"
        @submit.native.prevent="submit"
    >
        <i-form-item prop="newPassword">
            <i-input
                v-model="form.newPassword"
                autofocus
                name="newPassword"
                placeholder="请输入新密码"
                size="large"
                type="password"
            />
        </i-form-item>
        <i-form-item prop="retypePassword">
            <i-input
                v-model="form.retypePassword"
                autofocus
                name="retypePassword"
                placeholder="请输入确认密码"
                size="large"
                type="password"
            />
        </i-form-item>
        <i-form-item class="form-footer">
            <i-button
                :disabled="status === 'request'"
                :loading="status === 'request'"
                html-type="submit"
                long
                size="large"
                type="primary"
            >提交</i-button>
        </i-form-item>
    </i-form>
</template>
<script src="./reset-password.js" />
<style scoped lang="less" src="./reset-password.less" />
