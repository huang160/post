module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network'
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            'text-color': '#111',
            'border-color': '#eee',
            'nav-bar-background-color': '#22c47c',
            'nav-bar-icon-color': '#eee',
            'nav-bar-text-color': '#eee',
            'nav-bar-title-font-size': '20px',
            'nav-bar-title-text-color': '#eee',
            'field-label-width': '3em',
            'field-icon-size': '20px',
            'field-clear-icon-size': '20px',
            'button-primary-background-color': '#22c47c',
            'tabs-bottom-bar-color': '#22c47c',
            'index-anchor-line-height': '42px'
          },
        },
      },
    },
  },
}
//@nav-bar-background-color
