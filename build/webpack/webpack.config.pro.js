const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const base = require('./webpack.config.base');

base.output.publicPath = '/';

module.exports = merge(base, {
  mode: 'production',
  externals: {},
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          ecma: 6,
          warnings: false,
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
          ie8: false,
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [new CleanWebpackPlugin()],
});
