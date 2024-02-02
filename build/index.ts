import {build, BuildConfig} from "unbuild"

const rootDir = "../"

const config: BuildConfig = {
  outDir: "dist",
  entries: [
    {
      builder: "mkdist",
      input: "./packages",
      outDir: "./dist",
    },
  ],
  declaration: true,
}

build(rootDir, false, config).then((...args) => {
  console.log(args)
})