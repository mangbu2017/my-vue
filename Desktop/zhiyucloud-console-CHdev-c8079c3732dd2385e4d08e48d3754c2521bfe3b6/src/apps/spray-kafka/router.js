export default {
    path: '/spray-kafka',
    name: 'spray-kafka',
    component: () => import(/* webpackChunkName: "spray-kafka" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "spray-kafka" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "spray-kafka" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import(/* webpackChunkName: "spray-kafka" */ './views/detail/overview.vue'),
                },
                {
                    path: 'control',
                    name: 'control',
                    component: () => import(/* webpackChunkName: "spray-kafka" */ './views/detail/control.vue'),
                },
            ],
        },
    ],
};
