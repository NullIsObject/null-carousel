import {defineConfig} from "vite"
import vue            from "@vitejs/plugin-vue"
import {resolve}      from "path"

export const root = resolve(__dirname, "../")
export const outDir = "dist"

export default defineConfig({
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
