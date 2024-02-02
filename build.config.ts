import {defineBuildConfig} from "unbuild"

export default defineBuildConfig({
  outDir: "dist",
  entries: [
    // "./src/index",
    // {
    //   builder: "mkdist",
    //   input: "./src/components/",
    //   outDir: "./dist/components",
    // },
    // {
    //   builder: "mkdist",
    //   input: "./src/utils/",
    //   outDir: "./dist/utils",
    // },
    {
      builder: "mkdist",
      input: "./src",
      outDir: "./dist",
    },
  ],
  declaration: true,
  // sourcemap: true,
  // alias: {
  //   "src": "./src"
  // }
})
