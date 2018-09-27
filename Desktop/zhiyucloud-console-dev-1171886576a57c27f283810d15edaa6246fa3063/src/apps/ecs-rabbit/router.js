export default {
    path: '/ecs-rabbit',
    name: 'ecs-rabbit',
    component: () => import(/* webpackChunkName: "ecs-rabbit" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "ecs-rabbit" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "ecs-rabbit" */ './views/detail.vue'),
        },
    ],
};
