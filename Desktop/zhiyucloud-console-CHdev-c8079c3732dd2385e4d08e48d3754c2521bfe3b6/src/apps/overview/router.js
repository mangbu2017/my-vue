export default {
    path: '/',
    name: 'overview',
    component: () => import(/* webpackChunkName: "identity" */ './views/index.vue'),
};
