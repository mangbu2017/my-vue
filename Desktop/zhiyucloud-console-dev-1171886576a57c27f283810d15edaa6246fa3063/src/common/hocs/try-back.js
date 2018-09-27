import pathToRegexp from 'path-to-regexp';
// 未解决刷新问题，刷新问题需要用Session的思路
// 注意调用细节，引入后才执行setTiterval，时机比较晚

const histories = [];

setInterval(() => {
    const { pathname } = window.location;
    if (histories[histories.length - 1] !== pathname) {
        histories.push(pathname);
    }
}, 500);


export default (Component => ({
    props: {
        path: {
            type: String,
            default: '',
        },
        fallback: {
            type: String,
            default: '',
        },
    },

    components: {
        Component,
    },

    methods: {
        click(event) {
            debugger;
            const re = pathToRegexp(this.path);

            event.preventDefault();
            if (re.test(histories[histories.length - 2])) {
                this.$router.back();
                histories.pop();
            } else {
                this.$router.push(this.fallback);
            }
        },
    },

    render(h) {
        return h(Component, {
            attrs: this.$attrs,
            nativeOn: { click: this.click },
        }, this.$slots.default);
    },
}));
