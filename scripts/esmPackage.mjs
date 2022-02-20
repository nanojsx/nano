import { writeFile } from 'fs/promises'

const pkg = {
  type: 'module'
}

await writeFile('esm/package.json', JSON.stringify(pkg, null, 2), { encoding: 'utf-8' })
