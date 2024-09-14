import * as buildUtils from "./buildUtils"
import {watch} from "gulp"
import path from "node:path"
import {normalizePath} from "vite"

const root = path.resolve(__dirname, "../")
const entryDir = "packages/null-carousel"
const watchDir = `${normalizePath(path.resolve(root, entryDir))}/**`
const outDir = "packages/dist"

export function dev() {
  return build().finally(() => {
    watch([watchDir], (resolve) => {
      build().finally(resolve)
    })
  })
}

export async function build() {
  await buildUtils.clean(outDir)
  await buildUtils.tsc(outDir)
  await buildUtils.build(outDir)
  await buildUtils.outPkgJSON(outDir)
  await buildUtils.outReadme(outDir)
}
