/**
 * Get the version number and store it in src/version.ts
 */
const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.resolve(__dirname, '../package.json'))
const package = JSON.parse(file)
const version = package.version

fs.writeFile(path.resolve(__dirname, '../src/version.ts'), `export const VERSION = '${version}'`, () => {
  process.exit()
})
