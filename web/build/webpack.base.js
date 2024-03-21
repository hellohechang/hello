const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/page/home/index.js',
    login: './src/page/login/index.js',
    edit: './src/page/edit/index.js',
    history: './src/page/history/index.js',
    note: './src/page/note/index.js',
    notes: './src/page/notes/index.js',
    pic: './src/page/pic/index.js',
    log: './src/page/log/index.js',
    bmk: './src/page/bmk/index.js',
    trash: './src/page/trash/index.js',
    root: './src/page/root/index.js',
    sharebm: './src/page/sharebm/index.js',
    sharelist: './src/page/sharelist/index.js',
    sharemusic: './src/page/sharemusic/index.js',
    sharefile: './src/page/sharefile/index.js',
    videoplay: './src/page/videoplay/index.js',
    file: './src/page/file/index.js',
    notepad: './src/page/notepad/index.js',
  },
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: resolve(__dirname, '../../server/static'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/page/sharefile/index.html',
      filename: 'sharefile/index.html',
      chunks: ['sharefile'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/file/index.html',
      filename: 'file/index.html',
      chunks: ['file'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/login/index.html',
      filename: 'login/index.html',
      chunks: ['login'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/home/index.html',
      filename: 'index.html',
      chunks: ['main'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/notepad/index.html',
      filename: 'notepad/index.html',
      chunks: ['notepad'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/log/index.html',
      filename: 'log/index.html',
      chunks: ['log'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/bmk/index.html',
      filename: 'bmk/index.html',
      chunks: ['bmk'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/edit/index.html',
      filename: 'edit/index.html',
      chunks: ['edit'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/history/index.html',
      filename: 'history/index.html',
      chunks: ['history'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/note/index.html',
      filename: 'note/index.html',
      chunks: ['note'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/notes/index.html',
      filename: 'notes/index.html',
      chunks: ['notes'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/pic/index.html',
      filename: 'pic/index.html',
      chunks: ['pic'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/trash/index.html',
      filename: 'trash/index.html',
      chunks: ['trash'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/root/index.html',
      filename: 'root/index.html',
      chunks: ['root'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/sharebm/index.html',
      filename: 'sharebm/index.html',
      chunks: ['sharebm'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/sharemusic/index.html',
      filename: 'sharemusic/index.html',
      chunks: ['sharemusic'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/sharelist/index.html',
      filename: 'sharelist/index.html',
      chunks: ['sharelist'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/page/videoplay/index.html',
      filename: 'videoplay/index.html',
      chunks: ['videoplay'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|mp3)$/i,
        type: 'asset',
        generator: {
          filename: 'images/img/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          esModule: false,
        },
      },
    ],
  },
};
