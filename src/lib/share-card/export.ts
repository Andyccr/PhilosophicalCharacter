import { drawShareCard } from '@/lib/share-card/draw';
import { ensureShareCardFonts } from '@/lib/share-card/fonts';
import { LAYOUTS, type ShareCardFormat, type ShareCardInput } from '@/lib/share-card/types';

export async function renderShareCardPng(
  input: ShareCardInput,
  format: ShareCardFormat,
  scale = 1,
): Promise<Blob> {
  await ensureShareCardFonts();
  const layout = LAYOUTS[format];
  const canvas = document.createElement('canvas');
  canvas.width = layout.width * scale;
  canvas.height = layout.height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  if (scale !== 1) ctx.scale(scale, scale);
  drawShareCard(ctx, input, format);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('png');
  return blob;
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function cardFilename(input: ShareCardInput, format: ShareCardFormat): string {
  const code = input.code.replace(/[^\w]/g, '') || 'profile';
  return `noema-${code}-${format}.png`;
}

export async function shareOrDownload(input: ShareCardInput, format: ShareCardFormat): Promise<'shared' | 'downloaded'> {
  const blob = await renderShareCardPng(input, format);
  const filename = cardFilename(input, format);
  const file = new File([blob], filename, { type: 'image/png' });
  const payload = { files: [file], title: `NOEMA — ${input.title}`, text: input.disclaimer };
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    const canShare = typeof navigator.canShare !== 'function' || navigator.canShare(payload);
    if (canShare) {
      try {
        await navigator.share(payload);
        return 'shared';
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return 'shared';
      }
    }
  }
  downloadBlob(filename, blob);
  return 'downloaded';
}
