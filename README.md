# NOEMA

NOEMA is an exploratory philosophical questionnaire. It asks what assumptions you use when you think about reality, knowledge, morality, freedom, meaning, and social life. It does not diagnose personality, mental health, intelligence, or character, and it is not a validated psychometric instrument.

The name comes from the Greek νόημα, “that which is thought,” later a technical term in Husserl. The site is not an exposition of Husserl.

English is the canonical editorial language. The Chinese interface uses a project glossary of standard philosophical terms and should be read as an editorial translation.

## Develop

```bash
npm install
npm run dev
```

Scoring still runs in the browser. Paid copy is assembled by the Cloudflare Worker after a verified PayPal capture. There is no account system and no AI API.

```bash
npm test
npm run build
npm run preview
npm run test:e2e
```

`npm run dev` is the Astro UI only (`/api/*` is not served). For checkout and unlock locally:

```bash
cp .dev.vars.example .dev.vars
# fill sandbox PayPal credentials and UNLOCK_HMAC_KEY
npx wrangler kv namespace create PURCHASES
# put the returned id in wrangler.toml, then:
npm run build && npx wrangler dev
```

Playwright needs a browser once: `npx playwright install chromium`.

## Deploy

Cloudflare Workers is the primary host (`wrangler.toml` name `philosophicalcharacter`). The Worker serves `/api/*` and static assets from `dist/`.

- Build command: `npm run build`
- Deploy command: `npm run deploy` (`wrangler deploy`)
- Output directory: `dist`

Do not put PayPal secrets in client code or in `wrangler.toml`. GitHub Pages deploy is unchanged by this Worker API.

## Scoring

The rules are also on `/methodology`. In short:

- Each axis is a directional index from 0 to 100.
- 0 is the strongest modeled lean toward the left pole. 100 is the strongest lean toward the right pole.
- 50 is the midpoint of the directional answers that were given. It is not neutrality, and it is not produced by a skip or by “I cannot determine.”
- Below 40 is read as the left pole, 40–60 as mixed, and above 60 as the right pole. These cuts are design assumptions.
- If disagreement among directional weights is at least 0.5 and the index is strictly between 25 and 75, the axis is treated as mixed.
- An axis is insufficient without a score, with fewer than three directional answers, or with coverage under one half.
- A six-letter code is definitive only when every axis is clearly left or right. Mixed axes with a nearer pole produce a provisional code and a warning. A missing score, or an index of exactly 50, withholds the 64-type classification.
- Compatibilist and nihilist response options are recorded and do not move the index. Compatibilism is not the midpoint of the agency axis.

The code letters, in fixed order, are:

| Axis | Left | Right |
| --- | --- | --- |
| Reality | M physicalism | I idealism |
| Knowledge | E empiricism | R rationalism |
| Morality | C consequentialism | D deontology |
| Freedom | D determinism | L libertarian free will |
| Meaning | F discovery | C creation |
| Social life | I individual priority | C communal priority |

Families are an editorial map of reality, meaning, and social priority. They are not statistical clusters. Epistemology, ethics, and agency distinguish the eight profiles inside each family.

| Reality | Meaning | Society | Family |
| --- | --- | --- | --- |
| Physicalism | Discovery | Individual | Explorers |
| Physicalism | Discovery | Communal | Harmonists |
| Physicalism | Creation | Individual | Creators |
| Physicalism | Creation | Communal | Pragmatists |
| Idealism | Discovery | Individual | Seekers |
| Idealism | Discovery | Communal | Guardians |
| Idealism | Creation | Individual | Transcendents |
| Idealism | Creation | Communal | Architects |

Shared links carry indices and a disagreement flag. They do not carry the answers. A shared link can omit detail that the local result still has. The results URL is excluded from the sitemap and marked `noindex`.

## Limits

Virtue ethics, care ethics, and Confucian role ethics are not poles of the moral axis. Madhyamaka is not the idealism pole. Daoist philosophy is not the libertarian pole. Political “libertarianism” is not the letter L. A creation-of-meaning score is not nihilism.

There is no reference population, so the site does not show percentiles or confidence percentages. The current tension rules do not mark any of the famous pairings as a formal logical contradiction.

## Later validation

A real study could preregister the item bank; recruit beyond self-selected visitors; report item statistics, test-retest stability, and English–Chinese equivalence; and use cognitive interviews. The 40 and 60 cuts should be replaced only if that evidence justifies new ones.

## Payment

The questionnaire is free to complete. The results page shows the six-letter code, editorial family, and a shareable summary. Indices, the full reading, and tension notes are returned only from `POST /api/profile` after the Worker verifies a PayPal Orders v2 capture.

Live charges stay **off** until you flip them. `PAYMENTS_LIVE` defaults to `false` and `PAYPAL_ENV` defaults to `sandbox`. The live PayPal API is used only when **both** `PAYMENTS_LIVE=true` and `PAYPAL_ENV=live`.

### Owner setup (PayPal + Cloudflare)

1. In the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/), create an app.
2. Copy the **sandbox** Client ID and Secret. Do not start with live credentials.
3. Enable Checkout / Orders v2 for that app. Do not use a no-code hosted payment link.
4. In Cloudflare, create KV:

```bash
npx wrangler kv namespace create PURCHASES
```

Put the returned id in `wrangler.toml` under `[[kv_namespaces]]` (`binding = "PURCHASES"`).

5. Put Worker secrets (never commit the values):

```bash
npx wrangler secret put PAYPAL_CLIENT_ID
npx wrangler secret put PAYPAL_CLIENT_SECRET
npx wrangler secret put UNLOCK_HMAC_KEY
```

`UNLOCK_HMAC_KEY` should be a long random string (at least 32 characters). Example: `openssl rand -base64 48`.

6. Leave the `[vars]` block as shipped:

```toml
PAYMENTS_LIVE = "false"
PAYPAL_ENV = "sandbox"
```

7. Only when sandbox checkout, capture, restore, and unlock are verified, switch to live:
   - Create a **live** PayPal app and put those credentials with the same `wrangler secret put` commands.
   - Set `PAYPAL_ENV = "live"` **and** `PAYMENTS_LIVE = "true"` in `wrangler.toml` (or the Cloudflare dashboard vars) and redeploy.
   - If either flag is not live, the Worker keeps calling `https://api-m.sandbox.paypal.com`.

### Restore

The Worker does not send email. KV stores a SHA-256 of the normalized payer email plus the PayPal order id. Restore is: user enters **email + order id**. Both must match. The Worker then issues a new HMAC unlock token. Tokens are stored in `localStorage` (`noema.access.v1`) and sent as `Authorization: Bearer`, never as cookies.

### PDF

`GET /api/report.pdf` checks the unlock token, then returns **501**. There is no server-side PDF (Workers Free CPU is too tight, and a CJK font must not be bundled into the Worker). Use the results page print stylesheet and the browser’s “Save as PDF”.

## Fonts and privacy

Source Serif 4, Source Sans 3, and IBM Plex Mono are served from the site build under the SIL Open Font License. Chinese text falls back to fonts already on the device, so the page does not download a full CJK webfont.

The default experience stores answers and the theme choice in `localStorage`. It does not set cookies or load third-party analytics. See `/privacy`. Hosting on Cloudflare Pages may still create ordinary connection logs under Cloudflare’s own policy.
