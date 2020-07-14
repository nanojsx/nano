const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/bundles/bundle.core.ts',
  output: {
    filename: 'nano.core.min.js',
    path: path.resolve(__dirname, '../bundles'),
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
