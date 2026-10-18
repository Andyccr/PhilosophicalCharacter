export const SHARE_CARD_FONT_HREF = '/fonts/share-card/fonts.css';
export const SHARE_CARD_FONT_ID = 'noema-share-card-fonts';

const LOAD_SPECS = [
  '600 24px "Source Serif 4"',
  '600 64px "Noto Serif SC"',
  '400 21px "Source Sans 3"',
  '600 22px "Source Sans 3"',
  '400 28px "Noto Sans SC"',
  '600 30px "Noto Sans SC"',
  '400 16px "IBM Plex Mono"',
  '400 150px "IBM Plex Mono"',
];

function injectStylesheet(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  const existing = document.getElementById(SHARE_CARD_FONT_ID) as HTMLLinkElement | null;
  if (existing) {
    if (existing.sheet || existing.dataset.loaded === 'true') return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('share-card-fonts')), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.id = SHARE_CARD_FONT_ID;
    link.rel = 'stylesheet';
    link.href = SHARE_CARD_FONT_HREF;
    link.onload = () => {
      link.dataset.loaded = 'true';
      resolve();
    };
    link.onerror = () => reject(new Error('share-card-fonts'));
    document.head.appendChild(link);
  });
}

export async function ensureShareCardFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  await injectStylesheet();
  await Promise.all(LOAD_SPECS.map((spec) => document.fonts.load(spec)));
  await document.fonts.ready;
}
