const CompressionPlugin = require("compression-webpack-plugin")
const { defineConfig } = require('@vue/cli-service')

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,

  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@': resolve('src'),
  //       'src': path.resolve(__dirname, '../src'),
  //       'static': path.resolve(__dirname, '../static'),
  //       'api': path.resolve(__dirname, '../src/api')
  //     },
  //   },
  //   output: {
  //     chunkFilename: '[chunkhash:8].chunk.js'
  //   }
  // }

  chainWebpack: (config) => {
    // 生产环境，开启js\css压缩
    // if (process.env.NODE_ENV === 'product') {
      config.plugin('compressionPlugin').use(new CompressionPlugin({
        test: /\.(js|css|less|map)$/, // 匹配文件名
        threshold: 1024, // 对超过10k的数据压缩
        minRatio: 0.8,
      }))
    // }

  },


})
