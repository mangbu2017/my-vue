export default {
    path: '/coral',
    name: 'coral',
    component: () => import(/* webpackChunkName: "identity" */ './views/index.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?',
            component: () => import(/* webpackChunkName: "spray-warehouse" */ './views/index.vue'),
        },
    ],
};
