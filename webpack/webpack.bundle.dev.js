const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './lib/esm/bundles/bundle.js',
  output: {
    filename: 'nano.dev.min.js',
    path: path.resolve(__dirname, '../bundles'),
    library: 'nano',
    libraryExport: 'default',
  },
}
