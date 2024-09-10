import {defineConfig} from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  envDir: "../../",
  plugins: [
    vue(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData() {
          return ""
        },
      }
    }
  },
})
