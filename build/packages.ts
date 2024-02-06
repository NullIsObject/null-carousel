import {mkdist}        from "mkdist"
import {build as vite} from "vite"
import vue             from "@vitejs/plugin-vue2"
import {resolve}       from "path"

const rootDir = resolve(__dirname, "../")

mkdist({
  rootDir,
  srcDir: "packages",
  distDir: "dist/packages",
  cleanDist: true,
  declaration: true,
  loaders: ["js", "vue", "sass", "postcss",]
}).then(({writtenFiles}) => {
  // console.log(writtenFiles)
  return vite({
    root: rootDir,
    plugins: [vue()],
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
