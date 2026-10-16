export interface ShareCardInput {
  kicker: string;
  title: string;
  code: string;
  family: string;
  summary: string;
  rows: Array<{ label: string; value: string }>;
  disclaimer: string;
  badge: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrap(text: string, max: number): string[] {
  const han = /\p{Script=Han}/u.test(text);
  if (han) {
    const lines: string[] = [];
    const size = Math.max(8, max);
    for (let index = 0; index < text.length; index += size) lines.push(text.slice(index, index + size));
    return lines.slice(0, 6);
  }
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else current = next;
  }
  if (current) lines.push(current);
  return lines.slice(0, 6);
}

export function shareCardSvg(input: ShareCardInput): string {
  const summaryLines = wrap(input.summary, 62);
  const summary = summaryLines
    .map((line, index) => `<text x="72" y="${300 + index * 34}" class="body">${escapeXml(line)}</text>`)
    .join('');
  const rows = input.rows
    .map((row, index) => {
      const y = 520 + index * 28;
      return `<text x="72" y="${y}" class="row">${escapeXml(row.label)}</text><text x="1128" y="${y}" class="row" text-anchor="end">${escapeXml(row.value)}</text>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" role="img">
  <style>
    .kicker { font: 22px "IBM Plex Mono", ui-monospace, monospace; fill: #6E5428; letter-spacing: 3px; }
    .title { font: 64px "Source Serif 4", "Songti SC", serif; fill: #111318; }
    .code { font: 28px "IBM Plex Mono", ui-monospace, monospace; fill: #3F3A78; }
    .body, .row, .foot { font: 24px "Source Sans 3", "PingFang SC", sans-serif; fill: #111318; }
    .foot { font-size: 18px; fill: #3E4148; }
    .badge { font: 18px "Source Sans 3", sans-serif; fill: #3F3A78; }
  </style>
  <rect width="1200" height="760" fill="#F3F0E8"/>
  <rect x="36" y="36" width="1128" height="688" fill="none" stroke="#B59A6B" stroke-width="2"/>
  <text x="72" y="110" class="kicker">${escapeXml(input.kicker)}</text>
  <text x="72" y="190" class="title">${escapeXml(input.title)}</text>
  <text x="72" y="236" class="code">${escapeXml(input.code)}</text>
  <text x="1128" y="236" class="badge" text-anchor="end">${escapeXml(input.badge)}</text>
  <text x="72" y="278" class="body">${escapeXml(input.family)}</text>
  ${summary}
  ${rows}
  <text x="72" y="700" class="foot">${escapeXml(input.disclaimer)}</text>
</svg>`;
}
