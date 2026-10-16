import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function write(relativePath, contents) {
  const file = join(root, relativePath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
}

function pair(relativePath, contentsFor) {
  write(`src/pages/${relativePath}`, contentsFor('en'));
  write(`src/pages/zh/${relativePath}`, contentsFor('zh'));
}

pair('index.astro', (locale) => `---
import HomeView from '@/components/views/HomeView.astro';
---
<HomeView locale="${locale}" />
`);

pair('test/index.astro', (locale) => `---
import TestView from '@/components/views/TestView.astro';
---
<TestView locale="${locale}" />
`);

pair('results/index.astro', (locale) => `---
import ResultsView from '@/components/views/ResultsView.astro';
---
<ResultsView locale="${locale}" />
`);

pair('compare/index.astro', (locale) => `---
import CompareView from '@/components/views/CompareView.astro';
---
<CompareView locale="${locale}" />
`);

pair('premium/index.astro', (locale) => `---
import PremiumView from '@/components/views/PremiumView.astro';
---
<PremiumView locale="${locale}" />
`);

pair('types/index.astro', (locale) => `---
import TypesIndexView from '@/components/views/TypesIndexView.astro';
---
<TypesIndexView locale="${locale}" />
`);

pair('atlas/index.astro', (locale) => `---
import AtlasView from '@/components/views/AtlasView.astro';
---
<AtlasView locale="${locale}" />
`);

pair('philosophy/index.astro', (locale) => `---
import DimensionView from '@/components/views/DimensionView.astro';
---
<DimensionView locale="${locale}" />
`);

pair('philosophers/index.astro', (locale) => `---
import PhilosopherView from '@/components/views/PhilosopherView.astro';
---
<PhilosopherView locale="${locale}" />
`);

pair('traditions/index.astro', (locale) => `---
import TraditionView from '@/components/views/TraditionView.astro';
---
<TraditionView locale="${locale}" />
`);

pair('glossary/index.astro', (locale) => `---
import DocumentView from '@/components/views/DocumentView.astro';
---
<DocumentView locale="${locale}" kind="glossary" />
`);

pair('methodology/index.astro', (locale) => `---
import DocumentView from '@/components/views/DocumentView.astro';
---
<DocumentView locale="${locale}" kind="methodology" />
`);

pair('articles/index.astro', (locale) => `---
import DocumentView from '@/components/views/DocumentView.astro';
---
<DocumentView locale="${locale}" kind="articles" />
`);

pair('experiments/index.astro', (locale) => `---
import DocumentView from '@/components/views/DocumentView.astro';
---
<DocumentView locale="${locale}" kind="experiments" />
`);

for (const slug of ['privacy', 'terms', 'disclaimer', 'contact']) {
  pair(`${slug}/index.astro`, (locale) => `---
import DocumentView from '@/components/views/DocumentView.astro';
---
<DocumentView locale="${locale}" kind="legal" legalSlug="${slug}" />
`);
}

pair('types/[code].astro', (locale) => `---
import TypeView from '@/components/views/TypeView.astro';
import { archetypes } from '@/data/archetypes';

export function getStaticPaths() {
  return archetypes.map((archetype) => ({
    params: { code: archetype.code.toLowerCase() },
    props: { archetype },
  }));
}

const { archetype } = Astro.props;
---
<TypeView locale="${locale}" archetype={archetype} />
`);

pair('families/[family].astro', (locale) => `---
import FamilyView from '@/components/views/FamilyView.astro';
import { FAMILY_ORDER } from '@/data/archetypes/families';

export function getStaticPaths() {
  return FAMILY_ORDER.map((familyId) => ({ params: { family: familyId }, props: { familyId } }));
}

const { familyId } = Astro.props;
---
<FamilyView locale="${locale}" familyId={familyId} />
`);

pair('philosophy/[dimension].astro', (locale) => `---
import DimensionView from '@/components/views/DimensionView.astro';
import { dimensionList } from '@/data/dimensions';

export function getStaticPaths() {
  return dimensionList.map((dimension) => ({ params: { dimension: dimension.id }, props: { dimension } }));
}

const { dimension } = Astro.props;
---
<DimensionView locale="${locale}" dimension={dimension} />
`);

pair('philosophers/[slug].astro', (locale) => `---
import PhilosopherView from '@/components/views/PhilosopherView.astro';
import { philosophers } from '@/data/philosophers/profiles';

export function getStaticPaths() {
  return philosophers.map((philosopher) => ({ params: { slug: philosopher.slug }, props: { philosopher } }));
}

const { philosopher } = Astro.props;
---
<PhilosopherView locale="${locale}" philosopher={philosopher} />
`);

pair('traditions/[slug].astro', (locale) => `---
import TraditionView from '@/components/views/TraditionView.astro';
import { traditions } from '@/data/traditions/catalog';

export function getStaticPaths() {
  return traditions.map((tradition) => ({ params: { slug: tradition.slug }, props: { tradition } }));
}

const { tradition } = Astro.props;
---
<TraditionView locale="${locale}" tradition={tradition} />
`);

pair('articles/[slug].astro', (locale) => `---
import DocumentView from '@/components/views/DocumentView.astro';
import { articles } from '@/data/articles/catalog';

export function getStaticPaths() {
  return articles.map((article) => ({ params: { slug: article.slug }, props: { article } }));
}

const { article } = Astro.props;
---
<DocumentView locale="${locale}" kind="article" article={article} />
`);

pair('experiments/[slug].astro', (locale) => `---
import DocumentView from '@/components/views/DocumentView.astro';
import { experiments } from '@/data/experiments/catalog';

export function getStaticPaths() {
  return experiments.map((experiment) => ({ params: { slug: experiment.slug }, props: { experiment } }));
}

const { experiment } = Astro.props;
---
<DocumentView locale="${locale}" kind="experiment" experiment={experiment} />
`);

write('src/pages/404.astro', `---
import BaseLayout from '@/components/layout/BaseLayout.astro';
---
<BaseLayout locale="en" path="/404" title="Not found — NOEMA" description="This page is not part of the atlas." noindex={true}>
  <div class="mx-auto max-w-3xl px-4 py-20">
    <h1 class="serif text-5xl">This page is not in the atlas.</h1>
    <p class="mt-4"><a href="/">Return home</a> · <a href="/zh">中文</a></p>
  </div>
</BaseLayout>
`);

console.log('pages written');
