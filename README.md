# webpack の設定メモ

## 必須 Plugins

### clean-webpack-plugin
#### 必要な設定
##### common の冒頭
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

##### module.exports下のplugins配列内
plugins: [
  new CleanWebpackPlugin();
]

### html-webpack-plugin
#### インポート
webpack.common.js の冒頭で、必要なクラスをインポート。

const HtmlWebpackPlugin = require('html-webpack-plugin');

#### 設定(plugins配列の要素として)
コピーしたいhtmlファイルの数だけ、次のような設定インスタンスを、plugins配列内に記述する。

new HtmlWebpackPlugin({
  inject: 'body',
  filename: 'index.html',
  template: './src/index.html',
  chunks: ['index'],
}),

##### key の解説
##### inject:
値は body または head.
body なら body Element の末尾に、head なら head element の末尾に、jsファイルを参照するscriptタグが記述される。
##### filename:
dist(出力先ディレクトリ)に出力するhtmlファイルのパス。distまでのパスを除き、その直後のパスを書く。
例：'index.html'と書けば、dist直下にindex.htmlが生成される。
##### template:
出力元となるsrc/内のhtmlファイルの、相対パスか絶対パスを書く。
##### chunk: