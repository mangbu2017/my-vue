<template>
    <div class="content-wrap">
        <div class="tab-wrap">
            <i-menu
                :active-name="current"
                mode="horizontal"
                class="menu-wrap"
            >
                <i-menu-item
                    :to="`/spray-rabbit/detail/${$route.params.id}`"
                    name="overview"
                >实例详情</i-menu-item>
                <i-menu-item
                    :to="`/spray-rabbit/detail/${$route.params.id}/control`"
                    name="control"
                >性能监控</i-menu-item>
            </i-menu>
            <i-button
                v-try-back="{path: '/spray-rabbit/:page(\\d+)?/:keyword?', fallback: '/spray-rabbit'}"
                type="primary"
                class="return-list"
            >返回实例列表</i-button>
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
<style scoped>
.content-wrap {
    padding: 10px 50px 80px;
}

.tab-wrap {
    position: relative;
}

.return-list {
    position: absolute;
    top: 20px;
    right: 0;
    z-index: 1000;
}

</style>
