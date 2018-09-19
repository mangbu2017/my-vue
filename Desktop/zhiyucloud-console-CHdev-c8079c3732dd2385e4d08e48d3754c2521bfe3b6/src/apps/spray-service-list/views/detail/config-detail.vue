<template>
    <div>
        <div class="config-btn-wrap">
            <i-button :to="`/spray-service-list/detail/${this.$route.params.id}/configMap`">返回configMap列表</i-button>
        </div>

        <codemirror v-model="code" :options="cmOptions" />
    </div>
</template>

<script src="./config-detail.js"></script>

<style scoped src="./config.less" />
