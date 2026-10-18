import { COLORS, FONTS, LAYOUTS, type ShareCardFormat, type ShareCardInput, type ShareCardLayout } from '@/lib/share-card/types';
import { fitSize, measureWithTracking, wrapLines } from '@/lib/share-card/text';

export type Canvas2D = Pick<
  CanvasRenderingContext2D,
  | 'fillStyle'
  | 'strokeStyle'
  | 'lineWidth'
  | 'font'
  | 'textAlign'
  | 'textBaseline'
  | 'beginPath'
  | 'closePath'
  | 'moveTo'
  | 'lineTo'
  | 'arcTo'
  | 'fill'
  | 'stroke'
  | 'fillRect'
  | 'fillText'
  | 'measureText'
>;

function font(weight: number, size: number, family: string): string {
  return `${weight} ${size}px ${family}`;
}

function roundedRect(ctx: Canvas2D, x: number, y: number, width: number, height: number, radius: number): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function fillTracked(ctx: Canvas2D, text: string, x: number, y: number, tracking: number, align: 'start' | 'end'): void {
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((sum, width) => sum + width, 0) + tracking * Math.max(0, chars.length - 1);
  let cursor = align === 'end' ? x - total : x;
  for (let index = 0; index < chars.length; index += 1) {
    ctx.fillText(chars[index] ?? '', cursor, y);
    cursor += (widths[index] ?? 0) + tracking;
  }
}

function measure(ctx: Canvas2D): (text: string) => number {
  return (text: string) => ctx.measureText(text).width;
}

export function drawShareCard(ctx: Canvas2D, input: ShareCardInput, format: ShareCardFormat): void {
  const layout = LAYOUTS[format];
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, layout.width, layout.height);

  drawWordmark(ctx, layout);
  drawBadge(ctx, input, layout);
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(layout.rule.x, layout.rule.y, layout.rule.width, layout.rule.height);
  const codeEnd = drawCode(ctx, input, layout);
  if (input.status === 'provisional') drawStar(ctx, layout, codeEnd);

  const titleShift = drawTitle(ctx, input, layout);
  const familyY = layout.title.y + titleShift + layout.family.dy;
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(600, layout.family.size, FONTS.sans);
  ctx.fillText(input.family, layout.family.x, familyY);

  ctx.fillStyle = COLORS.muted;
  ctx.font = font(400, layout.summary.size, FONTS.sans);
  const summaryLines = wrapLines(input.summary, layout.summary.maxWidth, layout.summary.maxLines, measure(ctx));
  const summaryY = familyY + layout.summary.dy;
  for (let index = 0; index < summaryLines.length; index += 1) {
    ctx.fillText(summaryLines[index] ?? '', layout.summary.x, summaryY + index * layout.summary.lineHeight);
  }

  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(layout.divider.x1, layout.divider.y);
  ctx.lineTo(layout.divider.x2, layout.divider.y);
  ctx.stroke();

  ctx.fillStyle = COLORS.ink;
  ctx.font = font(400, layout.url.size, FONTS.mono);
  ctx.fillText(input.url, layout.url.x, layout.url.y);

  ctx.fillStyle = COLORS.muted;
  ctx.font = font(400, layout.disclaimer.size, FONTS.sans);
  const disclaimerWidth = ctx.measureText(input.disclaimer).width;
  ctx.fillText(input.disclaimer, layout.disclaimer.right - disclaimerWidth, layout.disclaimer.y);
}

function drawWordmark(ctx: Canvas2D, layout: ShareCardLayout): void {
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(600, layout.wordmark.size, FONTS.serif);
  fillTracked(ctx, 'NOEMA', layout.wordmark.x, layout.wordmark.y, layout.wordmark.tracking, 'start');
}

function drawBadge(ctx: Canvas2D, input: ShareCardInput, layout: ShareCardLayout): void {
  const tracking = input.locale === 'zh' ? layout.badge.trackingZh : layout.badge.tracking;
  ctx.font = font(400, layout.badge.size, FONTS.mono);
  const width = measureWithTracking(measure(ctx), input.badge, tracking);
  if (input.status === 'provisional') {
    const boxWidth = width + layout.badge.pillPad * 2;
    const boxX = layout.badge.right - boxWidth;
    const boxY = layout.badge.y - layout.badge.pillRadius - layout.badge.size * 0.35;
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = layout.badge.stroke;
    roundedRect(ctx, boxX, boxY, boxWidth, layout.badge.pillHeight, layout.badge.pillRadius);
    ctx.stroke();
    ctx.fillStyle = COLORS.accent;
    fillTracked(ctx, input.badge, boxX + layout.badge.pillPad, layout.badge.y, tracking, 'start');
    return;
  }
  ctx.fillStyle = COLORS.muted;
  fillTracked(ctx, input.badge, layout.badge.right, layout.badge.y, tracking, 'end');
}

function drawCode(ctx: Canvas2D, input: ShareCardInput, layout: ShareCardLayout): number {
  ctx.fillStyle = COLORS.accent;
  ctx.font = font(400, layout.code.size, FONTS.mono);
  fillTracked(ctx, input.code, layout.code.x, layout.code.y, layout.code.tracking, 'start');
  return layout.code.x + measureWithTracking(measure(ctx), input.code, layout.code.tracking);
}

function drawStar(ctx: Canvas2D, layout: ShareCardLayout, codeEnd: number): void {
  ctx.fillStyle = COLORS.accent;
  ctx.font = font(400, layout.code.starSize, FONTS.mono);
  ctx.fillText('*', codeEnd + layout.code.starDx, layout.code.y + layout.code.starDy);
}

function drawTitle(ctx: Canvas2D, input: ShareCardInput, layout: ShareCardLayout): number {
  const maxLines = layout.title.maxLines;
  const size = fitSize(input.title, layout.title.maxWidth, layout.title.size, layout.title.minSize, (next) => {
    ctx.font = font(600, next, FONTS.serif);
    return ctx.measureText(input.title).width;
  });
  ctx.font = font(600, size, FONTS.serif);
  ctx.fillStyle = COLORS.ink;
  if (maxLines === 1) {
    const line = wrapLines(input.title, layout.title.maxWidth, 1, measure(ctx))[0] ?? '';
    ctx.fillText(line, layout.title.x, layout.title.y);
    return 0;
  }
  const oneLine = ctx.measureText(input.title).width <= layout.title.maxWidth;
  if (oneLine) {
    ctx.fillText(input.title, layout.title.x, layout.title.y);
    return 0;
  }
  const lines = wrapLines(input.title, layout.title.maxWidth, maxLines, measure(ctx));
  for (let index = 0; index < lines.length; index += 1) {
    ctx.fillText(lines[index] ?? '', layout.title.x, layout.title.y + index * layout.title.lineHeight);
  }
  return lines.length > 1 ? layout.title.lineHeight : 0;
}
