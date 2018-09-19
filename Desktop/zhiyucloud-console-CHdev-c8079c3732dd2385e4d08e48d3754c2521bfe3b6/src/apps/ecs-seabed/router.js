export default {
    path: '/ecs-seabed',
    name: 'ecs-seabed',
    component: () => import(/* webpackChunkName: "ecs-seabed" */ './app.vue'),
    children: [
        {
            path: 'create',
            component: () => import(/* webpackChunkName: "ecs-seabed" */ './views/create.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "ecs-seabed" */ './views/detail.vue'),
        },
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "ecs-seabed" */ './views/index.vue'),
        },
    ],
};
