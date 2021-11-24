const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/bundles/bundle.full.ts',
  output: {
    filename: 'nano.instrumented.min.js',
    path: path.resolve(__dirname, '../bundles'),
    library: 'nanoJSX',
    libraryExport: 'default'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: ['coverage-istanbul-loader', 'ts-loader'] }]
  }
}
