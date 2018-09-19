export default {
    path: '/ecs-trepang',
    name: 'ecs-trepang',
    component: () => import(/* webpackChunkName: "ecs-trepang" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "ecs-trepang" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "ecs-trepang" */ './views/detail.vue'),
        },
    ],
};
