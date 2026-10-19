export type Measure = (text: string) => number;

const HAN = /\p{Script=Han}/u;

export function measureWithTracking(measure: Measure, text: string, tracking: number): number {
  if (!text) return 0;
  const units = [...text];
  return measure(text) + tracking * Math.max(0, units.length - 1);
}

export function wrapLines(text: string, maxWidth: number, maxLines: number, measure: Measure): string[] {
  const trimmed = text.trim();
  if (!trimmed || maxLines <= 0) return [];
  if (HAN.test(trimmed)) return wrapUnits([...trimmed], '', maxWidth, maxLines, measure);
  return wrapUnits(trimmed.split(/\s+/), ' ', maxWidth, maxLines, measure);
}

function ellipsize(text: string, maxWidth: number, measure: Measure): string {
  if (measure(text) <= maxWidth) return text;
  const ellipsis = '…';
  let keep = text;
  while (keep.length > 0 && measure(`${keep}${ellipsis}`) > maxWidth) keep = [...keep].slice(0, -1).join('');
  return keep ? `${keep}${ellipsis}` : ellipsis;
}

function wrapUnits(units: string[], joiner: string, maxWidth: number, maxLines: number, measure: Measure): string[] {
  const lines: string[] = [];
  let current = '';
  const join = (a: string, b: string) => (a ? `${a}${joiner}${b}` : b);
  const commit = (line: string) => (measure(line) > maxWidth ? ellipsize(line, maxWidth, measure) : line);

  for (let index = 0; index < units.length; index += 1) {
    const unit = units[index] ?? '';
    const next = join(current, unit);
    if (current && measure(next) > maxWidth) {
      lines.push(commit(current));
      current = unit;
      if (lines.length === maxLines) {
        const leftover = [lines[maxLines - 1], ...units.slice(index)].join(joiner);
        lines[maxLines - 1] = ellipsize(leftover, maxWidth, measure);
        return lines;
      }
    } else current = next;
  }
  if (current) lines.push(commit(current));
  return lines.slice(0, maxLines);
}

export function fitSize(
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
  measureAt: (size: number) => number,
): number {
  for (let size = maxSize; size >= minSize; size -= 1) {
    if (measureAt(size) <= maxWidth) return size;
  }
  return minSize;
}
