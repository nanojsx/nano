const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/bundle.ts',
  output: {
    filename: 'nano.min.js',
    path: path.resolve(__dirname, '../bundle'),
    library: 'nano',
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
  },
}
