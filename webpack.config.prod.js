var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: [
    'babel-polyfill',
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      { test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
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
        test: /\.styl$/,
        loader: 'style!css!postcss!stylus?paths=node_modules'
      },
      { test: /\.js$|\.jsx$/,
        exclude: [/node_modules/],
        loaders: [
          'babel?' + JSON.stringify({presets: ['es2015', 'stage-2', 'react']})
        ]
      }
    ]
  },

  postcss: function() {
    return [autoprefixer({ browsers: ['iOS >= 4', 'ie >= 8', 'ff > 10'] })];
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};

