import { copyFile } from "node:fs/promises"

// Publish generated entrypoints at the package root, never the dist directory.
for (const filename of ["index.js", "index.d.ts", "index.js.map"]) {
  await copyFile(
    new URL(`../dist/${filename}`, import.meta.url),
    new URL(`../${filename}`, import.meta.url),
  )
}
