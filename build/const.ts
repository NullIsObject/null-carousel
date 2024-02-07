import * as path from "path"
import fs        from "fs-extra"

const ROOT_DIR = path.resolve(__dirname, "../")
const ALIAS_DIR = path.resolve(ROOT_DIR, "depend-alias")
const VUE_ALIAS_PATH = path.resolve(ALIAS_DIR, "vue/index.ts")

if (!fs.pathExistsSync(ROOT_DIR)) throw new Error(`无法读取项目根路径：${ROOT_DIR}`)
if (!fs.pathExistsSync(ALIAS_DIR)) throw new Error(`无法读取别名路径：${ALIAS_DIR}`)
if (!fs.pathExistsSync(VUE_ALIAS_PATH)) throw new Error(`无法读取别名路径：${VUE_ALIAS_PATH}`)

export {
  ROOT_DIR,
  ALIAS_DIR,
  VUE_ALIAS_PATH,
}
