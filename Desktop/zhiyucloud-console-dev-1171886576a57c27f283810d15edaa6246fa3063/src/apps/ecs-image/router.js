export default {
    path: '/ecs-image',
    name: 'ecs-image',
    component: () => import(/* webpackChunkName: "ecs-image" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "ecs-image" */ './views/index.vue'),
        },
    ],
};
