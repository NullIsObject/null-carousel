import {
  series, parallel
}           from "gulp"
import {
  build as vite
}           from "vite"
import path from "path"
import {
  remove, writeJson, mkdirs, copy
}           from "fs-extra"
import vue  from "@vitejs/plugin-vue"
import {
  createProgram,
}           from "vue-tsc"
import {
  createCompilerHost, CompilerOptions
}           from "typescript"

const root = path.resolve(__dirname, "../")
const outDir = "dist/packages"
const entryDir = "packages"

export async function initOutDir() {
  await remove(path.resolve(root, outDir))
  await mkdirs(path.resolve(root, outDir))
}

export function tsc() {
  const compilerOptions: CompilerOptions = {
    outDir: path.resolve(root, outDir),
    allowJs: true,
    declaration: true,
    incremental: true,
    skipLibCheck: true,
    strictNullChecks: true,
    emitDeclarationOnly: true,
  }
  return Promise.resolve(createProgram({
    rootNames: [path.resolve(root, entryDir, "index")],
    options: compilerOptions,
    host: createCompilerHost(compilerOptions)
  }).emit())
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
  const outputPath = path.resolve(root, outDir, "package.json")
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
  const src = path.resolve(root, "README.md")
  const dest = path.resolve(root, outDir, "README.md")
  return copy(src, dest)
}

export default series(initOutDir, parallel(tsc, build, outPkgJSON, outReadme))