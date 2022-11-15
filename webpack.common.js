const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// エントリーポイントの設定：
// 第一引数は、entryポイントの配列で、配列の各要素はentryポイントたり得るファイルのパス(path.resolveで作成)。
// 第二引数は、付随する設定群のオブジェクト。以下の場合、ignore キーの内容として、無視されるべきファイルのパスが指定されている。
const entries = WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, './src/js/**/*.js')], {
  ignore: path.resolve(__dirname, './src/js/**/_*.js'),
})();

// 関数。html-webpack-plugin の設定インスタンスを、エントリーポイントとなるjsファイルと同じ個数生成。
// distにコピーしたいhtmlファイルと同名のjsファイルをエントリーポイントとして用意しておく必要がある。
// module.exports.plugins内に、スプレッド構文(...htmlGlobPlugins(entries, srcPath))で書く必要がある。jsは0文字のダミーでもよい。
// 第一引数=エントリーポイントの設定オブジェクト, 第二引数=htmlファイルに至る直前までのパス(htmlが入っているディレクトリ)
const htmlGlobPlugins = (entries, srcPath='./src') => {
  return Object.keys(entries).map((key) =>
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: `${key}.html`,
      template: `${srcPath}/${key}.html`,
      chunks: [key],
    })
  );
};

// exports 関数に引数を設定する場合、devとprodでしっかり引数を渡さないとエラーになりかねない。
// module.exports 下の主要なキーは、entry, output, module.rules[], plugins[], 
module.exports = (outputFile) => ({
  // webpack-watched-glob-entries-plugin を使って上記で作成された設定オブジェクトの変数 entries を用いている。
  // 本当は、entry キーの値として複数個のentry pointsを記述するのだが、将来的なエントリーポイントの増減に対応するため、同pluginを使っている。
  entry: entries,

  //出力先Dir=./distと、出力ファイルネームの指定。${outputFIle}の値は、各設定ファイル(dev/pro)の冒頭で代入する。
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `./js/${outputFile}.js`,
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('auoprefixer')({grid:true})],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
      // Asset-Modules(webpack5デフォルトモジュール)の設定
      {
        test: /\.(png|jpe?g|gif|svg)/i,
        generator: {
          filename: `./img/[name].[contenthash][ext]`,
        },
        type: 'asset/resource',
      },
      // html-loader モジュール設定
      {
        test: /.html$/i,
        loader: 'html-loader',
      },
    ],
  },

  // 使うPluginの指定。配列。
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackWatchedGlobEntries(),
    ...htmlGlobPlugins(entries, './src/html')
  ]
});