import { useMemo, useState } from 'react';
import { AXIS_LABELS, getPublicType, polesFromPublicCode, publicTypes } from '@/data/archetypes/public';
import { messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { DIMENSION_IDS } from '@/lib/scoring/config';
import type { Locale } from '@/types/model';

export function CompareApp({ locale }: { locale: Locale }) {
  const m = messages[locale];
  const [left, setLeft] = useState('MECDFI');
  const [right, setRight] = useState('IRDLCC');
  const a = useMemo(() => getPublicType(left), [left]);
  const b = useMemo(() => getPublicType(right), [right]);
  const aPoles = useMemo(() => polesFromPublicCode(left), [left]);
  const bPoles = useMemo(() => polesFromPublicCode(right), [right]);
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="serif text-4xl">{m.compare}</h1>
      <p className="mt-3 max-w-3xl">{m.compareLead}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label>{m.leftProfile}
          <select className="mt-2 block w-full border border-line bg-paper p-2" value={left} onChange={(event) => setLeft(event.target.value)}>
            {publicTypes.map((item) => <option key={item.code} value={item.code}>{item.code} — {item.name[locale]}</option>)}
          </select>
        </label>
        <label>{m.rightProfile}
          <select className="mt-2 block w-full border border-line bg-paper p-2" value={right} onChange={(event) => setRight(event.target.value)}>
            {publicTypes.map((item) => <option key={item.code} value={item.code}>{item.code} — {item.name[locale]}</option>)}
          </select>
        </label>
      </div>
      {a && b && aPoles && bPoles && (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2">{m.dimensions}</th>
              <th className="py-2"><a href={localePath(locale, `/types/${a.code.toLowerCase()}`)}>{a.name[locale]}</a></th>
              <th className="py-2"><a href={localePath(locale, `/types/${b.code.toLowerCase()}`)}>{b.name[locale]}</a></th>
            </tr>
          </thead>
          <tbody>
            {DIMENSION_IDS.map((id) => {
              const same = aPoles[id] === bPoles[id];
              const pole = (side: 'left' | 'right') => AXIS_LABELS[id][side === 'left' ? 'leftPole' : 'rightPole'][locale];
              return (
                <tr key={id} className="border-b border-line">
                  <td className="py-2">{AXIS_LABELS[id].plainName[locale]}</td>
                  <td className="py-2">{pole(aPoles[id])}</td>
                  <td className="py-2">{pole(bPoles[id])} <span className="text-muted">({same ? m.samePole : m.differentPole})</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
