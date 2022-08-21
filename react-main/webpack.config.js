const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
var webpack = require('webpack');

module.exports = {
  entry: "./src/index.tsx",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },


  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/
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
    ]
  },

  
  resolve: {
    extensions: ['.ts', '.js', '.json', '.tsx']
  },


  plugins: [new HtmlWebpackPlugin({
    template: "index.html",
    hash: true, // Cache busting
    filename: '../dist/index.html'
  }),
  new webpack.HotModuleReplacementPlugin],
}

