var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
require('autoprefixer');
const path = require('path');


require('babel-polyfill').default;

module.exports = config = {

  entry: "./src/index.js",

  // entry: [
  // //   'bootstrap-loader',
  //   'webpack-hot-middleware/client',
  //   './src/index',
  // ],
  
  output: {
    path: __dirname + "/public/build/",
    publicPath: "build/",
    filename: 'bundle.js',
  },



    resolve: {
      extensions: ['.jsx', '.js', '.json', '.css'],
      // modulesDirectories: ['node_modules', __dirname],
    },
    
    module: {

        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: [/node_modules/]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!autoprefixer-loader",
                exclude: [/node_modules/]
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader",
                exclude: [/node_modules/]
            },
            {
                test: /\.gif$/,
                loader: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.jpg$/,
                loader: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=10000&mimetype=image/png"
            },
            {
                test: /\.svg/,
                loader: "url-loader?limit=26000&mimetype=image/svg+xml"
            },
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                exclude: [/node_modules/]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },

    plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"development"',
    //   },
    //   __DEVELOPMENT__: true,
    // }),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.ProvidePlugin({
    //   jQuery: 'jquery',
    // }),
  ],
}