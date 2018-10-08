const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

require("babel-core/register");
require("babel-polyfill");

const PAGES_PATH = './src/app'

function generateHtmlPlugins(items) {
  return items.map( (name) => new HtmlPlugin(
    {
      filename: `./${name}.html`,
      chunks: [ name ],
    }
  ))
}

module.exports = {
  entry: {
    background: [
      'babel-polyfill',
      `${PAGES_PATH}/scripts/background.js`,
    ],
    popup: [
      'babel-polyfill',
      `${PAGES_PATH}/popup`,
    ],
    contentscript: [
      'babel-polyfill',
      `${PAGES_PATH}/scripts/contentscript.js`,
    ]
  },
  output: {
    path: path.resolve('dist/app'),
    filename: '[name].js'
  },

   module: {
    rules: [
      {
        test: /\.js$/,
        use: [ 'babel-loader' ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
        use: 'file-loader?name=[name].[ext]?[hash]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/fontwoff'
      },
      {
        test: /\.css$/,
        loaders: ["style-loader","css-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: [ 'file-loader' ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(
      {
        filename: '[name].[contenthash].css',
      }
    ),
    new CopyPlugin(
      [
        {
          from: 'src',
          to: path.resolve('dist'),
          ignore: [ 'app/**/*' ]
        }
      ]
    ),
    ...generateHtmlPlugins(
      [
        'popup'
      ]
    )
  ]
}