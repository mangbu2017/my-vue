<script>
import Vue from 'vue';
import Component from 'vue-class-component';

import request from '@/common/utils/request';

import BlankLayout from './common/layouts/blank-layout.vue';
import FrameLayout from './common/layouts/frame-layout.vue';


@Component({
})
export default class App extends Vue {
    loading = true;

    created() {
        // Todo: 这段写法不合适，和权限整体考虑（需要同时考虑组件的分块加载的影响）。
        request({
            url: '/auth/user/checkInSession',
        }).then(() => {
            this.loading = false;
            if (this.$route.path === '/login') {
                const { from } = this.$route.query;
                if (from) {
                    this.$router.replace(decodeURIComponent(from));
                } else {
                    this.$router.replace('/');
                }
            }
        }).catch(() => {
            this.loading = false;
            const base = process.env.BASE_URL.replace(/\/$/, '');
            const re = new RegExp(`^${base}(/.*|$)`);
            const { search } = window.location;
            const pathname = window.location.pathname.replace(re, '$1');

            if (['/login', '/register', '/find-password'].indexOf(pathname) === -1) {
                const from = encodeURIComponent(pathname + search);
                this.$router.replace(`/login?from=${from}`);
            }
        });
    }

    render(h) {
        if (this.loading) {
            return h('div', { attrs: { id: 'app' } }, [
                h('i-spin', [
                    h('i-icon', { props: { type: 'ios-loading', size: 18 }, class: 'spin-icon-load' }),
                    h('div', [
                        '加载中...',
                    ]),
                ]),
            ]);
        }

        const { meta } = this.$route;
        const Layout = meta && meta.layout === 'blank' ? BlankLayout : FrameLayout;

        return h('div', { attrs: { id: 'app' } }, [
            h(Layout, [
                h('router-view', { slot: 'content' }),
            ]),
        ]);
    }
}
</script>

<style scoped lang="less">
    .spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>
