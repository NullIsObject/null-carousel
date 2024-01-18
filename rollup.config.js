import typescript from "@rollup/plugin-typescript"
import vue        from "rollup-plugin-vue"

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "module",
    sourcemap: true,
  },
  external: [/node_modules/],
  plugins: [
    vue(),
    typescript(),
  ]
}
