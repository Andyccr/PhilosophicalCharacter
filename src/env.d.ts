/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PAYMENT_PROVIDER?: string;
  readonly PUBLIC_CF_ANALYTICS_TOKEN?: string;
  readonly SITE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
