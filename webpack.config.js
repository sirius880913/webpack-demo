const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')

let pathsToClean = [
  'dist',
]

module.exports = {
  entry: {
    'app.bundle': './src/pages/app/index.js',
    'test': './src/pages/test/index.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  devServer: {
    port: 8090,
    open: true,
    compress: true, // gzip压缩
    historyApiFallback: {
      // 配置路由，from中可写正则
      rewrites: [{
        form: '/test',
        to: '/test.html'
      }]
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      include: path.resolve(__dirname, 'src')
    }, {
      test: /\.css/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }, 'postcss-loader']
      })
    }, {
      // 只能处理js与css中的图片
      test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
      use: [{
        loader: 'url-loader',
        options: {
          // 30KB 以下的文件采用 url-loader
          limit: 1024 * 30,
          // 否则采用 file-loader，默认值就是 file-loader
          fallback: 'file-loader',
        }
      }]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean),
    new HtmlWebpackPlugin({
      template: './src/pages/app/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      excludeChunks: ['test']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/test/index.html',
      filename: 'test.html',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      chunks: ['test']
    }),
    new ExtractTextPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    // 打包输出公共文件
    new CommonsChunkPlugin({
      name: 'common'
    }),
    // 压缩输出的 JavaScript 代码
    new UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      }
    })
  ]
}
