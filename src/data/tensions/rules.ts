import type { AssessmentResult, TensionRule } from '@/types/model';

const sep = (path: string, label: string) => ({ label, href: `https://plato.stanford.edu/entries/${path}/` });

export const tensionRules: TensionRule[] = [
  {
    id: 'determinism-responsibility',
    kind: 'apparent-tension',
    dimensions: ['agency', 'ethics'],
    problem: {
      en: 'Determinism and moral responsibility',
      zh: '决定论与道德责任',
    },
    explanation: {
      en: 'If an action was fixed by earlier causes, it is not obvious what blame or duty can still mean. That is a genuine philosophical problem. It is not, by itself, a formal contradiction: the questionnaire’s determinism pole does not already contain the sentence “no one is responsible.”',
      zh: '如果一个行为已被先前的原因固定，责备或义务还能意味着什么，并不显而易见。这是一个真正的哲学问题。它本身并不是形式矛盾：问卷的决定论一极并不已经包含“没有人负有责任”这个句子。',
    },
    alternatives: {
      en: 'Compatibilists argue that responsibility tracks the quality of the will — whether the person acted for their own reasons, without compulsion of a relevant kind — even when those reasons have causes. Hard incompatibilists argue that a will with a causal history is not the right kind of source for desert.',
      zh: '相容论认为，责任追踪的是意志的性质：一个人是否出于自己的理由而行动，且没有受到相关意义上的强制；即便这些理由本身有原因，也可以如此。强硬的不相容论则认为，带有因果历史的意志并不是应得意义上的恰当来源。',
    },
    followUp: {
      en: 'If a complete causal story were told of a harmful act, which part of that story, if any, would you still call the person’s own?',
      zh: '如果一个有害行为有了完整的因果叙述，其中哪一部分——如果还有的话——你仍会称为这个人自己的？',
    },
    experimentSlug: 'predicting-a-choice',
    tradition: { en: 'Compatibilism and incompatibilism', zh: '相容论与不相容论' },
    because: {
      en: 'Your agency index leans toward determinism, and you did not describe responsibility in the compatibilist way offered on this questionnaire.',
      zh: '你的能动性指数偏向决定论，而且你没有选择本问卷所提供的相容论式责任描述。',
    },
    sources: [
      sep('compatibilism', 'Stanford Encyclopedia of Philosophy, “Compatibilism”'),
      sep('incompatibilism-arguments', 'Stanford Encyclopedia of Philosophy, “Arguments for Incompatibilism”'),
      {
        label: 'P. F. Strawson, “Freedom and Resentment” (1962)',
        href: 'https://plato.stanford.edu/entries/strawson/',
      },
    ],
    activates: (result) =>
      result.dimensions.agency.inclination === 'left' &&
      (result.dimensions.agency.alternativeTags.compatibilism ?? 0) === 0 &&
      result.dimensions.ethics.directionalCount >= 3,
  },
  {
    id: 'consequentialism-rights',
    kind: 'philosophical-disagreement',
    dimensions: ['ethics', 'society'],
    problem: {
      en: 'Consequentialism and individual rights',
      zh: '后果论与个人权利',
    },
    explanation: {
      en: 'A view can treat outcomes as what makes an act right and still treat each person as a limit on what may be done for the sake of the sum. Those commitments can recommend different acts in the same case. That is a disagreement about the shape of morality, not a proof that either commitment is confused.',
      zh: '一种看法可以既把结果当作行为对错的根据，又把每个人当作“为了总数可以做什么”的界限。在同一个情境里，这两种承诺可能建议不同的行为。这是关于道德形态的分歧，而不是证明其中一种承诺是混乱的。',
    },
    alternatives: {
      en: 'Some consequentialists defend rights as rules that protect the good over time. Some deontologists treat rights as constraints that are not derived from the good at all. Mill’s On Liberty is one attempt to hold liberty and utility together; Nozick’s side constraints are a refusal of that attempt.',
      zh: '有些后果论者把权利辩护为长期保护善的规则。有些义务论者把权利当作根本不从善推导出来的约束。密尔的《论自由》是把自由与效用放在一起的一种尝试；诺齐克的边际约束则是对这种尝试的拒绝。',
    },
    followUp: {
      en: 'When a right blocks a large benefit, do you treat the right as a rule justified by benefits, or as a stop the benefits do not get to cross?',
      zh: '当一项权利挡住了很大的利益时，你把这项权利看作由利益证成的规则，还是看作利益不得越过的止点？',
    },
    experimentSlug: 'transplant',
    tradition: { en: 'Rights as goals and rights as constraints', zh: '作为目标的权利与作为约束的权利' },
    because: {
      en: 'Your moral index leans toward consequences, and your social index leans toward the priority of the person.',
      zh: '你的道德指数偏向后果，而你的社会指数偏向个人优先。',
    },
    sources: [
      sep('consequentialism', 'Stanford Encyclopedia of Philosophy, “Consequentialism”'),
      sep('rights', 'Stanford Encyclopedia of Philosophy, “Rights”'),
      {
        label: 'Robert Nozick, Anarchy, State, and Utopia (1974)',
        href: 'https://plato.stanford.edu/entries/nozick-political/',
      },
    ],
    activates: (result) =>
      result.dimensions.ethics.inclination === 'left' && result.dimensions.society.inclination === 'left',
  },
  {
    id: 'rationalism-uncertainty',
    kind: 'unresolved-uncertainty',
    dimensions: ['epistemology'],
    problem: {
      en: 'Rationalism and reluctance to judge',
      zh: '理性论与不愿下判断',
    },
    explanation: {
      en: 'Giving reason a privileged role is compatible with often refusing to judge. A high standard for knowledge can produce caution. The combination is not a contradiction. It does mean the rationalist index is not a portrait of uninterrupted certainty.',
      zh: '给予理性优先地位，与经常拒绝下判断是可以并存的。对知识的高标准会带来审慎。这一组合不是矛盾。它意味着理性论指数并不是一幅“持续确定”的画像。',
    },
    alternatives: {
      en: 'Methodical doubt, as in Descartes, uses reasoning to withhold assent. Pyrrhonian skepticism is a different practice: it aims at suspension rather than at a foundation. The questionnaire cannot tell those projects apart from ordinary uncertainty.',
      zh: '方法性的怀疑，如笛卡尔那里，是用推理来暂缓同意。皮浪式怀疑是另一种实践：它指向悬置，而不是指向基础。问卷无法把这些计划与普通的不确定区分开。',
    },
    followUp: {
      en: 'When you decline to judge, are you waiting for an observation, for a better argument, or for the question to be set aside?',
      zh: '当你不愿下判断时，你是在等待一次观察、一个更好的论证，还是在把问题搁下？',
    },
    experimentSlug: 'observation-and-necessity',
    tradition: { en: 'Rationalism and skepticism', zh: '理性论与怀疑论' },
    because: {
      en: 'Your knowledge index leans toward reasoning, and you also chose “I cannot determine” more than once on that axis.',
      zh: '你的知识指数偏向推理，同时你在这一轴上不止一次选择了“我无法判断”。',
    },
    sources: [
      sep('rationalism-empiricism', 'Stanford Encyclopedia of Philosophy, “Rationalism vs. Empiricism”'),
      sep('skepticism', 'Stanford Encyclopedia of Philosophy, “Skepticism”'),
    ],
    activates: (result) =>
      result.dimensions.epistemology.inclination === 'right' &&
      result.dimensions.epistemology.uncertainCount >= 2,
  },
  {
    id: 'created-meaning-objective-duty',
    kind: 'apparent-tension',
    dimensions: ['meaning', 'ethics'],
    problem: {
      en: 'Created meaning and moral constraints',
      zh: '被创造的意义与道德约束',
    },
    explanation: {
      en: 'A person can treat the point of a life as something they institute, and still treat some moral constraints as not theirs to cancel. Purpose and duty answer different questions. Calling the combination a contradiction would erase that difference. Creating meaning is also not the same claim as “nothing matters.”',
      zh: '一个人可以把生活的要旨当作自己确立的东西，同时仍把某些道德约束当作不能由自己取消的东西。目的与义务回答的是不同的问题。把这一组合称为矛盾，会抹掉这个差别。创造意义也不是“没有什么重要”这同一个主张。',
    },
    alternatives: {
      en: 'Kant separates the moral law from personal projects. Sartre, in Existentialism Is a Humanism (1946), argues that we invent values and remain responsible — a lecture that many readers, and sometimes Sartre’s own later remarks, treat as simpler than Being and Nothingness. Beauvoir’s ethics of ambiguity keeps freedom inside a situation that already involves other people.',
      zh: '康德把道德法则与个人计划分开。萨特在《存在主义是一种人道主义》（1946）中主张我们发明价值并且仍然负责——许多读者，有时也包括萨特后来的说明，认为这篇讲演比《存在与虚无》更简化。波伏瓦的暧昧伦理学则把自由放进已经涉及他人的处境之中。',
    },
    followUp: {
      en: 'Which of your projects would you set down if a duty you did not author forbade it?',
      zh: '如果一项并非由你制定的义务禁止某个计划，你会放下哪些计划？',
    },
    experimentSlug: 'purposeless-universe',
    tradition: { en: 'Existential ethics and deontology', zh: '存在主义伦理与义务论' },
    because: {
      en: 'Your meaning index leans toward creation, and your moral index leans toward duty and constraint.',
      zh: '你的意义指数偏向创造，而你的道德指数偏向义务与约束。',
    },
    sources: [
      sep('life-meaning', 'Stanford Encyclopedia of Philosophy, “The Meaning of Life”'),
      sep('existentialism', 'Stanford Encyclopedia of Philosophy, “Existentialism”'),
      sep('ethics-deontological', 'Stanford Encyclopedia of Philosophy, “Deontological Ethics”'),
    ],
    activates: (result) =>
      result.dimensions.meaning.inclination === 'right' && result.dimensions.ethics.inclination === 'right',
  },
  {
    id: 'autonomy-communion',
    kind: 'context-dependent',
    dimensions: ['society'],
    problem: {
      en: 'Personal independence and communal obligation',
      zh: '个人独立与共同体义务',
    },
    explanation: {
      en: 'Your social answers do not settle on one side. That can be a principled refusal to let one slogan cover every case: a right against being used, and a duty that comes with belonging, both survive in ordinary moral life. The axis records the split. It does not convert the split into a party, a tribe, or a temperament.',
      zh: '你在社会问题上的回答没有落在单一一侧。这可以是一种有原则的拒绝：不让一句口号覆盖一切情形。反对被利用的权利，和来自归属的义务，在日常道德生活里都可以成立。这一轴记下了分裂。它不把分裂换成党派、群体或气质。',
    },
    alternatives: {
      en: 'Liberal theories often start from separate persons and then ask what they owe one another. Confucian traditions often start from relationships and then ask where a remonstrance against the group is still required. Aristotle’s political animal is not a modern communitarian, and Mill is not a slogan for leaving every bond.',
      zh: '自由主义理论常常从分离的个人出发，再问他们彼此亏欠什么。儒家传统常常从关系出发，再问何处仍需要谏阻群体。亚里士多德的政治动物不是现代共同体主义者，密尔也不是“离开一切纽带”的口号。',
    },
    followUp: {
      en: 'Name a demand from a community you would accept, and a demand you would refuse. What differs, other than how you feel about the people involved?',
      zh: '举出一项你会接受的共同体要求，和一项你会拒绝的。除了对相关的人的感受之外，差别在哪里？',
    },
    tradition: { en: 'Liberty and belonging', zh: '自由与归属' },
    because: {
      en: 'Your social answers are mixed, or they pull in both directions strongly enough that one pole would misdescribe them.',
      zh: '你的社会问题回答是混合的，或者两边的拉力都足够强，单用一极会误述它们。',
    },
    sources: [
      sep('liberalism', 'Stanford Encyclopedia of Philosophy, “Liberalism”'),
      sep('communitarianism', 'Stanford Encyclopedia of Philosophy, “Communitarianism”'),
      sep('confucius', 'Stanford Encyclopedia of Philosophy, “Confucius”'),
    ],
    activates: (result) => {
      const social = result.dimensions.society;
      return (
        social.inclination === 'mixed' ||
        (social.inconsistency !== null && social.inconsistency >= 0.45 && social.directionalCount >= 3)
      );
    },
  },
  {
    id: 'physicalism-consciousness',
    kind: 'apparent-tension',
    dimensions: ['ontology'],
    problem: {
      en: 'A physical account and conscious experience',
      zh: '物理解释与意识经验',
    },
    explanation: {
      en: 'Your reality answers lean toward a physical world, and they also divide on whether a physical description leaves something out of experience. That division is the territory of the explanatory gap. It is not yet a logical contradiction: “everything is physical” and “we do not yet see how experience is physical” can both be maintained.',
      zh: '你关于实在的回答偏向物理世界，同时又在“物理解释是否遗漏了经验中的某种东西”上彼此分开。这一分开正是解释鸿沟所在的区域。它还不是逻辑矛盾：“一切都是物理的”与“我们尚未看出经验如何是物理的”可以同时被坚持。',
    },
    alternatives: {
      en: 'Identity theorists and some physicalists say the gap is a limit on our concepts, not on the world. Dualists and some idealists say the gap is evidence that the inventory is incomplete. Neutral monism and panpsychism are further options this axis does not score.',
      zh: '同一论者和一些物理主义者说，鸿沟是我们概念的限制，不是世界的限制。二元论者和一些观念论者说，鸿沟证明清单并不完整。中立一元论和泛心论是这一轴没有计分的进一步选项。',
    },
    followUp: {
      en: 'If a physical description of seeing red were finished, what question, if any, would you still be entitled to ask?',
      zh: '如果关于“看见红色”的物理解释已经完成，你还拥有权利追问什么问题——如果还有的话？',
    },
    experimentSlug: 'machine-and-pain',
    tradition: { en: 'Philosophy of mind', zh: '心灵哲学' },
    because: {
      en: 'Your reality index leans physicalist, while your answers on that axis still pull against one another.',
      zh: '你的实在指数偏向物理主义，但你在这一轴上的回答仍然彼此拉扯。',
    },
    sources: [
      sep('physicalism', 'Stanford Encyclopedia of Philosophy, “Physicalism”'),
      sep('qualia', 'Stanford Encyclopedia of Philosophy, “Qualia”'),
      {
        label: 'Thomas Nagel, “What Is It Like to Be a Bat?” (1974)',
        href: 'https://plato.stanford.edu/entries/nagel/',
      },
    ],
    activates: (result) =>
      result.dimensions.ontology.inclination === 'left' &&
      result.dimensions.ontology.inconsistency !== null &&
      result.dimensions.ontology.inconsistency >= 0.35,
  },
  {
    id: 'compatibilist-responsibility',
    kind: 'philosophical-disagreement',
    dimensions: ['agency'],
    problem: {
      en: 'Responsibility without an uncaused will',
      zh: '没有无因意志的责任',
    },
    explanation: {
      en: 'You accepted a description on which a person can be responsible because they acted for their own reasons, even if those reasons have causes. That is a compatibilist thought. This axis cannot place it halfway between determinism and libertarian free will. Leaving it unscored is the honest alternative to pretending the midpoint is compatibilism.',
      zh: '你接受了这样一种描述：一个人可以因为出于自己的理由而行动、因而负有责任，即便那些理由有原因。这是相容论的想法。这一轴不能把它放在决定论与自由意志论的半途。不予计分，是比“假装中点就是相容论”更诚实的做法。',
    },
    alternatives: {
      en: 'Libertarians can reply that reasons which were themselves fixed are not yet the agent’s authorship. Hard determinists can reply that the compatibilist has changed the subject, from “could have done otherwise” to a thinner social practice of praise and blame.',
      zh: '自由意志论者可以回应：本身已被固定的理由，还不是行动者的创作者身份。强硬决定论者可以回应：相容论转移了话题，从“本来可以另作选择”转到了一种更薄的赞扬与责备的社会实践。',
    },
    followUp: {
      en: 'When you say the person acted for their own reasons, what would you count as a cause that makes the reasons no longer their own?',
      zh: '当你说这个人出于自己的理由而行动时，什么样的原因会让这些理由不再是他们自己的？',
    },
    experimentSlug: 'predicting-a-choice',
    tradition: { en: 'Compatibilism', zh: '相容论' },
    because: {
      en: 'You chose at least one compatibilist description. That response is recorded, and it is not converted into a point on the agency index.',
      zh: '你至少选择了一次相容论式的描述。这一回答被记下，并且没有被换算成能动性指数上的一个点。',
    },
    sources: [
      sep('compatibilism', 'Stanford Encyclopedia of Philosophy, “Compatibilism”'),
      {
        label: 'Harry Frankfurt, “Alternate Possibilities and Moral Responsibility” (1969)',
        href: 'https://plato.stanford.edu/entries/frankfurt/',
      },
    ],
    activates: (result) => (result.dimensions.agency.alternativeTags.compatibilism ?? 0) >= 1,
  },
  {
    id: 'nihilist-meaning',
    kind: 'unresolved-uncertainty',
    dimensions: ['meaning'],
    problem: {
      en: 'The absence of cosmic purpose',
      zh: '宇宙目的的缺席',
    },
    explanation: {
      en: 'You allowed that, without a purpose built into the universe, meaning may not get a foothold. That is not the same as creating meaning, and it is not the same as discovering it. The meaning axis does not treat this answer as a midpoint, and it does not relabel it as nihilism-as-personality.',
      zh: '你允许这样一种可能：如果宇宙里没有被建造好的目的，意义也许无处立足。这与创造意义不是一回事，与发现意义也不是一回事。意义之轴不把这个回答当作中点，也不把它重新标成一种人格上的虚无主义。',
    },
    alternatives: {
      en: 'Camus treats the absurd as a confrontation to be lived without a metaphysical consolation, and without a simple instruction to invent a private meaning. Other writers argue that value can be objective even in a universe with no purpose of its own.',
      zh: '加缪把荒诞看作一种需要活下去的对峙，既没有形而上学的安慰，也没有“去发明一种私人意义”的简单指令。另一些作者主张，即使宇宙自身没有目的，价值仍然可以是客观的。',
    },
    followUp: {
      en: 'If nothing in the universe needs your life, what, if anything, still makes a demand on how you live it?',
      zh: '如果宇宙中没有什么需要你的生活，还有什么——如果还有的话——仍然对你如何生活提出要求？',
    },
    experimentSlug: 'purposeless-universe',
    tradition: { en: 'The absurd and theories of meaning', zh: '荒诞与意义理论' },
    because: {
      en: 'You chose the response that withholds both discovery and creation when the universe itself has no purpose.',
      zh: '你选择了这样的回答：当宇宙自身没有目的时，发现与创造都不被采纳。',
    },
    sources: [
      sep('life-meaning', 'Stanford Encyclopedia of Philosophy, “The Meaning of Life”'),
      sep('camus', 'Stanford Encyclopedia of Philosophy, “Albert Camus”'),
    ],
    activates: (result) => (result.dimensions.meaning.alternativeTags.nihilism ?? 0) >= 1,
  },
];

export function activateTensions(result: AssessmentResult) {
  return tensionRules
    .filter((rule) => rule.activates(result))
    .map((rule) => ({
      id: rule.id,
      kind: rule.kind,
      dimensions: rule.dimensions,
      because: rule.because,
    }));
}

export function getTensionRule(id: string): TensionRule | undefined {
  return tensionRules.find((rule) => rule.id === id);
}
