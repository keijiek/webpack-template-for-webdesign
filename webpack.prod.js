const { merge } = require('webpack-merge');// merge を使えるように。
const common = require('./webpack.common.js');// 共通コンフィグをマージ
const outputFile = '[name].[chunkhash]';

module.exports = merge(common(outputFile), {
  mode: 'production',
});