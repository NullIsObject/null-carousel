import {defineConfig} from "vite"
import vue            from "@vitejs/plugin-vue"

export default defineConfig({
  server: {
    open: "index.html"
  },
  plugins: [
    vue(),
  ],
})
