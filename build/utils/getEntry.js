/**
 * @ Author: Muniz
 * @ Create Time: 2020-06-12 11:46:25
 * @ Modified by: Muniz
 * @ Modified time: 2020-06-15 11:55:46
 * @ Description: webpack 打包入口配置文件
 */

const path = require('path');
const { SRC_ROOT } = require('./getPath');

const devEntry = path.resolve(SRC_ROOT, 'index.tsx');
const proEntry = path.resolve(SRC_ROOT, 'index.tsx');

const webpackEntry = process.env.NODE_ENV === 'development' ? devEntry : proEntry;

module.exports = {
  webpackEntry,
};
