var webpack = require('webpack');
//var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'eval-source-map',
  context: __dirname,
  entry: [
    'babel-polyfill',
    //'react-hot-loader/patch',
    //'webpack-dev-server/client?http://0.0.0.0:9006',
    //'webpack/hot/only-dev-server',
    'webpack-hot-middleware/client?reload=true',
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js'
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    colors: true,
    historyApiFallback: true,
    inline: false,
    port: 9006,
    hot: true
  },
  module: {
    loaders: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|ico|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          'presets': ['es2015', 'stage-2', 'react'],
          'plugins': ['react-hot-loader/babel']
        },
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  },

  postcss: function() {
    return [autoprefixer];
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      //'Promise': 'es6-promise',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    //new CopyWebpackPlugin([ { from: 'images', to: 'images' } ])
  ]
};

