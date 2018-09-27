export default {
    path: '/spray-service-list',
    name: 'spray-service-list',
    component: () => import(/* webpackChunkName: "spray-service-list" */ './app.vue'),
    children: [
        {
            // 注意路由之间会相互冲突
            path: ':page(\\d+)?/:keyword?',
            component: () => import(/* webpackChunkName: "spray-service-list" */ './views/index.vue'),
        },
        {
            path: 'detail/:id/configEdit',
            name: 'configEdit',
            component: () => import(/* webpackChunkName: "spray-service-list" */ './views/detail/config-edit.vue'),
        },
        {
            // 注意路由之间会相互冲突
            path: 'detail/:id',
            component: () => import(/* webpackChunkName: "spray-service-list" */ './views/detail/index.vue'),
            children: [
                {
                    path: '',
                    name: 'deployment',
                    component: () => import(/* webpackChunkName: "spray-service-list" */ './views/detail/deployment.vue'),
                },
                {
                    path: 'pod',
                    name: 'pod',
                    component: () => import(/* webpackChunkName: "spray-service-list" */ './views/detail/pod.vue'),
                },
                {
                    path: 'service',
                    name: 'service',
                    component: () => import(/* webpackChunkName: "spray-service-list" */ './views/detail/service.vue'),
                },
                {
                    path: 'configMap',
                    name: 'configMap',
                    component: () => import(/* webpackChunkName: "spray-service-list" */ './views/detail/configMap.vue'),
                },
                {
                    path: 'configMapDetail',
                    name: 'configMapDetail',
                    component: () => import(/* webpackChunkName: "spray-service-list" */ './views/detail/config-detail.vue'),
                },
            ],
        },
    ],
};
