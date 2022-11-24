const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:81',
        secure: false,
      },
      '/api': {
        target: 'http://127.0.0.1:81',
        secure: false,
      },
    },
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/variables.scss";
          @import "@/scss/mixins.scss";
        `,
      },
    },
  },

  chainWebpack: (config) => {
    config.module
      .rule('svg')
      .clear()
      .test(/\.svg$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        outputPath: 'img/icons/',
        name: '[name].[contenthash:8].svg',
      })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .options({
        plugins: [
          {
            name: 'convertColors',
            params: {
              currentColor: true,
            },
          },
        ],
      });
  },
});
