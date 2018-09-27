export default {
    path: '/spray-echinus',
    name: 'spray-echinus',
    component: () => import(/* webpackChunkName: "spray-echinus" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "spray-echinus" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "spray-echinus" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import(/* webpackChunkName: "spray-echinus" */ './views/detail/overview.vue'),
                },
                {
                    path: 'control',
                    name: 'control',
                    component: () => import(/* webpackChunkName: "spray-echinus" */ './views/detail/control.vue'),
                },
            ],
        },
    ],
};
