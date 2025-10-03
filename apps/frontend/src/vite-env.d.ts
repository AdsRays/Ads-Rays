/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly DEFAULT_NICHE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
