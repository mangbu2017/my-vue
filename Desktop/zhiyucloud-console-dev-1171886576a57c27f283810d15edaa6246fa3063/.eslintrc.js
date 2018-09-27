module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/strongly-recommended',
        '@vue/airbnb',
    ],
    rules: {
        'class-methods-use-this': 0,
        // Todo：需要添加错误上报，再修改下面规则为'error'
        'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error'] }] : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-param-reassign': [
            'error',
            {
                props: true,
                ignorePropertyModificationsFor: ['state', 'vm', 'item'],
            },
        ],
        'import/extensions': [
            'error',
            'always',
            {
                js: 'never',
                vue: 'always',
            },
        ],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'max-len': [2, 160, 4],
        'vue/attribute-hyphenation': [
            'error',
            'always',
        ],
        'vue/attributes-order': 'error',
        'vue/html-closing-bracket-newline': [
            'error',
            {
                singleline: 'never',
                multiline: 'always',
            },
        ],
        'vue/html-closing-bracket-spacing': 'error',
        'vue/html-end-tags': 'error',
        'vue/html-indent': [
            'error',
            4,
        ],
        'vue/html-quotes': [
            'error',
            'double',
        ],
        'vue/html-self-closing': 'error',
        'vue/max-attributes-per-line': [
            'error',
            {
                singleline: 6,
                multiline: {
                    max: 1,
                    allowFirstLine: false,
                },
            },
        ],
        'vue/no-confusing-v-for-v-if': 'error',
        'vue/no-parsing-error': 'error',
        'vue/no-use-v-if-with-v-for': 'error',
        'vue/no-v-html': 'error',
        'vue/order-in-components': 'error',
        'vue/prop-name-casing': 'error',
        'vue/require-default-prop': 'error',
        'vue/require-prop-types': 'error',
        'vue/script-indent': [
            'error',
            4,
            {
                baseIndent: 0,
                switchCase: 1,
                ignores: [],
            },
        ],
        'vue/this-in-template': 'error',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
