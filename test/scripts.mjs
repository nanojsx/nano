// @ts-check

import { readFile, readdir, writeFile } from "fs/promises"
import { resolve } from "path"

const args = process.argv.splice(2)
const arg0 = args[0]

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

if (arg0 === "add-jest-environment") {
  const str = "/**\n* @jest-environment node\n*/\n\n"

  for await (const f of getFiles("test")) {
    if (/ssr\.test\.js/.test(f)) {
      const file = await readFile(f, { encoding: "utf-8" })
      await writeFile(f, str + file, { encoding: "utf-8" })
    }
  }

}