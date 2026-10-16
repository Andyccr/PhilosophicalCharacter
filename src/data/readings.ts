import type { DimensionId, PoleSide, ReadingWork } from '@/types/model';

export const readings: ReadingWork[] = [
  {
    id: 'smart-1959',
    citation: { en: 'J. J. C. Smart, “Sensations and Brain Processes” (1959)', zh: 'J. J. C. 斯马特，《感觉与大脑过程》（1959）' },
    topic: { en: 'A physicalist identity theory of sensation', zh: '关于感觉的物理主义同一论' },
    matches: [{ dimension: 'ontology', side: 'left' }],
  },
  {
    id: 'nagel-1974',
    citation: { en: 'Thomas Nagel, “What Is It Like to Be a Bat?” (1974)', zh: '托马斯·内格尔，《成为一只蝙蝠是什么样子？》（1974）' },
    topic: { en: 'Conscious experience and objective description', zh: '意识经验与客观描述' },
    matches: [{ dimension: 'ontology', side: 'right' }],
  },
  {
    id: 'berkeley-1710',
    citation: { en: 'George Berkeley, A Treatise Concerning the Principles of Human Knowledge (1710)', zh: '乔治·贝克莱，《人类知识原理》（1710）' },
    topic: { en: 'A classical argument for idealism', zh: '观念论的一个古典论证' },
    matches: [{ dimension: 'ontology', side: 'right' }],
  },
  {
    id: 'hume-1748',
    citation: { en: 'David Hume, An Enquiry Concerning Human Understanding (1748)', zh: '大卫·休谟，《人类理解研究》（1748）' },
    topic: { en: 'Experience, causation, and a compatibilist freedom', zh: '经验、因果，以及一种相容论的自由' },
    matches: [
      { dimension: 'epistemology', side: 'left' },
      { dimension: 'agency', side: 'left' },
    ],
  },
  {
    id: 'descartes-1641',
    citation: { en: 'René Descartes, Meditations on First Philosophy (1641)', zh: '勒内·笛卡尔，《第一哲学沉思集》（1641）' },
    topic: { en: 'Reason, doubt, and the distinction of mind', zh: '理性、怀疑，以及心灵的区分' },
    matches: [
      { dimension: 'epistemology', side: 'right' },
      { dimension: 'ontology', side: 'right' },
    ],
  },
  {
    id: 'kant-1785',
    citation: { en: 'Immanuel Kant, Groundwork of the Metaphysics of Morals (1785)', zh: '伊曼努尔·康德，《道德形而上学奠基》（1785）' },
    topic: { en: 'Duty, the categorical imperative, and autonomy', zh: '义务、绝对命令与自律' },
    matches: [
      { dimension: 'ethics', side: 'right' },
      { dimension: 'epistemology', side: 'right' },
    ],
  },
  {
    id: 'mill-1861',
    citation: { en: 'John Stuart Mill, Utilitarianism (1861)', zh: '约翰·斯图亚特·密尔，《功利主义》（1861）' },
    topic: { en: 'Rightness and the general happiness', zh: '正当性与普遍幸福' },
    matches: [{ dimension: 'ethics', side: 'left' }],
  },
  {
    id: 'mill-1859',
    citation: { en: 'John Stuart Mill, On Liberty (1859)', zh: '约翰·斯图亚特·密尔，《论自由》（1859）' },
    topic: { en: 'Individual liberty argued on a utilitarian footing', zh: '在功利主义基础上论证的个人自由' },
    matches: [{ dimension: 'society', side: 'left' }],
  },
  {
    id: 'nozick-1974',
    citation: { en: 'Robert Nozick, Anarchy, State, and Utopia (1974)', zh: '罗伯特·诺齐克，《无政府、国家与乌托邦》（1974）' },
    topic: { en: 'Rights as constraints, and the experience machine', zh: '作为约束的权利，以及体验机' },
    matches: [
      { dimension: 'society', side: 'left' },
      { dimension: 'ethics', side: 'right' },
    ],
  },
  {
    id: 'aristotle-ethics',
    citation: { en: 'Aristotle, Nicomachean Ethics', zh: '亚里士多德，《尼各马可伦理学》' },
    topic: { en: 'Virtue, activity, and a life that can go well', zh: '德性、活动，以及一种可以过得好的生活' },
    matches: [
      { dimension: 'meaning', side: 'left' },
      { dimension: 'society', side: 'right' },
    ],
  },
  {
    id: 'strawson-1962',
    citation: { en: 'P. F. Strawson, “Freedom and Resentment” (1962)', zh: 'P. F. 斯特劳森，《自由与怨恨》（1962）' },
    topic: { en: 'Reactive attitudes and compatibilist responsibility', zh: '反应性态度与相容论的责任' },
    matches: [{ dimension: 'agency', side: 'left' }],
  },
  {
    id: 'sartre-1946',
    citation: { en: 'Jean-Paul Sartre, Existentialism Is a Humanism (1946)', zh: '让-保罗·萨特，《存在主义是一种人道主义》（1946）' },
    topic: { en: 'A public lecture on invented values and responsibility', zh: '一篇关于被发明的价值与责任的公开讲演' },
    matches: [
      { dimension: 'meaning', side: 'right' },
      { dimension: 'agency', side: 'right' },
    ],
  },
  {
    id: 'camus-1942',
    citation: { en: 'Albert Camus, The Myth of Sisyphus (1942)', zh: '阿尔贝·加缪，《西西弗神话》（1942）' },
    topic: { en: 'The absurd without a consoling metaphysical purpose', zh: '没有安慰性形而上学目的的荒诞' },
    matches: [{ dimension: 'meaning', side: 'right' }],
  },
  {
    id: 'analects',
    citation: { en: 'The Analects, a later compilation of Confucian teaching', zh: '《论语》，儒家教导的后期辑录' },
    topic: { en: 'Ritual, role, and moral cultivation in common life', zh: '共同生活中的礼、角色与道德修养' },
    matches: [
      { dimension: 'society', side: 'right' },
      { dimension: 'meaning', side: 'left' },
    ],
  },
  {
    id: 'beauvoir-1947',
    citation: { en: 'Simone de Beauvoir, The Ethics of Ambiguity (1947)', zh: '西蒙娜·德·波伏瓦，《暧昧伦理学》（1947）' },
    topic: { en: 'Freedom situated among other people', zh: '处在他人之中的自由' },
    matches: [
      { dimension: 'agency', side: 'right' },
      { dimension: 'meaning', side: 'right' },
    ],
  },
  {
    id: 'rawls-1971',
    citation: { en: 'John Rawls, A Theory of Justice (1971)', zh: '约翰·罗尔斯，《正义论》（1971）' },
    topic: { en: 'Fair cooperation among free and equal persons', zh: '自由而平等的人之间的公平合作' },
    matches: [
      { dimension: 'society', side: 'left' },
      { dimension: 'ethics', side: 'right' },
    ],
  },
  {
    id: 'parfit-1984',
    citation: { en: 'Derek Parfit, Reasons and Persons (1984)', zh: '德里克·帕菲特，《理与人》（1984）' },
    topic: { en: 'Personal identity and what matters in survival', zh: '个人同一性，以及存活中重要的是什么' },
    matches: [{ dimension: 'ontology', side: 'left' }],
  },
  {
    id: 'nagarjuna',
    citation: { en: 'Nāgārjuna, Mūlamadhyamakakārikā (Fundamental Verses on the Middle Way)', zh: '龙树，《中论》' },
    topic: { en: 'Emptiness as a critique of inherent existence, not a Western idealism', zh: '空性作为对自性存在的批判，而不是一种西方观念论' },
    matches: [{ dimension: 'ontology', side: 'right' }],
  },
];

export function readingsFor(poles: Record<DimensionId, PoleSide>, limit = 6): ReadingWork[] {
  const ranked = readings
    .map((work) => ({
      work,
      score: work.matches.filter((match) => poles[match.dimension] === match.side).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.work.id.localeCompare(b.work.id));
  return ranked.slice(0, limit).map((item) => item.work);
}

const poleTraditions: Record<DimensionId, Record<PoleSide, string>> = {
  ontology: { left: 'physicalism', right: 'idealism' },
  epistemology: { left: 'empiricism', right: 'rationalism' },
  ethics: { left: 'consequentialism', right: 'deontology' },
  agency: { left: 'determinism', right: 'libertarian-freedom' },
  meaning: { left: 'discovered-meaning', right: 'existentialism' },
  society: { left: 'liberal-individualism', right: 'communal-thought' },
};

export function traditionsFor(poles: Record<DimensionId, PoleSide>): string[] {
  return DIMENSION_ORDER.map((dimension) => poleTraditions[dimension][poles[dimension]]);
}

const DIMENSION_ORDER = ['ontology', 'epistemology', 'ethics', 'agency', 'meaning', 'society'] as const satisfies readonly DimensionId[];
