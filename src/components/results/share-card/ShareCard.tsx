import { useEffect, useRef, useState } from 'react';
import { pending } from '@/lib/share-card/copy';
import { drawShareCard } from '@/lib/share-card/draw';
import { cardFilename, downloadBlob, renderShareCardPng, shareOrDownload } from '@/lib/share-card/export';
import { ensureShareCardFonts } from '@/lib/share-card/fonts';
import { LAYOUTS, type ShareCardFormat, type ShareCardInput } from '@/lib/share-card/types';
import { messages } from '@/lib/localization/messages';
import type { Locale } from '@/types/model';

const FORMATS: ShareCardFormat[] = ['landscape', 'portrait'];

export function ShareCard({ locale, input }: { locale: Locale; input: ShareCardInput }) {
  const m = messages[locale];
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const landscapeRef = useRef<HTMLCanvasElement>(null);
  const portraitRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function paint() {
      try {
        await ensureShareCardFonts();
        if (cancelled) return;
        for (const format of FORMATS) {
          const node = format === 'landscape' ? landscapeRef.current : portraitRef.current;
          if (!node) continue;
          const layout = LAYOUTS[format];
          node.width = layout.width;
          node.height = layout.height;
          const ctx = node.getContext('2d');
          if (!ctx) continue;
          drawShareCard(ctx, input, format);
        }
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setStatus(m.pngFailed);
      }
    }
    void paint();
    return () => {
      cancelled = true;
    };
  }, [input, m.pngFailed]);

  async function download(format: ShareCardFormat) {
    setStatus('');
    try {
      const blob = await renderShareCardPng(input, format);
      downloadBlob(cardFilename(input, format), blob);
    } catch {
      setStatus(m.pngFailed);
    }
  }

  async function share(format: ShareCardFormat) {
    setStatus('');
    try {
      await shareOrDownload(input, format);
    } catch {
      setStatus(m.pngFailed);
    }
  }

  return (
    <section className="no-print mt-10" data-testid="share-card" data-ready={ready ? 'true' : 'false'}>
      <p className="kicker">{pending(locale, 'shareCardTitle')}</p>
      <p className="mt-3 max-w-3xl text-sm text-muted">{pending(locale, 'shareCardHint')}</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <figure>
          <figcaption className="mb-3 text-sm font-medium">{pending(locale, 'shareLandscape')}</figcaption>
          <canvas
            ref={landscapeRef}
            data-testid="share-card-landscape"
            width={LAYOUTS.landscape.width}
            height={LAYOUTS.landscape.height}
            className="w-full border border-line bg-paper"
            style={{ aspectRatio: '1200 / 630' }}
          />
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" className="btn" data-testid="download-png-landscape" onClick={() => void download('landscape')}>
              {pending(locale, 'downloadLandscape')}
            </button>
            <button type="button" className="btn secondary" data-testid="share-card-native-landscape" onClick={() => void share('landscape')}>
              {pending(locale, 'shareCardShare')}
            </button>
          </div>
        </figure>
        <figure>
          <figcaption className="mb-3 text-sm font-medium">{pending(locale, 'sharePortrait')}</figcaption>
          <canvas
            ref={portraitRef}
            data-testid="share-card-portrait"
            width={LAYOUTS.portrait.width}
            height={LAYOUTS.portrait.height}
            className="mx-auto w-full max-w-sm border border-line bg-paper"
            style={{ aspectRatio: '1080 / 1440' }}
          />
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" className="btn" data-testid="download-png-portrait" onClick={() => void download('portrait')}>
              {pending(locale, 'downloadPortrait')}
            </button>
            <button type="button" className="btn secondary" data-testid="share-card-native-portrait" onClick={() => void share('portrait')}>
              {pending(locale, 'shareCardShare')}
            </button>
          </div>
        </figure>
      </div>
      {status && (
        <p className="mt-3" role="status">
          {status}
        </p>
      )}
    </section>
  );
}
