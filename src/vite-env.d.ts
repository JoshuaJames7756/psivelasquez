/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  /** "1" activa el panel y el login (V3). Vacío en la V1. */
  readonly VITE_PANEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
