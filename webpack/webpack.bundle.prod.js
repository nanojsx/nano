const path = require('path')

module.exports = {
  mode: 'production',
  stats: 'errors-warnings',
  entry: {
    core: './lib/bundles/bundle.core.js',
    slim: './lib/bundles/bundle.slim.js',
    full: './lib/bundles/bundle.full.js',
    ui: './lib/bundles/bundle.ui.js'
  },
  output: {
    filename: 'nano.[name].min.js',
    path: path.resolve(__dirname, '../bundles'),
    library: 'nanoJSX',
    libraryExport: 'default'
  },
  resolve: {
    extensions: ['.js']
  }
}
