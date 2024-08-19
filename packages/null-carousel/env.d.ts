/// <reference types="vite/types/importMeta.d.ts" />
interface ImportMetaEnv {
  readonly VITE_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}