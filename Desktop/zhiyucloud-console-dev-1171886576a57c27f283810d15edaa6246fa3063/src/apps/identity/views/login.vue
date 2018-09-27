<template>
    <div class="container">
        <i-card :padding="33" class="card">
            <h1 class="card-title">账号登录</h1>
            <i-form
                v-timely-validate
                ref="iForm"
                :model="form"
                :rules="rules"
                class="form"
                @submit.native.prevent="submit"
            >
                <i-form-item prop="username">
                    <i-input
                        v-model="form.username"
                        autofocus
                        name="username"
                        placeholder="请输入手机号码"
                        size="large"
                        type="tel"
                    />
                </i-form-item>
                <i-form-item prop="password">
                    <i-input
                        v-model="form.password"
                        name="password"
                        placeholder="请输入密码"
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
                    >登录</i-button>
                </i-form-item>
            </i-form>
            <div class="card-footer">
                <router-link :to="`/find-password?from=${$route.query.from || ''}`">忘记密码</router-link>
                <router-link to="/register">立即注册</router-link>
            </div>
        </i-card>
    </div>
</template>
<script src="./login.js" />
<style scoped lang="less" src="./login.less" />
