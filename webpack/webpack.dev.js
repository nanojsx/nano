const path = require('path')

module.exports = {
  mode: 'development',
  stats: 'errors-warnings',
  devtool: 'inline-source-map',
  entry: './lib/dev/dev.js',
  output: {
    filename: 'dev.js',
    path: path.resolve(__dirname, '../dev')
  },
  resolve: {
    extensions: ['.js']
  }
  // module: {
  //   rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  // }
}
