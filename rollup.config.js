import {nodeResolve} from "@rollup/plugin-node-resolve"
import vue           from "rollup-plugin-vue"
import esbuild       from "rollup-plugin-esbuild"
import fs            from "fs-extra"

export default {
  input: "packages/index.ts",
  output: {
    format: "module",
    sourcemap: true,
    dir: "dist",
    preserveModules: true,
  },
  external: [/node_modules/, /vue-runtime-helpers/],
  plugins: [
    {
      name: "fileCRUD",
      load() {
        if (fs.pathExistsSync("./")) fs.removeSync("./dist")
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
    }),
  ]
}
