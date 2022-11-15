const { merge } = require('webpack-merge');// merge を使えるように。
const common = require('./webpack.common.js');// 共通コンフィグをマージ
const outputFile = '[name]';

// webpack.common.js の方で要求されている引数を渡すこと。
module.exports = merge(common(outputFile), {
  mode: 'development',
  devtool: 'source-map',
  // devtool: 'eval-source-map',
});