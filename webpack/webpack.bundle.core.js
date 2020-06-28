const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/bundle.core.js',
  output: {
    filename: 'nano.core.min.js',
    path: path.resolve(__dirname, '../bundle'),
    library: 'nano',
    libraryExport: 'default',
  },
}
