export default {
    path: '/spray-namespace',
    name: 'spray-namespace',
    component: () => import(/* webpackChunkName: "ecs-alga" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "ecs-alga" */ './views/index.vue'),
        },
    ],
};
