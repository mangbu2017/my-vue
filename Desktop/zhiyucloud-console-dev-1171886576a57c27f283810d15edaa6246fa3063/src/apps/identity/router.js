import Login from './views/login.vue';

export default [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            layout: 'blank',
        },
    },
    {
        path: '/logout',
        name: 'logout',
        component: () => import(/* webpackChunkName: "identity" */ './views/logout.vue'),
        meta: {
            layout: 'blank',
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "identity" */ './views/register.vue'),
        meta: {
            layout: 'blank',
        },
    },
    {
        path: '/find-password',
        name: 'find-password',
        component: () => import(/* webpackChunkName: "identity" */ './views/find-password.vue'),
        meta: {
            layout: 'blank',
        },
    },
];
