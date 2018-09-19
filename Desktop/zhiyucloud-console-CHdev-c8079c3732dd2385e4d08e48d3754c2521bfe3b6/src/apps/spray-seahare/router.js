export default {
    path: '/spray-seahare',
    name: 'spray-seahare',
    component: () => import(/* webpackChunkName: "spray-seahare" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "spray-seahare" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "spray-seahare" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import(/* webpackChunkName: "spray-seahare" */ './views/detail/overview.vue'),
                },
                {
                    path: 'control',
                    name: 'control',
                    component: () => import(/* webpackChunkName: "spray-seahare" */ './views/detail/control.vue'),
                },
            ],
        },
    ],
};
