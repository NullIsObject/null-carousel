import {build, BuildConfig} from "unbuild"

const config: BuildConfig = {
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
}

build("./", false, config).then((...args) => {
  console.log(args)
})