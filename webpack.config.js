const path = require('path');
const webpack = require('webpack');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const dev = process.env.NODE_ENV === 'dev';

const cssLoaders = [
  { loader: 'css-loader', options: { importLoaders: 1, minimize: !dev } },
];

if (!dev) {
  cssLoaders.push({
    loader: 'postcss-loader',
  });
}

const config = {
  entry: ['./src/css/main.scss', './src/main.js'],
  output: {
    path: path.resolve('./build/assets'),
    filename: dev ? 'bundle.js' : 'bundle.[chunkHash:8].js',
    publicPath: '/assets/',
  },
  watch: dev,
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve('./src'),
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  devtool: dev ? 'cheap-module-eval-source-map' : false,
  devServer: {
    contentBase: path.resolve('./build'),
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve('./src')],
        use: ['babel-loader'],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...cssLoaders, 'sass-loader'],
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssLoaders,
        }),
      },
      {
        test: /\.(woff2?|eot|ttf|otf|wav)(\?.*)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[hash.7].[ext]',
            },
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !dev,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: path.resolve('./'),
      verbose: true,
      dry: false,
    }),
    new ExtractTextPlugin({
      filename: dev ? '[name].css' : '[name].[contentHash:7].css',
      disable: dev,
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: path.resolve('./build/index.html'),
      inject: true,
      minify: {
        removeComments: !dev,
        collapseWhitespace: !dev,
        removeAttributeQuotes: !dev,
      },
      chunkSortMode: 'dependency',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
};

if (!dev) {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }));
  config.plugins.push(new UglifyJSPlugin({
    sourceMap: false,
  }));
  config.plugins.push(new ManifestPlugin());
}

module.exports = config;
