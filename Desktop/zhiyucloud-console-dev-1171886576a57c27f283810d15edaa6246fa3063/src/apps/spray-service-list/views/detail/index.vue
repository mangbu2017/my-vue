<template>
    <div class="content-wrap">
        <div class="tab-wrap">
            <i-menu
                :active-name="current"
                mode="horizontal"
                class="menu-wrap"
            >
                <i-menu-item
                    :to="`/spray-service-list/detail/${$route.params.id}`"
                    name="deployment"
                >部署</i-menu-item>
                <i-menu-item
                    :to="`/spray-service-list/detail/${$route.params.id}/pod`"
                    name="pod"
                >容器组</i-menu-item>
                <i-menu-item
                    :to="`/spray-service-list/detail/${$route.params.id}/service`"
                    name="service"
                >服务</i-menu-item>
                <i-menu-item
                    :to="`/spray-service-list/detail/${$route.params.id}/configMap`"
                    name="configMap"
                >配置字典</i-menu-item>
            </i-menu>
            <i-button
                v-try-back="{path: '/spray-service-list/:page(\\d+)?/:keyword?', fallback: '/spray-service-list'}"
                type="primary"
                class="return-list"
            >返回服务列表</i-button>
        </div>

        <router-view />
    </div>
</template>
<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.current = to.name;
        });
    },
})
export default class Detail extends Vue {
    current = '';
}
</script>
<style scoped src="../index.less"></style>
