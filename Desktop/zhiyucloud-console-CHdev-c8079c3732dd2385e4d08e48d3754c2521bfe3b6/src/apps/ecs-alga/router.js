export default {
    path: '/ecs-alga',
    name: 'ecs-alga',
    component: () => import(/* webpackChunkName: "ecs-alga" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "ecs-alga" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "ecs-alga" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import(/* webpackChunkName: "ecs-alga" */ './views/detail/overview.vue'),
                },
                {
                    path: 'database/:page(\\d+)?/:keyword?',
                    name: 'database',
                    component: () => import(/* webpackChunkName: "ecs-alga" */ './views/detail/database.vue'),
                },
                {
                    path: 'account/:page(\\d+)?/:keyword?',
                    name: 'account',
                    component: () => import(/* webpackChunkName: "ecs-alga" */ './views/detail/account.vue'),
                },
            ],
        },
    ],
};
