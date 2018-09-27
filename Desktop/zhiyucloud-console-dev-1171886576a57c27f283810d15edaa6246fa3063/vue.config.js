module.exports = {
    baseUrl: '/console',
    assetsDir: 'console-assets',
    transpileDependencies: [
        'luxon',
    ],
    configureWebpack: {
        resolve: {
            mainFields: ['module', 'main'],
        },
    },
    // 暂时没有找到publicPath的单独配置，无法解决CDN的问题
    css: {
        sourceMap: true,

        loaderOptions: {
            less: {
                javascriptEnabled: true,
            },

            postcss: {
                cssnano: {
                    safe: true,
                },
            },
        },
    },

    lintOnSave: 'error',
    // 避免静态资源请求时附带Cookie，最终目的是减少资源请求包的大小
    crossorigin: 'anonymous',
    // 保证资源的安全性，避免劫持后的安全问题
    integrity: true,

    devServer: {
        open: true,
        proxy: {
            '/auth': {
                target: 'http://10.1.13.86:81',
                changeOrigin: true,
                // 删除Set-Cookie 首部中的Domain信息，则按默认值处理10.1.12.44:8083
                // 另外的细节
                // 浏览器对Port的处理存在差异，这是同源策略中的灰色地带，即:80端口的Cookie在Chrome等其他浏览器中会发送到:8080，而Firefox不会）。
                cookieDomainRewrite: '',
            },
            '/*Back': {
                target: 'http://10.1.13.86:81',
                changeOrigin: true,
                // 删除Set-Cookie 首部中的Domain信息，则按默认值处理 10.1.13.86:81
                // 另外的细节
                // 浏览器对Port的处理存在差异，这是同源策略中的灰色地带，即:80端口的Cookie在Chrome等其他浏览器中会发送到:8080，而Firefox不会）。
                cookieDomainRewrite: '',
            },
        },
    },
};
