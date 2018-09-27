export default {
    path: '/spray-trepang',
    name: 'spray-trepang',
    component: () => import(/* webpackChunkName: "spray-trepang" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "spray-trepang" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "spray-trepang" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import(/* webpackChunkName: "spray-trepang" */ './views/detail/overview.vue'),
                },
                {
                    path: 'control',
                    name: 'control',
                    component: () => import(/* webpackChunkName: "spray-trepang" */ './views/detail/control.vue'),
                },
            ],
        },
    ],
};
