const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  
  return {
    entry: {
      background: './src/background.js',
      popup: './src/popup.js',
      content: './src/content.js',
      options: './src/options.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'icons/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'src/manifest.json',
            to: 'manifest.json'
          },
          {
            from: 'src/icons',
            to: 'icons',
            noErrorOnMissing: true
          },
          {
            from: 'src/popup.html',
            to: 'popup.html'
          },
          {
            from: 'src/popup.css',
            to: 'popup.css'
          },
          {
            from: 'src/content.css',
            to: 'content.css'
          },
          {
            from: 'src/options.html',
            to: 'options.html'
          },
          {
            from: 'src/options.css',
            to: 'options.css'
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      })
    ],
    resolve: {
      extensions: ['.js', '.json']
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    devtool: isProduction ? false : 'source-map',
    stats: {
      children: false,
      chunks: false,
      modules: false
    }
  }
}
