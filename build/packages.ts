import {
  rollup, RollupOptions, OutputOptions
}                    from "rollup"
import {mkdist}      from "mkdist"
import {nodeResolve} from "@rollup/plugin-node-resolve"
import vue2          from "rollup-plugin-vue2"
import vue3          from "rollup-plugin-vue3"
import esbuild       from "rollup-plugin-esbuild"
import fs            from "fs-extra"
import * as path     from "path"
import {
  ROOT_DIR, VUE_ALIAS_PATH
}                    from "build/const"

const outputDir_vue2 = path.resolve(ROOT_DIR, "dist/packages/vue2")
const outputDir_vue3 = path.resolve(ROOT_DIR, "dist/packages/vue3")
const inputDir = path.resolve(ROOT_DIR, "packages")
const inputFile = path.resolve(inputDir, "index.ts")
const tsconfig = path.resolve(ROOT_DIR, "tsconfig.json")
const typeTempDir = path.resolve(ROOT_DIR, "dist/types")

enum TARGET_VERSION {
  vue2 = "vue2",
  vue3 = "vue3",
}

const vuePluginMap = {
  [TARGET_VERSION.vue2]: vue2,
  [TARGET_VERSION.vue3]: vue3,
}

const outputDirMap = {
  [TARGET_VERSION.vue2]: outputDir_vue2,
  [TARGET_VERSION.vue3]: outputDir_vue3,
}

async function main() {
  await build(TARGET_VERSION.vue2)
  await build(TARGET_VERSION.vue3)
}

function build(version: TARGET_VERSION) {
  const rollupOptions: RollupOptions = {
    input: inputFile,
    output: [
      {
        format: "module",
        sourcemap: true,
        dir: outputDirMap[version],
        preserveModules: true,
      }
    ],
    external: [/node_modules/, /vue-runtime-helpers/],
    plugins: [
      {
        name: "fileCRUD",
        load() {
          if (fs.pathExistsSync(outputDirMap[version])) fs.removeSync(outputDirMap[version])
        }
      },
      nodeResolve({
        extensions: [".mjs", ".js", ".json", ".ts"],
      }),
      vuePluginMap[version](),
      esbuild({
        sourceMap: true,
        loaders: {
          ".vue": "ts",
        },
        tsconfig: tsconfig
      }),
    ]
  }
  switch (version) {
    case TARGET_VERSION.vue2:
      fs.outputFileSync(VUE_ALIAS_PATH, "export * from \"vue2\"")
      break
    case TARGET_VERSION.vue3:
      fs.outputFileSync(VUE_ALIAS_PATH, "export * from \"vue3\"")
      break
  }
  return rollup(rollupOptions)
    .then(bundle => {
      const output = rollupOptions.output as OutputOptions[]
      return Promise.all(output.map((option) => bundle.write(option)))
    })
    .then(() => {
      return mkdist({
        rootDir: ROOT_DIR,
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
        const targetFile = path.resolve(sourceFile).replace(typeTempDir, outputDirMap[version])
        fs.copySync(sourceFile, targetFile)
      })
      fs.removeSync(typeTempDir)
    })
}

main()
