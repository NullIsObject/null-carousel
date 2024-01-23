import {defineConfig} from "vite"
import vue            from "@vitejs/plugin-vue2"
import path           from "path"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 配置路径别名
    alias: {
      "src": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    },
  }
})
