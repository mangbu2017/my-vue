import Vue from 'vue';
import ReAuthorize from '@/common/components/re-authorize.vue';

export default function reAuthorize(resolve, reject) {
    let component;

    function wrap(callback, payload) {
        return () => {
            document.body.removeChild(component.$el);
            if (callback) {
                callback(payload);
            }
        };
    }

    const instance = new Vue({
        render(h) {
            return h(ReAuthorize, {
                on: {
                    'on-success': wrap(resolve),
                    'on-failure': wrap(reject, { message: '二次授权失败' }),
                },
            });
        },
    });

    component = instance.$mount();

    document.body.appendChild(component.$el);
}
