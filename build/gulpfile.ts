import {
  series, parallel
}           from "gulp"
import {
  build as vite
}           from "vite"
import path from "path"
import fs   from "fs-extra"
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
  await fs.remove(path.resolve(root, outDir))
  await fs.mkdirs(path.resolve(root, outDir))
}

export async function tsc() {
  const compilerOptions: CompilerOptions = {
    outDir: path.resolve(root, outDir),
    allowJs: true,
    declaration: true,
    incremental: true,
    // skipLibCheck: true,
    strict: true,
    emitDeclarationOnly: true,
  }
  {
    const include = [".vue", ".ts", ".tsx"]
    const dir = path.resolve(root, entryDir)
    createProgram({
      rootNames: readFilesRecursive({dir, include}),
      options: compilerOptions,
      host: createCompilerHost(compilerOptions)
    }).emit()
  }
  {
    const include = [".d.ts"]
    const dir = path.resolve(root, outDir)
    const fileList = readFilesRecursive({dir, include})
    for (const fileName of fileList) {
      let content = fs.readFileSync(fileName).toString()
      content = content.replaceAll("@null-carousel/packages", "null-carousel")
      fs.writeFileSync(fileName, content)
    }
  }
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

export async function outPkgJSON() {
  const rootPkg: Record<string, any> = fs.readJSONSync(path.resolve(root, "package.json"))
  const packagesPkg: Record<string, any> = fs.readJSONSync(path.resolve(root, "packages", "package.json"))
  const outputPath = path.resolve(root, outDir, "package.json")
  const finalPkg: Record<string, any> = {
    ...rootPkg,
    ...packagesPkg,
    exports: {
      ".": "./index"
    }
  }
  finalPkg.name = rootPkg.name
  finalPkg.dependencies = packagesPkg.dependencies
  finalPkg.devDependencies = packagesPkg.devDependencies
  finalPkg.peerDependencies = packagesPkg.peerDependencies
  finalPkg.packageManager = void 0
  finalPkg.scripts = void 0
  finalPkg.engines = void 0
  fs.writeJSONSync(outputPath, finalPkg, {spaces: 2})
}

export function outReadme() {
  const src = path.resolve(root, "README.md")
  const dest = path.resolve(root, outDir, "README.md")
  return fs.copy(src, dest)
}

function readFilesRecursive({dir, include}: { dir: string, include: string[] }) {
  const result: string[] = []

  for (const file of fs.readdirSync(dir)) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)
    const isInclude = include.some(fileSuffix => file.endsWith(fileSuffix))
    if (stat.isFile() && !isInclude || file === "node_modules") continue
    if (stat.isDirectory()) {
      result.push(...readFilesRecursive({dir: filepath, include}))
    } else {
      result.push(filepath)
    }
  }

  return result
}

export default series(initOutDir, parallel(tsc, build, outPkgJSON, outReadme))