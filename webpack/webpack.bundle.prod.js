const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    core: './src/bundles/bundle.core.ts',
    slim: './src/bundles/bundle.slim.ts',
    full: './src/bundles/bundle.full.ts',
    ui: './src/bundles/bundle.ui.ts'
  },
  output: {
    filename: 'nano.[name].min.js',
    path: path.resolve(__dirname, '../bundles'),
    library: 'nanoJSX',
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
  },
}
