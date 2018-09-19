import pathToRegexp from 'path-to-regexp';
// 也可以用全局插件，解决更彻底的session会话问题

const storegeKey = '__HISTORIES__';
const histories = [];

window.addEventListener('DOMContentLoaded', () => {
    histories.push(...JSON.parse(sessionStorage.getItem(storegeKey) || '[]'));
    setInterval(() => {
        const { pathname } = window.location;
        if (histories[histories.length - 1] !== pathname) {
            histories.push(pathname);
        }
    }, 500);
}, false);

window.addEventListener('beforeunload', () => {
    try {
        sessionStorage.setItem(storegeKey, JSON.stringify(histories));
    } catch (ex) {
        console.warn(ex);
    }
}, false);

// 在页面1和页面2中均绑定popstate事件
window.addEventListener('popstate', () => {
    histories.pop();
}, false);

export default {
    bind(el, binding, vnode) {
        const { path, fallback } = binding.value;
        const { $router } = vnode.componentInstance;
        const re = pathToRegexp(path);

        el.addEventListener('click', (event) => {
            event.preventDefault();
            if (re.test(histories[histories.length - 2])) {
                $router.back();
                histories.pop();
            } else {
                $router.push(fallback);
            }
        }, true);
    },

    inserted() { },

    update() { },

    componentUpdated() { },

    unbind() { },
};
