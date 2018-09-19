export default {
    path: '/spray-alga',
    name: 'spray-alga',
    component: () => import(/* webpackChunkName: "spray-alga" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "spray-alga" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "spray-alga" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import(/* webpackChunkName: "spray-alga" */ './views/detail/overview.vue'),
                },
                {
                    path: 'database/:page(\\d+)?/:keyword?',
                    name: 'database',
                    component: () => import(/* webpackChunkName: "spray-alga" */ './views/detail/database.vue'),
                },
                {
                    path: 'account/:page(\\d+)?/:keyword?',
                    name: 'account',
                    component: () => import(/* webpackChunkName: "spray-alga" */ './views/detail/account.vue'),
                },
                {
                    path: 'control',
                    name: 'control',
                    component: () => import(/* webpackChunkName: "spray-alga" */ './views/detail/control.vue'),
                },
            ],
        },
    ],
};
