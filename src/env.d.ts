/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PAYMENT_PROVIDER?: string;
  readonly SITE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
