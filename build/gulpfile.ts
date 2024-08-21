import {series, parallel} from "gulp"
import vite from "vite"
import path from "path"
import fs from "fs-extra"
import viteVue from "@vitejs/plugin-vue"
import viteJSX from "@vitejs/plugin-vue-jsx"
import * as vueTsc from "vue-tsc"
import ts, {ImportAttribute} from "typescript"
import consola from "consola"
import dotenv from "dotenv"

const ROOT = path.resolve(__dirname, "../")
const OUT_DIR = "dist/packages/null-carousel"
const ENTRY_DIR = "packages/null-carousel"
const PKG_NAME = "null-carousel"
// const DEV_PKG_NAME = "@null-carousel/packages"
const DEV_PKG_NAME = "null-carousel"
const STYLE_DIR = "styles"

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
    jsxImportSource: "vue",
    module: ts.ModuleKind.ESNext,
    esModuleInterop: true,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    // configFilePath: "./tsconfig.json"
  }
  const host = ts.createCompilerHost(options)
  const include = [".vue", ".ts", ".tsx"]
  const dir = path.resolve(ROOT, ENTRY_DIR)
  const rootNames = await readFilesRecursive({dir, include})
  const program = vueTsc.createProgram({rootNames, options, host})
  {
    const diagnostics = getTsDiagnostics(program)
    if (diagnostics.length) {
      consola.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, host))
      return
    }
  }
  const sourceFiles = program.getSourceFiles()
  const outputFiles: ts.OutputFile[] = []
  // sourceFiles.forEach(sourceFile => {
  //   ts.visitNode(sourceFile, node => {
  //     if (!isPathInsideDirectory(path.resolve(ROOT, ENTRY_DIR), node.getSourceFile().fileName)) {
  //       return node
  //     }
  //
  //     return undefined
  //     console.log(node.kind)
  //     if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node) || ts.isStringLiteral(node)) {
  //       console.log("/////////////////")
  //       console.log((node as ts.SourceFile).getText())
  //     }
  //
  //     // if (ts.isImportAttribute(node) || ts.isImportTypeNode(node) ||
  //     //   // 节点
  //     //   ts.isImportDeclaration(node) || ts.isExportDeclaration(node) ||
  //     //   // 叶子节点
  //     //   ts.isStringLiteral(node)
  //     // ) {
  //     //   console.log("/////////////////////////////")
  //     //   console.log((node as ts.SourceFile).text)
  //     // }
  //
  //     return node
  //     // const oldText = node.getText()
  //     // const newText = oldText.replaceAll(DEV_PKG_NAME, "aaaaaaaaaaaaaaaaaaaa")
  //
  //     // ts.factory.updateImportAttribute()
  //
  //     // try {
  //     //   return node.update(newText, ts.createTextChangeRange(ts.createTextSpan(0, oldText.length), newText.length))
  //     // } catch {
  //     //   console.log(node.fileName)
  //     //   return node
  //     // }
  //     // return node.update(newText, ts.createTextChangeRange(ts.createTextSpan(0, oldText.length), newText.length))
  //   })
  // })

  // // TODO
  // sourceFiles.forEach(sourceFile => {
  //   const nodeList: ts.Node[] = []
  //   if (isPathInsideDirectory(path.resolve(ROOT, ENTRY_DIR), sourceFile.getSourceFile().fileName)) {
  //     nodeList.push(...expandTheTsNode(sourceFile))
  //   }
  //   for (const node of nodeList) {
  //     if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
  //       node.forEachChild(node => {
  //         if (ts.isStringLiteral(node)) {
  //           ts.factory.createStringLiteral("test")
  //           node._updateExpressionBrand
  //           console.log(node.getText())
  //         }
  //       })
  //     }
  //   }
  // })
  sourceFiles
    .filter(sourceFile => isPathInsideDirectory(path.resolve(ROOT, ENTRY_DIR), sourceFile.fileName))
    .forEach(sourceFile => {
      // TODO 一次循环代表一个文件
      // 将visitNode作为一颗新的树输出
      // 参考test.ts
      ts.visitNode(sourceFile, node => {
        return ts.visitNode(node, node => {
          console.log(node.kind)
          if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
            ts.visitNode(node, node => {
              if (ts.isStringLiteral(node)) {
                return ts.factory.createStringLiteral("test")
              }
              return node
            })
          }
          return node
        })
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

export async function build() {
  const write = false
  return vite
    .build({
      root: ROOT,
      envDir: "./",
      plugins: [
        viteVue(),
        viteJSX(),
      ],
      css: {
        preprocessorOptions: {
          scss: {
            additionalData(content: string, path: string) {
              const envConfig = getEnvConfig()
              let scssVarStr = ""
              for (const key in envConfig) {
                const value = envConfig[key]
                if (typeof value !== "string") continue
                scssVarStr += `$${key.toLowerCase()}: ${value};`
              }
              return `${scssVarStr}${content}`
            },
          }
        }
      },
      build: {
        write,
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
    .then(result => {
      if (write) return
      const outDir = path.resolve(ROOT, OUT_DIR)
      const writingList: Promise<ReturnType<typeof fs.writeFile>>[] = []
      const resultList = Array.isArray(result) ? result : [result as vite.Rollup.RollupOutput]
      for (const result of resultList) {
        for (const file of result.output) {
          let outputPath = path.resolve(outDir, file.fileName)
          if (file.fileName.endsWith(".css")) {
            outputPath = path.resolve(outDir, STYLE_DIR, file.fileName)
          }
          const content = (file as vite.Rollup.OutputChunk).code || (file as vite.Rollup.OutputAsset).source
          forceCreateFile(outputPath)
          writingList.push(fs.writeFile(outputPath, content, "utf-8"))
        }
      }
      return Promise.all([writingList])
    })
}

export async function outPkgJSON() {
  const rootPkg: Record<string, any> = await fs.readJSON(path.resolve(ROOT, "package.json"))
  const packagesPkg: Record<string, any> = await fs.readJSON(path.resolve(ROOT, ENTRY_DIR, "package.json"))
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

export const orderlyBuild = series(clean, tsc, build, outPkgJSON, outReadme)

export default series(clean, parallel(tsc, build, outPkgJSON, outReadme))

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

function expandTheTsNode(node: ts.Node) {
  const result = [node]
  ts.forEachChild(node, node => {
    result.push(node)
    if (!ts.isIdentifier(node)) {
      result.push(...expandTheTsNode(node))
    }
  })
  return result
}

function getEnvConfig(): Record<string, any> {
  return dotenv.config({path: path.resolve(ROOT, "./.env")}).parsed || {}
}
