import { writeFile } from 'fs/promises'

const pkgModule = {
  type: 'module'
}

const pkgCommonjs = {
  type: 'commonjs'
}

await writeFile('esm/package.json', JSON.stringify(pkgModule, null, 2), { encoding: 'utf-8' })
await writeFile('lib/package.json', JSON.stringify(pkgCommonjs, null, 2), { encoding: 'utf-8' })
