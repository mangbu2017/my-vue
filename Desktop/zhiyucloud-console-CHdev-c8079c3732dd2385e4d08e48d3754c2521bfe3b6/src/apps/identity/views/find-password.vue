<template>
    <div class="container">
        <i-card :padding="33" class="card">
            <h1 class="card-title">找回密码</h1>
            <i-steps :current="current" class="steps">
                <i-step title="验证身份" />
                <i-step title="重置密码" />
                <i-step title="完成" />
            </i-steps>
            <verify-tel
                v-if="current === 0"
                :status="status"
                @on-success="handleVerifyTelSuccess"
            />
            <reset-password
                v-else-if="current === 1"
                :status="status"
                @on-success="handleResetPasswordSuccess"
            />
            <div v-else-if="current === 2">
                <i-alert type="success" show-icon class="success-alert">
                    密码重置成功！
                    <template slot="desc">
                        请您牢记您新设置的密码。
                        <router-link :to="`/login?from=${$route.query.from || ''}`">返回登录&gt;</router-link>
                    </template>
                </i-alert>
            </div>
            <div class="card-footer">
                <router-link :to="`/login?from=${$route.query.from || ''}`">直接登录</router-link>
            </div>
        </i-card>
    </div>
</template>
<script src="./find-password.js" />
<style scoped lang="less" src="./find-password.less" />
