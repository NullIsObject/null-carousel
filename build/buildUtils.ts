import vite from "vite"
import path from "node:path"
import fs from "fs-extra"
import viteVue from "@vitejs/plugin-vue"
import viteJSX from "@vitejs/plugin-vue-jsx"
import * as vueTsc from "vue-tsc"
import ts from "typescript"
import consola from "consola"
import sass from "sass"

const ROOT = path.resolve(__dirname, "../")
const OUT_DIR = "dist/packages/null-carousel"
const ENTRY_DIR = "packages/null-carousel"
const SCSS_INJECT = "packages/null-carousel/private-utils/inject.scss"
const STYLE_ENTRY_DIR = "packages/style"
const PKG_NAME = "null-carousel"
const DEV_PKG_NAME = "null-carousel"
const STYLE_DIR = "styles"
const FILE_CODE = "utf-8"

export async function clean(outDir?: string) {
  outDir ||= OUT_DIR
  await fs.remove(path.resolve(ROOT, outDir))
  await fs.mkdirs(path.resolve(ROOT, outDir))
}

export async function tsc(outDir?: string) {
  outDir ||= OUT_DIR
  const options: ts.CompilerOptions = {
    outDir: path.resolve(ROOT, outDir),
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
  const fullEntryDir = path.resolve(ROOT, ENTRY_DIR)
  const rootNames = await readFilesRecursive({dir: fullEntryDir, include})
  const program = vueTsc.createProgram({rootNames, options, host})
  {
    const diagnostics = getTsDiagnostics(program)
      .filter(item => isPathInsideDirectory(fullEntryDir, item.file?.fileName || ""))
    if (diagnostics.length) {
      consola.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, host))
      throw new Error("ts类型校验失败")
    }
  }
  program.getSourceFiles()
    .filter(sourceFile => isPathInsideDirectory(fullEntryDir, sourceFile.fileName))
    .map(sourceFile => program.__vue.languageService.getEmitOutput(sourceFile.fileName, true).outputFiles)
    .flat()
    .map(outputFile => ts.createSourceFile(outputFile.name, outputFile.text, ts.ScriptTarget.Latest, true))
    .map(sourceFile => transformDtsAlias(sourceFile, outDir))
    .forEach(sourceFile => {
      const fileName = sourceFile.fileName
      const content = ts.createPrinter().printNode(ts.EmitHint.Unspecified, sourceFile, sourceFile)
      forceCreateFile(fileName)
      fs.writeFile(fileName, content, FILE_CODE)
    })
}

export async function build(outDir?: string) {
  outDir ||= OUT_DIR
  const scssInject = getScssInjectCode()
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
            additionalData(content: string) {
              return `${scssInject}${content}`
            },
          }
        }
      },
      build: {
        write,
        outDir: outDir,
        emptyOutDir: false,
        lib: {
          entry: [ENTRY_DIR],
          name: PKG_NAME,
          formats: ["es"]
        },
        rollupOptions: {
          external: ["vue", "lodash"],
          output: {
            preserveModules: true,
            format: "module",
          },
        },
      }
    })
    .then(result => {
      if (write) return
      const fullOutDir = path.resolve(ROOT, outDir)
      const writingList: Promise<ReturnType<typeof fs.writeFile>>[] = []
      const resultList = Array.isArray(result) ? result : [result as vite.Rollup.RollupOutput]
      resultList
        .map(result => result.output)
        .flat()
        .forEach(file => {
          let outputPath = path.resolve(fullOutDir, file.fileName)
          if (file.fileName.endsWith(".css")) {
            outputPath = path.resolve(fullOutDir, STYLE_DIR, file.fileName)
          }
          const content = (file as vite.Rollup.OutputChunk).code || (file as vite.Rollup.OutputAsset).source
          forceCreateFile(outputPath)
          writingList.push(fs.writeFile(outputPath, content, FILE_CODE))
        })
      return Promise.all(writingList)
    })
}

/**
 * @deprecated
 */
export async function buildStyle() {
  const fullEntryDir = normalizePath(path.resolve(ROOT, STYLE_ENTRY_DIR))
  const filenameList = await readFilesRecursive({dir: fullEntryDir, include: [".scss", ".css", ".sass"]})
  const hrefMap: Record<string, string> = {}
  const pendingList = filenameList
    .map(filename => {
      return getSassCode(filename)
        .then(({contents, syntax}) => {
          return sass.compileStringAsync(contents, {
            syntax,
            importers: [
              {
                canonicalize(importer) {
                  if (importer.startsWith("file:")) return new URL(importer)
                  const filePath = normalizePath(path.resolve(filename, "../", importer))
                  const url = new URL(`file:${filePath}`)
                  hrefMap[url.href] = filePath
                  return url
                },
                load({href}) {
                  return getSassCode(hrefMap[href])
                },
              }
            ]
          })
        })
        .then(result => {
          return {
            code: result.css,
            filename: filename
          }
        })
        .catch(err => {
          consola.log(filename)
          consola.error(err)
          return null
        })
    })
  const codeList: { code: string, filename: string }[] = await Promise
    .all(pendingList)
    .then(codeList => codeList.filter(codeItem => !!codeItem))
  if (codeList.length !== pendingList.length) throw new Error("css编译存在错误")

  const result = codeList
    .map(codeItem => codeItem.code)
    .filter(code => !!code)
    .reduce((result, code) => {
      return `${result}${code}\n`
    }, "")

  const filename = forceCreateFile(path.resolve(ROOT, OUT_DIR, STYLE_DIR, "index.css"))
  await fs.writeFile(filename, result, FILE_CODE)
}

export async function outPkgJSON(outDir?: string) {
  outDir ||= OUT_DIR
  const rootPkg: Record<string, any> = await fs.readJSON(path.resolve(ROOT, "package.json"))
  const packagesPkg: Record<string, any> = await fs.readJSON(path.resolve(ROOT, ENTRY_DIR, "package.json"))
  const outputPath = path.resolve(ROOT, outDir, "package.json")
  const finalPkg: Record<string, any> = {
    ...rootPkg,
    ...packagesPkg,
    exports: {
      ".": "./index",
      [`./${STYLE_DIR}/*`]: "./styles/*"
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

export function outReadme(outDir?: string) {
  outDir ||= OUT_DIR
  const src = path.resolve(ROOT, "README.md")
  const dest = path.resolve(ROOT, outDir, "README.md")
  return fs.copy(src, dest)
}

async function readFilesRecursive({dir, include}: { dir: string, include: string[] }) {
  const result: string[] = []
  const files = await fs.readdir(dir)
  for (const file of files) {
    const filepath = normalizePath(path.join(dir, file))
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
  return filePath
}

function isPathInsideDirectory(parentPath: string, childPath: string,) {
  parentPath = path.resolve(parentPath)
  childPath = path.resolve(childPath)
  return childPath.startsWith(parentPath)
}

function getEnvConfig(): Record<string, any> {
  return vite.loadEnv("development", ROOT)
}

function transformDtsAlias<T extends ts.Node>(node: T, outDir: string): T {
  if (
    ts.isStringLiteral(node) &&
    [ts.isImportDeclaration, ts.isExportDeclaration]
      .some(cb => cb(node.parent))
  ) {
    const url = node.getText().slice(1, -1)
    return ts.factory.createStringLiteral(transformAlias(url, node.getSourceFile().fileName, outDir)) as any
  }
  if (ts.isIdentifier(node)) return node

  // @ts-ignore
  return ts.visitEachChild(node, node => transformDtsAlias(node, outDir))
}

function transformAlias(url: string, filePath: string, outDir: string) {
  if (!url.startsWith(DEV_PKG_NAME)) return url
  url = url.replace(DEV_PKG_NAME, path.resolve(ROOT, outDir))
  return path.relative(filePath, url).replace(/\\/g, "/").replace(/^..\//, "./")
}

const sassCodeCache: Record<string, ReturnType<typeof getSassCode>> = {}
function getSassCode(filename: string): Promise<{ contents: string, syntax: sass.Syntax }> {
  filename = normalizePath(filename)
  sassCodeCache[filename] ??= fs
    .readFile(filename, FILE_CODE)
    .then(source => {
      let syntax: sass.Syntax = "scss"
      if (filename.endsWith(".scss")) syntax = "scss"
      if (filename.endsWith(".css")) syntax = "css"
      if (filename.endsWith(".sass")) syntax = "indented"
      const contents = injectVarToSass(source, syntax)
      return {contents, syntax}
    })
  return sassCodeCache[filename].then(d => ({...d}))
}

function injectVarToSass(source: string, syntax: sass.Syntax) {
  const envConfig = getEnvConfig()
  if (["scss", "indented"].includes(syntax)) {
    const scssVarStr = Object
      .keys(envConfig)
      .reduce((result, key) => {
        const value = envConfig[key]
        if (typeof value !== "string") return result
        result += `$${key.toLowerCase()}: ${value}`
        if (syntax === "scss") result += ";"
        if (syntax === "indented") result += "\n"
        return result
      }, "")
    source = `${scssVarStr}${source}`
  }
  return source
}

function getScssInjectCode() {
  const scssInject = fs.readFileSync(path.resolve(ROOT, SCSS_INJECT), FILE_CODE)
  return injectVarToSass(scssInject, "scss")
}

function normalizePath(path: string) {
  return vite.normalizePath(path)
}
