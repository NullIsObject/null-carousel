import * as buildUtils from "./buildUtils"
import {watch} from "gulp"
import path from "node:path"
import {normalizePath} from "vite"

const root = path.resolve(__dirname, "../")
const entryDir = "packages/null-carousel"
const watchDir = `${normalizePath(path.resolve(root, entryDir))}/**`
const outDir = "packages/dist"

export async function dev() {
  return build().finally(() => {
    watch([watchDir], (resolve) => {
      build().finally(resolve)
    })
  })
}

export function build() {
  return Promise.all([
    buildUtils.tsc(outDir),
    buildUtils.build(outDir),
    buildUtils.outPkgJSON(outDir),
    buildUtils.outReadme(outDir),
  ])
}
