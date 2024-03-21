const { resolve } = require('path');
const { merge } = require('webpack-merge');

module.exports = merge(require('./webpack.base'), {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  devServer: {
    static: {
      directory: resolve(__dirname, '..', 'src'),
    },
    compress: true,
    port: 3001,
    open: true,
    // hot: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        // secure: false,
        // changeOrigin: true,
        // target: 'https://h.hellochang.eu.org/',
        // pathRewrite: { '^/api': '' },
      },
    },
  },
  mode: 'development',
  devtool: 'source-map',
});
