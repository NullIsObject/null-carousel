import * as gulpfile from "./buildUtils"
import {watch} from "gulp"
import path from "node:path"
import {normalizePath} from "vite"

const ROOT = path.resolve(__dirname, "../")
const ENTRY_DIR = "packages/null-carousel"
const watchDir = `${normalizePath(path.resolve(ROOT, ENTRY_DIR))}/**`

export function build(){
  return gulpfile.build().finally(() => {
    watch([watchDir], (resolve) => {
      gulpfile.build().finally(resolve)
    })
  })
}
