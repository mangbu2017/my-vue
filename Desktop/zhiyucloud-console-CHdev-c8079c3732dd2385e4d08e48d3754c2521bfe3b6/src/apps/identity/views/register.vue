<template>
    <div class="container">
        <i-card :padding="33" class="card">
            <h1 class="card-title">欢迎申请使用智渔云</h1>
            <i-form
                v-timely-validate
                v-if="status !== 'success'"
                ref="iForm"
                :model="form"
                :rules="rules"
                class="form"
                @on-form-change="console.log($event)"
                @submit.native.prevent="submit"
            >
                <i-form-item prop="realName">
                    <i-input
                        v-model="form.realName"
                        autofocus
                        name="realName"
                        placeholder="请输入您的姓名"
                        size="large"
                        type="text"
                    />
                </i-form-item>
                <i-form-item prop="department">
                    <i-input
                        v-model="form.department"
                        autofocus
                        name="department"
                        placeholder="请输入部门名称"
                        size="large"
                        type="text"
                    />
                </i-form-item>
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
                    >注册</i-button>
                </i-form-item>
            </i-form>
            <div v-else-if="status === 'success'">
                <i-alert type="success" show-icon class="success-alert">
                    注册成功！<br>
                    我们会尽快联系您，开通使用账号
                    <template slot="desc">
                        您可以：
                        <a href="/">返回首页&gt;</a>
                    </template>
                </i-alert>
            </div>
            <div class="card-footer">
                <router-link :to="`/login?from=${$route.query.from || ''}`">直接登录</router-link>
            </div>
        </i-card>
    </div>
</template>
<script src="./register.js" />
<style scoped lang="less" src="./register.less" />
