/**
 * Production origin of the `philosophicalcharacter` Worker.
 *
 * This is the only place in the codebase to change the canonical origin.
 * `astro.config.ts`, sitemap/OG/hreflang helpers, and README all read this.
 * Change it when a custom domain is bound in Cloudflare.
 *
 * Verified 2026-10-18:
 * - https://philosophicalcharacter.andyycrccrhjuswcax.workers.dev → 200, this NOEMA site
 * - https://philosophicalcharacter.andyccr.workers.dev does not resolve
 */
export const CLOUDFLARE_ORIGIN = 'https://philosophicalcharacter.andyycrccrhjuswcax.workers.dev';
