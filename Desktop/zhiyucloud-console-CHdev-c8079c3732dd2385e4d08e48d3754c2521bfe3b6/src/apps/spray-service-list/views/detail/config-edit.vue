<template>
    <div class="edit-wrap">
        <div class="page-title">
            <h2>服务配置修改</h2>

            <i-button
                v-try-back="{path: '/spray-service-list/:page(\\d+)?/:keyword?', fallback: '/spray-service-list'}"
                type="primary"
                class="btn-back"
            >返回</i-button>
        </div>

        <codemirror v-model="code" :options="cmOptions" />

        <div class="config-btn-wrap">
            <i-button
                :loading="status === 'request'"
                type="primary"
                @click="handleSubmit"
                @on-enter="handleSubmit"
            >
                <span v-if="status !== 'request'">更新</span>
                <span v-else>提交中...</span>
            </i-button>
            <i-button
                v-try-back="{path: '/spray-service-list/:page(\\d+)?/:keyword?', fallback: '/spray-service-list'}"
                type="default"
            >取消</i-button>
        </div>
    </div>
</template>

<script src="./config-edit.js"></script>

<style scoped src="./config.less" />
