import {
  series, parallel
}                from "gulp"
import {
  build as vite
}                from "vite"
import viteConfig, {
  root, outDir
}                from "./vite.config"
import {exec}    from "child_process"
import {resolve} from "path"
import {remove}  from "fs-extra"

export function tsc() {
  return new Promise((resolve, reject) => {
    exec("vue-tsc", (error, stdout, stderr) => {
      if (error) reject(error)
      else if (stderr) reject(stderr)
      else resolve(stdout)
    })
  })
}

export function build() {
  return vite(viteConfig)
}

export function deleteOutDir() {
  return remove(resolve(root, outDir))
}

export default series(deleteOutDir, parallel(tsc, build))