export default {
    path: '/ecs-seahare',
    name: 'ecs-seahare',
    component: () => import(/* webpackChunkName: "ecs-seahare" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "ecs-seahare" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "ecs-seahare" */ './views/detail.vue'),
        },
    ],
};
