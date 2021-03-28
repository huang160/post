module.exports = {
  devServer: {
    port: 3333,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000/assets',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/_variable.scss";`
      }
    }
  }
}
