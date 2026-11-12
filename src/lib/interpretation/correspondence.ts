import { getArchetype } from '@/data/archetypes';
import { philosophers } from '@/data/philosophers/profiles';
import type { Philosopher } from '@/types/model';

export interface RankedPhilosopher {
  philosopher: Philosopher;
  overlap: string[];
}

export function rankPhilosophers(code: string): RankedPhilosopher[] {
  const archetype = getArchetype(code);
  if (!archetype) return [];
  const traditionSlugs = archetype.traditionSlugs;
  return philosophers
    .map((philosopher, order) => ({
      philosopher,
      order,
      overlap: philosopher.traditionSlugs.filter((slug) => traditionSlugs.includes(slug)),
    }))
    .filter((item) => item.overlap.length > 0)
    .sort((a, b) => b.overlap.length - a.overlap.length || a.order - b.order)
    .map(({ philosopher, overlap }) => ({ philosopher, overlap }));
}

export function featuredPhilosopher(code: string): Philosopher | undefined {
  return rankPhilosophers(code)[0]?.philosopher ?? philosophers[0];
}
