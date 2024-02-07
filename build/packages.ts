import {mkdist}        from "mkdist"
import {build as vite} from "vite"
import vue             from "@vitejs/plugin-vue2"
import {resolve}       from "path"
import dts             from "rollup-plugin-dts"

const rootDir = resolve(__dirname, "../")

mkdist({
  rootDir,
  srcDir: "packages",
  distDir: "dist/packages",
  cleanDist: true,
  declaration: true,
  loaders: ["js", "vue", "sass", "postcss",],
}).then(({writtenFiles}) => {
  // console.log(writtenFiles)
  return vite({
    root: rootDir,
    plugins: [vue(), dts({
      tsconfig: resolve(rootDir, "./tsconfig.json")
    })],
    build: {
      emptyOutDir: false,
      outDir: "dist/packages-final",
      sourcemap: true,
      lib: {
        entry: "dist/packages",
        formats: ["es"],
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue",
          },
        },
      },
    }
  })
})
