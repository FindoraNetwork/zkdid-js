/**
 * @ Author: Muniz
 * @ Create Time: 2020-06-12 11:51:22
 * @ Modified by: Muniz
 * @ Modified time: 2020-06-12 12:07:49
 * @ Description:
 */
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');
const LESS_PATH_ROOT = path.resolve(SRC_ROOT, './assets/less');

module.exports = {
  PROJECT_ROOT,
  SRC_ROOT,
  LESS_PATH_ROOT,
};
