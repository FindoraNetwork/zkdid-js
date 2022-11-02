const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');

const { webpackEntry } = require('../utils/getEntry');
const { PROJECT_ROOT, SRC_ROOT, LESS_PATH_ROOT } = require('../utils/getPath');

const pkgJson = require('../../package.json');

const config = require('../config');

module.exports = {
  entry: webpackEntry,
  output: {
    path: path.resolve(PROJECT_ROOT, 'dist'),
    globalObject: 'this',
    chunkFilename: 'async/js/[name].[contenthash:8].js',
    filename: 'js/[name].[contenthash:8].js',
  },
  experiments: {
    // outputModule: true,
    topLevelAwait: true,
    asyncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: ['babel-loader'],
        exclude: [/node_modules/],
      },
      // {
      //   test: /\.js$/,
      //   use: ['source-map-loader'],
      //   enforce: 'pre',
      // },
      {
        test: /\.css$/,
        use: [
          {
            loader: process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              sourceMap: process.env.NODE_ENV === 'development',
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: config.theme,
              },
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [path.resolve(LESS_PATH_ROOT, 'less-var.less')],
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: [/\.(woff(2)?|eot|otf|svg)$/],
        type: 'asset/inline',
      },
      {
        test: [/\.(ico|png|jpe?g|gif)$/],
        type: 'asset/resource',
        generator: {
          filename: 'images/[name]-[hash:7][ext][query]',
        },
      },
      {
        test: /\.(eot|mp4|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.wasm', 'json'],
    modules: [SRC_ROOT, path.resolve(PROJECT_ROOT, './node_modules')],
    alias: {
      _src: SRC_ROOT,
      _components: path.resolve(SRC_ROOT, './components/'),
      _containers: path.resolve(SRC_ROOT, './containers/'),
      _constants: path.resolve(SRC_ROOT, './constants/'),
      _utils: path.resolve(SRC_ROOT, './utils'),
      _assets: path.resolve(SRC_ROOT, './assets'),
      _abis: path.resolve(SRC_ROOT, './abis'),
    },
    fallback: {
      os: require.resolve('os-browserify/browser'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      stream: require.resolve('stream-browserify'),
      path: false,
      util: require.resolve("util/"),
      assert: require.resolve('assert/'),
      fs: false,
      // net: false,
      // tls: false,
      // zlib: false,
      // crypto: false,
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      // zlib: require.resolve('browserify-zlib'),
    },
  },
  plugins: [
    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),
    // new CopyWebpackPlugin({ patterns: [{ from: 'public/images/', to: 'images' }] }),
    // new CopyWebpackPlugin({ patterns: [{ from: 'public/static/', to: 'static' }] }),
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_ROOT, './public/index.html'),
      filename: 'index.html',
      title: 'Muniz-Tpl-React',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'async/css/[name].[contenthash:8].css',
      ignoreOrder: false,
    }),
    new DefinePlugin({
      'process.env.VERSION_APP': JSON.stringify(pkgJson.version),
    }),
    new ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
