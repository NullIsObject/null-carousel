import {
  series, parallel
}                  from "gulp"
import {
  build as vite
}                  from "vite"
import path        from "path"
import fs          from "fs-extra"
import viteVue     from "@vitejs/plugin-vue"
import viteJSX     from "@vitejs/plugin-vue-jsx"
import * as vueTsc from "vue-tsc"
import ts          from "typescript"
import consola     from "consola"

const ROOT = path.resolve(__dirname, "../")
const OUT_DIR = "dist/packages"
const ENTRY_DIR = "packages"
const PKG_NAME = "null-carousel"
// const DEV_PKG_NAME = "@null-carousel/packages"
const DEV_PKG_NAME = "null-carousel"

export async function clean() {
  await fs.remove(path.resolve(ROOT, OUT_DIR))
  await fs.mkdirs(path.resolve(ROOT, OUT_DIR))
}

export async function tsc() {
  const options: ts.CompilerOptions = {
    outDir: path.resolve(ROOT, OUT_DIR),
    allowJs: true,
    declaration: true,
    incremental: true,
    strict: true,
    emitDeclarationOnly: true,
    jsx: ts.JsxEmit.Preserve,
    jsxImportSource: "vue"
  }
  const host = ts.createCompilerHost(options)
  const include = [".vue", ".ts", ".tsx"]
  const dir = path.resolve(ROOT, ENTRY_DIR)
  const rootNames = await readFilesRecursive({dir, include})
  const program = vueTsc.createProgram({rootNames, options, host})
  const diagnostics = getTsDiagnostics(program)
  if (diagnostics.length) {
    consola.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, host))
    return
  }
  const sourceFiles = program.getSourceFiles()
  const outputFiles: ts.OutputFile[] = []
  // TODO
  sourceFiles.forEach(sourceFile => {
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isImportDeclaration(node) && isPathInsideDirectory(path.resolve(ROOT, ENTRY_DIR), node.getSourceFile().fileName)) {
        console.log(node.getSourceFile().fileName)
        console.log(node.getText())
        console.log("///////////////")
      }
    })
  })
  for (const sourceFile of sourceFiles) {
    const files = program.__vue.languageService.getEmitOutput(sourceFile.fileName, true).outputFiles
    outputFiles.push(...files)
  }
  for (const outputFile of outputFiles) {
    const content = outputFile.text.replaceAll(DEV_PKG_NAME, PKG_NAME)
    forceCreateFile(outputFile.name)
    await fs.writeFile(outputFile.name, content, "utf-8")
  }
}

export function build() {
  return vite({
    root: ROOT,
    plugins: [
      viteVue(),
      viteJSX(),
    ],
    build: {
      outDir: OUT_DIR,
      emptyOutDir: false,
      lib: {
        entry: [ENTRY_DIR],
        name: PKG_NAME,
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

export async function outPkgJSON() {
  const rootPkg: Record<string, any> = await fs.readJSON(path.resolve(ROOT, "package.json"))
  const packagesPkg: Record<string, any> = await fs.readJSON(path.resolve(ROOT, "packages", "package.json"))
  const outputPath = path.resolve(ROOT, OUT_DIR, "package.json")
  const finalPkg: Record<string, any> = {
    ...rootPkg,
    ...packagesPkg,
    exports: {
      ".": "./index"
    }
  }
  finalPkg.name = rootPkg.name
  finalPkg.dependencies = packagesPkg.dependencies
  finalPkg.peerDependencies = packagesPkg.peerDependencies
  finalPkg.devDependencies = void 0
  finalPkg.packageManager = void 0
  finalPkg.scripts = void 0
  finalPkg.engines = void 0
  await fs.writeJSON(outputPath, finalPkg, {spaces: 2})
}

export function outReadme() {
  const src = path.resolve(ROOT, "README.md")
  const dest = path.resolve(ROOT, OUT_DIR, "README.md")
  return fs.copy(src, dest)
}

async function readFilesRecursive({dir, include}: { dir: string, include: string[] }) {
  const result: string[] = []
  const files = await fs.readdir(dir)
  for (const file of files) {
    const filepath = path.join(dir, file)
    const stat = await fs.stat(filepath)
    const isInclude = include.some(fileSuffix => file.endsWith(fileSuffix))
    if (stat.isFile() && !isInclude || file === "node_modules") continue
    if (stat.isDirectory()) {
      result.push(...await readFilesRecursive({dir: filepath, include}))
    } else {
      result.push(filepath)
    }
  }

  return result
}

function getTsDiagnostics(program: ts.Program) {
  return [
    ...program.getDeclarationDiagnostics(),
    ...program.getSemanticDiagnostics(),
    ...program.getSyntacticDiagnostics()
  ]
}

function forceCreateFile(filePath: string) {
  if (!fs.pathExistsSync(filePath)) fs.createFileSync(filePath)
  if (!fs.statSync(filePath).isFile()) {
    fs.removeSync(filePath)
    fs.createFileSync(filePath)
  }
}

function isPathInsideDirectory(parentPath: string, childPath: string,) {
  parentPath = path.resolve(parentPath)
  childPath = path.resolve(childPath)
  return childPath.startsWith(parentPath)
}

export const orderlyBuild = series(clean, tsc, build, outPkgJSON, outReadme)

export default series(clean, parallel(tsc, build, outPkgJSON, outReadme))
