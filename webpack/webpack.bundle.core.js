const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/esm/bundles/bundle.core.js',
  output: {
    filename: 'nano.core.min.js',
    path: path.resolve(__dirname, '../bundles'),
    library: 'nano',
    libraryExport: 'default',
  },
}
