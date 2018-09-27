import Vue from 'vue';
import iView from 'iview';
import iViewShim from './common/utils/iview-shim';
import './common/filters';
import './common/directives';
import './common/styles/index.less';

import App from './app.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(iView, {
    transfer: true,
});

iViewShim();

Vue.prototype.$Message.config({
    duration: 3,
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
