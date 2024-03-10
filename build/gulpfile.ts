import {
  series, parallel
}                from "gulp"
import {
  build as vite
}                from "vite"
import {exec}    from "child_process"
import {resolve} from "path"
import {
  remove, writeJson, mkdirs, copy
}                from "fs-extra"
import vue       from "@vitejs/plugin-vue"

const root = resolve(__dirname, "../")
const outDir = "dist/packages"

export async function initOutDir() {
  await remove(resolve(root, outDir))
  await mkdirs(resolve(root, outDir))
}

export function tsc() {
  return new Promise((resolve, reject) => {
    exec("vue-tsc -p ./tsconfig.packages.json", (error, stdout, stderr) => {
      if (error) reject(error)
      else if (stderr) reject(stderr)
      else resolve(stdout)
    })
  })
}

export function build() {
  return vite({
    root,
    plugins: [
      vue(),
    ],
    build: {
      outDir,
      emptyOutDir: false,
      lib: {
        entry: ["packages"],
        name: "null-carousel",
        formats: ["es"]
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          preserveModules: true,
          format: "module",
        },
      },
    }
  })
}

export function outPkgJSON() {
  const rootPkg = require("root/package.json")
  const packagesPkg = require("packages/package.json")
  const outputPath = resolve(root, outDir, "package.json")
  const finalPkg = {
    ...rootPkg,
    ...packagesPkg,
  }
  finalPkg.name = rootPkg.name
  finalPkg.dependencies = packagesPkg.dependencies
  finalPkg.devDependencies = packagesPkg.devDependencies
  finalPkg.peerDependencies = packagesPkg.peerDependencies
  finalPkg.packageManager = void 0
  finalPkg.scripts = void 0
  finalPkg.engines = void 0
  return writeJson(outputPath, finalPkg, {spaces: 2})
}

export function outReadme() {
  const src = resolve(root, "README.md")
  const dest = resolve(root, outDir, "README.md")
  return copy(src, dest)
}

export default series(initOutDir, parallel(tsc, build, outPkgJSON, outReadme))