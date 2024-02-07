import {
  rollup, RollupOptions, OutputOptions
}                    from "rollup"
import {mkdist}      from "mkdist"
import {nodeResolve} from "@rollup/plugin-node-resolve"
import vue           from "rollup-plugin-vue"
import esbuild       from "rollup-plugin-esbuild"
import fs            from "fs-extra"
import * as path     from "path"

const rootDir = path.resolve(__dirname, "../")
const outputDir = path.resolve(rootDir, "dist/packages")
const inputDir = path.resolve(rootDir, "packages")
const inputFile = path.resolve(inputDir, "index.ts")
const tsconfig = path.resolve(rootDir, "tsconfig.json")
const typeTempDir = path.resolve(rootDir, "dist/types")

const rollupOptions: RollupOptions = {
  input: inputFile,
  output: [
    {
      format: "module",
      sourcemap: true,
      dir: outputDir,
      preserveModules: true,
    }
  ],
  external: [/node_modules/, /vue-runtime-helpers/],
  plugins: [
    {
      name: "fileCRUD",
      load() {
        if (fs.pathExistsSync(outputDir)) fs.removeSync(outputDir)
      }
    },
    nodeResolve({
      extensions: [".mjs", ".js", ".json", ".ts"],
    }),
    vue(),
    esbuild({
      sourceMap: true,
      loaders: {
        ".vue": "ts",
      },
      tsconfig: tsconfig
    }),
  ]
}
rollup(rollupOptions)
  .then(bundle => {
    const output = rollupOptions.output as OutputOptions[]
    return Promise.all(output.map((option) => bundle.write(option)))
  })
  .then(() => {
    return mkdist({
      rootDir,
      srcDir: inputDir,
      distDir: typeTempDir,
      cleanDist: true,
      loaders: ["js"],
      declaration: true,
    })
  })
  .then(({writtenFiles}) => {
    writtenFiles.forEach(sourceFile => {
      if (!sourceFile.endsWith(".d.ts")) return
      const targetFile = path.resolve(sourceFile).replace(typeTempDir, outputDir)
      fs.copySync(sourceFile, targetFile)
    })
    fs.removeSync(typeTempDir)
  })
