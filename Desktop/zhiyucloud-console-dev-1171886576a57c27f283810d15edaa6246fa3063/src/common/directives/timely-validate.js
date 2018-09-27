// 用于尽早消除表单错误

/**
 * # 表单验证时机
 * 表单共有两种：
 * 1. 选择型；
 * 2. 输入型。
 *
 * 针对选择型表单，建议设置默认值，如果不能设置默认值，直接设置检验时机为**change**（单个表单的blur意义不大，一组表单的blur比较复杂，保证用户操作体验的前提下先简化处理）。
 *
 * 输入型表单的验证时机
 * 1. input表单第一次提交表单验证的时机是**blur**（初次输入时，让用户保持安静以完整输入，避免初次输入时对用户的频繁干扰）；
 * 2. 当验证触发后（1中的blur或表单的提交触发），将输入型表单的验证时机调整为**change**（尽快消除错误，让用户尽早恢复喜悦）。
 *
 * ## 注意
 * 该指令未实现非blur和非submit的触发
 *
 */
export default {
    bind(el, binding, vnode) {
        const { rules } = vnode.componentInstance;

        if (!rules) {
            return;
        }

        function blurToChange(name) {
            const inputRules = rules[name];
            if (!inputRules || !Array.isArray(inputRules) || inputRules.length === 0) {
                return;
            }

            setTimeout(() => {
                inputRules.forEach((item) => {
                    if (item.trigger === 'blur') {
                        item.trigger = 'change';
                    }
                });
            }, 500);
        }

        function handleSubmit() {
            const keys = Object.keys(rules);
            keys.forEach(blurToChange);
            el.removeEventListener('submit', handleSubmit, true);
        }

        function handleBlur(event) {
            const { name, tagName } = event.target;

            if (tagName !== 'INPUT' || !name) {
                return;
            }

            blurToChange(name);
        }

        // 事件的监听后续可以考虑使用passive配置以提高性能
        el.addEventListener('submit', handleSubmit, true);
        el.addEventListener('blur', handleBlur, true);
    },

    inserted() { },

    update() { },

    componentUpdated() { },

    unbind() { },
};
