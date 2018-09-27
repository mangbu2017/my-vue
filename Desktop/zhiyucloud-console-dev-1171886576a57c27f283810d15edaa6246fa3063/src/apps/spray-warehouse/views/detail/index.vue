<template>
    <div class="content-wrap">
        <div class="tab-wrap">
            <i-menu
                :active-name="current"
                mode="horizontal"
                class="menu-wrap"
            >
                <i-menu-item
                    :to="`/spray-warehouse/detail/${$route.params.id}`"
                    name="overview"
                >镜像基本信息</i-menu-item>
                <i-menu-item
                    :to="`/spray-warehouse/detail/${$route.params.id}/version`"
                    name="version"
                >镜像版本</i-menu-item>
            </i-menu>
            <i-button
                v-if="name === 'overview'"
                :to="`/spray-warehouse/detail/${$route.params.id}/apply`"
                type="primary"
                class="apply-deploy"
            >部署应用</i-button>
            <i-button
                v-try-back="{path: '/spray-warehouse/:page(\\d+)?/:keyword?', fallback: '/spray-warehouse'}"
                type="default"
                class="return-list"
            >返回镜像仓库列表</i-button>
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
            vm.name = to.name;
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.name = to.name;
        next();
    },
})
export default class Detail extends Vue {
    current = '';
    name = '';
}
</script>
<style scoped>
.content-wrap {
    padding: 10px 50px 80px;
}

.tab-wrap {
    position: relative;
}

.apply-deploy{
    position: absolute;
    top: 20px;
    right: 140px;
    z-index: 1000;
}

.return-list {
    position: absolute;
    top: 20px;
    right: 0;
    z-index: 1000;
}

</style>
