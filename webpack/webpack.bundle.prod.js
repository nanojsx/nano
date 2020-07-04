const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/esm/bundles/bundle.js',
  output: {
    filename: 'nano.min.js',
    path: path.resolve(__dirname, '../bundles'),
    library: 'nano',
    libraryExport: 'default',
  },
}
