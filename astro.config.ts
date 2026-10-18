import path from 'node:path';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { includeInSitemap } from './src/lib/seo/sitemap';
import { CLOUDFLARE_ORIGIN } from './src/lib/site';

export default defineConfig({
  // Default canonical origin is the Cloudflare Worker. GitHub Pages and other
  // hosts can override with SITE / BASE_PATH without changing this file.
  // The Pages workflow does not set these today, so that build keeps base `/`
  // and inherits the Cloudflare canonical (the production origin).
  site: process.env.SITE ?? CLOUDFLARE_ORIGIN,
  base: process.env.BASE_PATH ?? '/',
  output: 'static',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  redirects: {
    '/zh': '/',
  },
  integrations: [
    react(),
    sitemap({
      filter: includeInSitemap,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});
