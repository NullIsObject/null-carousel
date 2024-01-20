import typescript from "@rollup/plugin-typescript"
import vue        from "rollup-plugin-vue"
import fs         from "fs-extra"

export default {
  input: "src/index.js",
  output: {
    format: "module",
    sourcemap: true,
    dir: "dist",
    preserveModules: true,
  },
  external: [/node_modules/],
  plugins: [
    {
      name: "fileCRUD",
      load() {
        try {
          fs.removeSync("./dist")
        } catch (e) {
          console.log(e)
        }
      }
    },
    vue({
      target: "lib"
    }),
    typescript(),
  ],
  watch: {
    clearScreen: true,
    include: "src/**",
  }
}
