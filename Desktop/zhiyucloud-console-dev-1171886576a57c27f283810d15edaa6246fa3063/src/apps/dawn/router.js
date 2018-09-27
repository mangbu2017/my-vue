export default {
    path: '/dawn',
    name: 'dawn',
    component: () => import(/* webpackChunkName: "identity" */ './views/index.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: '',
            component: () => import(/* webpackChunkName: "spray-warehouse" */ './views/index.vue'),
        },
    ],
};
