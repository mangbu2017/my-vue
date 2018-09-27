export default {
    path: '/spray-warehouse',
    name: 'spray-warehouse',
    component: () => import(/* webpackChunkName: "spray-warehouse" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "spray-warehouse" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "spray-warehouse" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import(/* webpackChunkName: "spray-warehouse" */ './views/detail/overview.vue'),
                },
                {
                    path: 'version',
                    name: 'version',
                    component: () => import(/* webpackChunkName: "spray-warehouse" */ './views/detail/version.vue'),
                },
            ],
        },
        {
            path: 'detail/:id/apply',
            name: 'apply',
            component: () => import(/* webpackChunkName: "spray-warehouse" */ './views/detail/apply.vue'),
        },
    ],
};
