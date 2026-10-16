# NOEMA

NOEMA is an exploratory philosophical questionnaire. It asks what assumptions you use when you think about reality, knowledge, morality, freedom, meaning, and social life. It does not diagnose personality, mental health, intelligence, or character, and it is not a validated psychometric instrument.

The name comes from the Greek νόημα, “that which is thought,” later a technical term in Husserl. The site is not an exposition of Husserl.

English is the canonical editorial language. The Chinese interface uses a project glossary of standard philosophical terms and should be read as an editorial translation.

## Develop

```bash
npm install
npm run dev
```

The app is a static Astro site. Scoring runs in the browser. There is no database, account system, or AI API.

```bash
npm test
npm run build
npm run preview
npm run test:e2e
```

Playwright needs a browser once: `npx playwright install chromium`.

## Deploy

The production build is the `dist/` directory. Cloudflare Pages can serve it directly.

- Build command: `npm run build`
- Output directory: `dist`
- `wrangler.toml` sets `pages_build_output_dir`

Set `site` in `astro.config.ts` to the real origin before launch so canonical URLs, the sitemap, and Open Graph URLs are correct. No API keys belong in client code. `PUBLIC_PAYMENT_PROVIDER` is documented in `.env.example`; leaving it empty keeps checkout unavailable.

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

The questionnaire is free to complete. The profile, indices, and tension notes stay hidden until PayPal marks the payment completed.

Checkout uses this hosted PayPal page:

`https://www.paypal.com/ncp/payment/RXABC8JDX86YQ`

The listed price is EUR 4.99. The PayPal page is where the charge happens. Clicking the button does not unlock the profile, and a pending status does not either.

In the PayPal payment-link settings, set the return URL to the live site’s `/results` path (for example `https://your-domain/results`). PayPal should send the browser back with `tx` (or `txn_id`) and `st=Completed`. This static site stores that transaction id in `localStorage` and then opens the profile already saved on the device. It does not receive card numbers, and it does not get a server-signed confirmation from PayPal. Clearing site data on this browser removes the unlock.

## Fonts and privacy

Source Serif 4, Source Sans 3, and IBM Plex Mono are served from the site build under the SIL Open Font License. Chinese text falls back to fonts already on the device, so the page does not download a full CJK webfont.

The default experience stores answers and the theme choice in `localStorage`. It does not set cookies or load third-party analytics. See `/privacy`. Hosting on Cloudflare Pages may still create ordinary connection logs under Cloudflare’s own policy.
