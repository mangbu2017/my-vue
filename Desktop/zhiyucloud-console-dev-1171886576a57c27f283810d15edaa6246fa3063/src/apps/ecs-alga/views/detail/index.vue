<template>
    <div class="content-wrap">
        <div class="tab-wrap">
            <i-menu
                :active-name="current"
                mode="horizontal"
                class="menu-wrap"
            >
                <i-menu-item
                    :to="`/ecs-alga/detail/${$route.params.id}`"
                    name="overview"
                >实例详情</i-menu-item>
                <i-menu-item
                    :to="`/ecs-alga/detail/${$route.params.id}/database`"
                    name="database"
                >数据库管理</i-menu-item>
                <i-menu-item
                    :to="`/ecs-alga/detail/${$route.params.id}/account`"
                    name="account"
                >账户管理</i-menu-item>
            </i-menu>
            <i-button
                v-try-back="{path: '/ecs-alga/:page(\\d+)?/:keyword?', fallback: '/ecs-alga'}"
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
