import path from 'node:path';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Cloudflare Workers serve at site root. Override via SITE / BASE_PATH if needed.
  site: process.env.SITE ?? 'https://noema.andyccr.workers.dev',
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
      filter: (page) => !/\/results\/?$/.test(page) && !page.includes('/404'),
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
