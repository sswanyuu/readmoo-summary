const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    entry: {
      background: './src/background/index.js',
      popup: './src/popup/index.js',
      content: './src/content/index.js',
      options: './src/options/index.js'
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
          use: [MiniCssExtractPlugin.loader, 'css-loader']
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
            from: 'src/popup/index.html',
            to: 'popup.html'
          },
          {
            from: 'src/popup/index.css',
            to: 'popup.css'
          },
          {
            from: 'src/content/index.css',
            to: 'content.css'
          },
          {
            from: 'src/shared/styles/base.css',
            to: 'styles.css'
          },
          {
            from: 'src/options/index.html',
            to: 'options.html'
          },
          {
            from: 'src/options/index.css',
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
