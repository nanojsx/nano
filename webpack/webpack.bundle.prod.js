const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/bundle.js',
  output: {
    filename: 'nano.min.js',
    path: path.resolve(__dirname, '../bundle'),
    library: 'nano',
    libraryExport: 'default',
  },
}