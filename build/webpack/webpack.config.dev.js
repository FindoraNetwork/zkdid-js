const path = require('path');
const { merge } = require('webpack-merge');
const { HotModuleReplacementPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const base = require('./webpack.config.base');
const config = require('../config');

const { SRC_ROOT } = require('../utils/getPath');

// base.output.publicPath = `http://${config.dev.ip}:${config.dev.port}/`;
base.output.publicPath = '/';

module.exports = merge(base, {
  target: 'web',
  mode: 'development',
  devtool: 'eval-source-map',
  watchOptions: {
    aggregateTimeout: 600,
  },
  devServer: {
    contentBase: path.resolve(SRC_ROOT, './dist'),
    open: true,
    openPage: '',
    hot: true,
    host: config.dev.ip,
    port: config.dev.port,
    compress: true,
    proxy: {
      '/pos/*': {
        target: '',
        changeOrigin: true,
        secure: true,
      },
    },
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: '/index.html' }],
    },
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),

    new HotModuleReplacementPlugin(),

    new ReactRefreshWebpackPlugin(),
  ],
});
