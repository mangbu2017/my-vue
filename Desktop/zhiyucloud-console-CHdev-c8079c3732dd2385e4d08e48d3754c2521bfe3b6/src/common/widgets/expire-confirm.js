import Vue from 'vue';
import ExpireConfirm from '@/common/components/expire-confirm.vue';

import router from '@/router';

export default function expireConfirm(resolve, reject) {
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
        router,
        render(h) {
            return h(ExpireConfirm, {
                on: {
                    'on-ok': wrap(resolve),
                    'on-close': wrap(reject, { message: '二次授权失败' }),
                },
            });
        },
    });

    component = instance.$mount();

    document.body.appendChild(component.$el);
}
