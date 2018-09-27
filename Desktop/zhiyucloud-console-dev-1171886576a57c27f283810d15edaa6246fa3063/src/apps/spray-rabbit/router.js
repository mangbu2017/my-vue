export default {
    path: '/spray-rabbit',
    name: 'spray-rabbit',
    component: () => import(/* webpackChunkName: "spray-rabbit" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "spray-rabbit" */ './views/index.vue'),
        },
        {
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "spray-rabbit" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'overview',
                    component: () => import(/* webpackChunkName: "spray-rabbit" */ './views/detail/overview.vue'),
                },
                {
                    path: 'control',
                    name: 'control',
                    component: () => import(/* webpackChunkName: "spray-rabbit" */ './views/detail/control.vue'),
                },
            ],
        },
    ],
};
