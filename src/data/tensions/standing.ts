import type { DimensionId, PoleSide, StandingIssue } from '@/types/model';

export const standingIssues: StandingIssue[] = [
  {
    id: 'explanatory-gap',
    kind: 'apparent-tension',
    dimensions: ['ontology'],
    title: { en: 'The explanatory gap', zh: '解释鸿沟' },
    explanation: {
      en: 'A physicalist picture has to say what a completed physics would have done with the fact that seeing, hurting, and understanding are like something. Some physicalists treat the difficulty as a limit on our concepts. The difficulty is not yet a formal contradiction.',
      zh: '一幅物理主义图景必须说明：完成了的物理学将如何处理“看见、疼痛与理解都有其样子”这一事实。有些物理主义者把这一困难看作我们概念的限制。这一困难还不是形式矛盾。',
    },
    alternatives: {
      en: 'Identity theory, property dualism, and idealism give different accounts. Nāgārjuna’s critique of inherent existence is a further alternative and should not be relabeled as Western idealism.',
      zh: '同一论、属性二元论和观念论给出不同的说明。龙树对自性存在的批判是另一种替代，不应被重新标成西方观念论。',
    },
    sources: [
      { label: 'Stanford Encyclopedia of Philosophy, “Physicalism”', href: 'https://plato.stanford.edu/entries/physicalism/' },
      { label: 'Stanford Encyclopedia of Philosophy, “Qualia”', href: 'https://plato.stanford.edu/entries/qualia/' },
    ],
    applies: (poles) => poles.ontology === 'left',
  },
  {
    id: 'mind-and-correction',
    kind: 'philosophical-disagreement',
    dimensions: ['ontology'],
    title: { en: 'Mind and correction', zh: '心灵与纠正' },
    explanation: {
      en: 'If reality is not independent of mind, it still has to be possible to be wrong. Otherwise “reality” names only what one already thinks. Idealists have offered different accounts of that possibility, from Berkeley’s God to later distinctions between appearance and a public world of meaning.',
      zh: '如果实在并不独立于心灵，一个人仍然必须可能是错的。否则“实在”就只是命名一个人已经想到的东西。观念论者对这种可能性给出过不同说明，从贝克莱的上帝，到后来对显现与公共意义世界的区分。',
    },
    alternatives: {
      en: 'A phenomenologist can say the world is given to consciousness without saying that consciousness invents the world’s resistance. That position is not identical with the right pole of this axis.',
      zh: '现象学者可以说世界被给予意识，而不说意识发明了世界的抗拒。这一立场并不等同于本轴的右极。',
    },
    sources: [
      { label: 'Stanford Encyclopedia of Philosophy, “Idealism”', href: 'https://plato.stanford.edu/entries/idealism/' },
    ],
    applies: (poles) => poles.ontology === 'right',
  },
  {
    id: 'aggregation-and-the-person',
    kind: 'philosophical-disagreement',
    dimensions: ['ethics', 'society'],
    title: { en: 'The sum and the person', zh: '总数与个人' },
    explanation: {
      en: 'Judging by outcomes and refusing to use a person can recommend opposite acts. Mill tried to defend liberty because of its benefits. Nozick treated rights as constraints that are not derived from the sum. The disagreement is real, and neither side is a personality flaw.',
      zh: '依结果来判断，与拒绝使用一个人，可能建议相反的行为。密尔试图因为自由的益处而保卫自由。诺齐克把权利当作并非从总数推出的约束。分歧是真实的，两边都不是人格缺陷。',
    },
    alternatives: {
      en: 'Rule consequentialism and rights-based theories are both attempts to live with the conflict rather than proofs that the other side is confused.',
      zh: '规则后果论与以权利为基础的理论，都是试图与这一冲突共处，而不是证明另一边是混乱的。',
    },
    sources: [
      { label: 'Stanford Encyclopedia of Philosophy, “Consequentialism”', href: 'https://plato.stanford.edu/entries/consequentialism/' },
      { label: 'Stanford Encyclopedia of Philosophy, “Rights”', href: 'https://plato.stanford.edu/entries/rights/' },
    ],
    applies: (poles) => poles.ethics === 'left' && poles.society === 'left',
  },
  {
    id: 'duty-without-an-open-will',
    kind: 'apparent-tension',
    dimensions: ['ethics', 'agency'],
    title: { en: 'Duty addressed to a caused will', zh: '向被引起的意志提出的义务' },
    explanation: {
      en: 'A constraint that outcomes do not cancel still has to be addressed to someone. If the will was going to act as it did, the sense of “should have refused” needs a reading. Compatibilism is one reading. It is not the midpoint of the agency axis.',
      zh: '一条不被结果取消的约束，仍然必须向某个人提出。如果意志本来就会如此行动，“应当拒绝”的意义就需要一种解读。相容论是一种解读。它不是能动性之轴的中点。',
    },
    alternatives: {
      en: 'Hard incompatibilism keeps the duty from attaching to desert. A libertarian reading keeps the duty by denying the determinist pole.',
      zh: '强硬的不相容论使义务不再附着于应得。自由意志论的解读则通过否定决定论一极来保留义务。',
    },
    sources: [
      { label: 'Stanford Encyclopedia of Philosophy, “Compatibilism”', href: 'https://plato.stanford.edu/entries/compatibilism/' },
    ],
    applies: (poles) => poles.ethics === 'right' && poles.agency === 'left',
  },
  {
    id: 'created-purpose-and-duty',
    kind: 'apparent-tension',
    dimensions: ['meaning', 'ethics'],
    title: { en: 'A made purpose and a duty not made', zh: '被做成的目的与未被做成的义务' },
    explanation: {
      en: 'Instituting a purpose does not, by itself, repeal a constraint. The two claims answer different questions. Treating the pair as a contradiction would also risk the further mistake of equating created meaning with the thought that nothing matters.',
      zh: '确立一个目的，本身并不废除一条约束。这两个主张回答的是不同的问题。把这一对当作矛盾，还会冒进一步的错误：把被创造的意义等同于“没有什么重要”。',
    },
    alternatives: {
      en: 'Kant separates moral law from happiness. Beauvoir keeps freedom inside a situation already full of other people’s projects.',
      zh: '康德把道德法则与幸福分开。波伏瓦把自由留在一种已经充满他人计划的处境之中。',
    },
    sources: [
      { label: 'Stanford Encyclopedia of Philosophy, “The Meaning of Life”', href: 'https://plato.stanford.edu/entries/life-meaning/' },
      { label: 'Stanford Encyclopedia of Philosophy, “Deontological Ethics”', href: 'https://plato.stanford.edu/entries/ethics-deontological/' },
    ],
    applies: (poles) => poles.meaning === 'right' && poles.ethics === 'right',
  },
  {
    id: 'luck-in-the-open-will',
    kind: 'apparent-tension',
    dimensions: ['agency'],
    title: { en: 'Luck inside an open will', zh: '开放意志之中的运气' },
    explanation: {
      en: 'If more than one act was open, the ability to take the better one may still be a matter of luck in character, upbringing, or timing. Galen Strawson pressed a related regress: a free act seems to require a self that is already responsible for the way it chooses. The regress is a problem for this pole, not a refutation delivered by the questionnaire.',
      zh: '如果不止一个行为曾经开放，采取较好那一个的能力仍然可能是品格、教养或时机上的运气。盖伦·斯特劳森推进过一个相关的回溯：一个自由行为似乎要求一个已经为其选择方式负责的自我。这一回溯是这一极的问题，不是问卷所交付的反驳。',
    },
    alternatives: {
      en: 'Agent-causal theories try to stop the regress. Compatibilists say the regress starts from a demand that responsibility never needed.',
      zh: '行动者因果理论试图终止这一回溯。相容论者说，这一回溯始于一种责任从不需要的要求。',
    },
    sources: [
      { label: 'Stanford Encyclopedia of Philosophy, “Arguments for Incompatibilism”', href: 'https://plato.stanford.edu/entries/incompatibilism-arguments/' },
    ],
    applies: (poles) => poles.agency === 'right',
  },
  {
    id: 'unchosen-debts',
    kind: 'context-dependent',
    dimensions: ['society'],
    title: { en: 'Debts that were not consented to', zh: '未经同意的亏欠' },
    explanation: {
      en: 'A strong priority for the person still meets relationships, languages, and care that no one contracted for. The profile can keep the person as a limit and still ask which of those debts are real.',
      zh: '对个人的强烈优先，仍然会遇到无人订立契约的关系、语言与照料。这一剖面可以把个人保持为界限，同时仍然追问哪些亏欠是真实的。',
    },
    alternatives: {
      en: 'Confucian role ethics starts from the relationship. A liberal theory can acknowledge unchosen starting points and still refuse unchosen domination.',
      zh: '儒家的角色伦理从关系出发。一种自由主义理论可以承认未经选择的起点，同时仍然拒绝未经选择的支配。',
    },
    sources: [
      { label: 'Stanford Encyclopedia of Philosophy, “Liberalism”', href: 'https://plato.stanford.edu/entries/liberalism/' },
      { label: 'Stanford Encyclopedia of Philosophy, “Confucius”', href: 'https://plato.stanford.edu/entries/confucius/' },
    ],
    applies: (poles) => poles.society === 'left',
  },
  {
    id: 'the-unheard-member',
    kind: 'context-dependent',
    dimensions: ['society'],
    title: { en: 'Who speaks as the community', zh: '谁以共同体的名义说话' },
    explanation: {
      en: 'A priority for common life has to say who may speak for the whole, and what a member may refuse. Without that question, “the community” is only the loudest voice.',
      zh: '对共同生活的优先必须说明谁可以代表整体说话，以及一个成员可以拒绝什么。没有这个问题，“共同体”就只是最大的那个声音。',
    },
    alternatives: {
      en: 'Arendt’s account of plurality and Confucian practices of remonstrance are different ways of keeping a dissent inside a shared world.',
      zh: '阿伦特关于复数性的说明，与儒家的谏诤实践，是在共享世界之内保留异议的不同方式。',
    },
    sources: [
      { label: 'Stanford Encyclopedia of Philosophy, “Hannah Arendt”', href: 'https://plato.stanford.edu/entries/arendt/' },
      { label: 'Stanford Encyclopedia of Philosophy, “Communitarianism”', href: 'https://plato.stanford.edu/entries/communitarianism/' },
    ],
    applies: (poles) => poles.society === 'right',
  },
];

export function standingIssuesFor(poles: Record<DimensionId, PoleSide>): StandingIssue[] {
  return standingIssues.filter((issue) => issue.applies(poles));
}
