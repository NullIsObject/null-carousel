import * as buildUtils from "./buildUtils"
import {parallel, series} from "gulp"

export function clean() {
  return buildUtils.clean()
}

export function tsc() {
  return buildUtils.tsc()
}

export function build() {
  return buildUtils.build()
}

export function outPkgJSON() {
  return buildUtils.outPkgJSON()
}

export function outReadme() {
  return buildUtils.outReadme()
}

export const orderlyBuild = series(clean, tsc, build, outPkgJSON, outReadme)

export default series(clean, parallel(tsc, build, outPkgJSON, outReadme))
