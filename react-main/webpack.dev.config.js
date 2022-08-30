const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
var webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  entry: './src/index-dev.tsx',
  mode: 'development',
  devServer: {
    hot: true,
  },

  plugins: [
    new ReactRefreshWebpackPlugin(),
    [
      'prismjs', {
      languages: ['javascript', 'css', 'markup', 'java'],
      plugins: ['line-numbers'],
      theme: 'twilight',
      css: true
      }
    ]
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-refresh/babel'],
          },
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js', '.json', '.tsx'],
  },

  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },

  plugins: [new HtmlWebpackPlugin({
    template: 'index.html',
    hash: true, // Cache busting
    filename: '../dist/index.html',
  }),  
  new webpack.HotModuleReplacementPlugin],
};
