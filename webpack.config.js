const path = require('path')
const shell = require('shelljs')

shell.cd(path.resolve(__dirname))
shell.rm('-rf', './public')
shell.mkdir('./public')
shell.cp('./src/index.html', './public')
shell.cp('./src/logo.png', './public')

const config = {
  entry: {
    'script': path.resolve(__dirname, './src/script.js')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json']
  },
  output: {
    path: path.resolve(__dirname, './public/'),
    filename: '[name].js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          limit: 0,
          name: '[name]-[hash:4].[ext]'
        }
      }
    ]
  }
}

module.exports = config
