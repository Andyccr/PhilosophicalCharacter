import type { DimensionId, Localized, Question, QuestionOption } from '@/types/model';

export const QUESTION_VERSION = '1.0.0';

const uncertain: QuestionOption = {
  id: 'u',
  kind: 'uncertain',
  label: { en: 'I cannot determine', zh: '我无法判断' },
};

const likertCopy = {
  sd: { en: 'Strongly disagree', zh: '非常不同意' },
  d: { en: 'Disagree', zh: '不同意' },
  a: { en: 'Agree', zh: '同意' },
  sa: { en: 'Strongly agree', zh: '非常同意' },
} as const;

function directional(
  id: string,
  label: Localized,
  weights: Partial<Record<DimensionId, number>>,
): QuestionOption {
  return { id, kind: 'directional', label, weights };
}

function alternative(id: string, label: Localized, alternativeTag: string): QuestionOption {
  return { id, kind: 'alternative', label, alternativeTag };
}

function likert(input: {
  id: string;
  dimension: DimensionId;
  reverseKeyed: boolean;
  theme: Localized;
  prompt: Localized;
  rationale: Localized;
  tags: string[];
  references?: Question['references'];
}): Question {
  const sign = input.reverseKeyed ? -1 : 1;
  const weight = (agreeMagnitude: number) => ({ [input.dimension]: sign * agreeMagnitude });
  return {
    id: input.id,
    version: QUESTION_VERSION,
    type: 'likert',
    theme: input.theme,
    prompt: input.prompt,
    dimensions: [input.dimension],
    primaryDimension: input.dimension,
    rationale: input.rationale,
    reverseKeyed: input.reverseKeyed,
    tags: input.tags,
    references: input.references,
    options: [
      directional('sd', likertCopy.sd, weight(-2)),
      directional('d', likertCopy.d, weight(-1)),
      directional('a', likertCopy.a, weight(1)),
      directional('sa', likertCopy.sa, weight(2)),
      uncertain,
    ],
  };
}

function item(input: Omit<Question, 'version' | 'tags'> & { tags?: string[] }): Question {
  return { version: QUESTION_VERSION, tags: input.tags ?? [], ...input };
}

export const questions: Question[] = [
  likert({
    id: 'ont-01',
    dimension: 'ontology',
    reverseKeyed: true,
    theme: { en: 'Physical explanation', zh: '物理解释' },
    prompt: {
      en: 'Everything that exists, including thoughts and feelings, is ultimately a physical process.',
      zh: '一切存在的东西，包括思想和感受，归根结底都是物理过程。',
    },
    rationale: {
      en: 'This statement concerns whether a physical description is enough for mental life. It belongs to the reality axis. Agreement and disagreement are both intelligible philosophical responses.',
      zh: '这句话关乎物理解释是否足以说明精神生活。它属于实在之轴。同意与不同意都是可以理解的哲学回应。',
    },
    tags: ['reduction', 'consciousness'],
  }),
  likert({
    id: 'ont-02',
    dimension: 'ontology',
    reverseKeyed: false,
    theme: { en: 'Conscious experience', zh: '意识体验' },
    prompt: {
      en: 'Conscious experience cannot be fully explained as a physical process.',
      zh: '意识体验无法被完全解释为物理过程。',
    },
    rationale: {
      en: 'This statement asks whether experience remains after a physical account is finished. It belongs to the reality axis and does not ask about religion or spirituality.',
      zh: '这句话问的是：物理解释做完之后，体验是否仍有剩下来的部分。它属于实在之轴，与宗教或灵性无关。',
    },
    tags: ['consciousness'],
  }),
  item({
    id: 'ont-03',
    type: 'scenario',
    theme: { en: 'A finished physical account', zh: '一份完整的物理解释' },
    prompt: {
      en: 'A team produces a complete physical account of a person at the moment they see a red sunset: every measurement of the body and its surroundings that physics can give.',
      zh: '一个团队对一个人看见红色晚霞的那一刻，给出了物理学所能提供的、关于身体及其周围的完整物理说明。',
    },
    dimensions: ['ontology'],
    primaryDimension: 'ontology',
    tags: ['consciousness'],
    rationale: {
      en: 'The case asks what you think a finished physical description settles. It is related to discussions of conscious experience, including Thomas Nagel’s 1974 paper on what experience is like. It does not ask you to solve a puzzle.',
      zh: '这个情境问的是：你认为一份完成了的物理描述解决了什么。它与关于意识体验的讨论有关，包括托马斯·内格尔 1974 年关于“那种主观体验”的论文。它并不要求你解开一道谜题。',
    },
    references: [
      {
        label: 'Thomas Nagel, “What Is It Like to Be a Bat?” Philosophical Review (1974)',
        href: 'https://plato.stanford.edu/entries/qualia/',
      },
    ],
    options: [
      directional('a', {
        en: 'That account leaves nothing about the seeing itself still to explain.',
        zh: '这份说明没有留下任何关于“看见本身”仍待解释的东西。',
      }, { ontology: -2 }),
      directional('b', {
        en: 'That account can be complete as physics and still omit what the seeing is like.',
        zh: '这份说明作为物理学可以是完整的，却仍然遗漏了看见时的那种体验。',
      }, { ontology: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'ont-04',
    type: 'thought-experiment',
    theme: { en: 'A machine that reports pain', zh: '一台报告疼痛的机器' },
    prompt: {
      en: 'A machine has the same physical organization as a human nervous system and says that it is in pain.',
      zh: '一台机器拥有与人类神经系统相同的物理组织，并且说自己正在疼痛。',
    },
    dimensions: ['ontology'],
    primaryDimension: 'ontology',
    tags: ['consciousness', 'machines'],
    rationale: {
      en: 'This case asks whether sameness of physical organization settles whether there is experience. It is an original wording in the neighborhood of debates about machine consciousness. Neither answer is treated as the intelligent one.',
      zh: '这个情境问的是：物理组织的相同，是否决定了有没有体验。它是围绕机器意识争论的一种原创表述。两个回答都不会被当成“更聪明”的那个。',
    },
    options: [
      directional('a', {
        en: 'If the physical organization is the same, there is no further fact about whether it is in pain.',
        zh: '如果物理组织相同，关于它是否在疼痛就没有进一步的事实。',
      }, { ontology: -2 }),
      directional('b', {
        en: 'The physical organization does not settle whether there is anything it is like for the machine.',
        zh: '物理组织并不能决定：对这台机器而言，是否存在任何主观体验。',
      }, { ontology: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'ont-05',
    type: 'forced-choice',
    theme: { en: 'Reasons and causes', zh: '理由与原因' },
    prompt: {
      en: 'When you explain why a person acted, which kind of explanation do you treat as more basic?',
      zh: '当你解释一个人为何如此行动时，你把哪一种解释视为更基本的？',
    },
    dimensions: ['ontology'],
    primaryDimension: 'ontology',
    tags: ['explanation'],
    rationale: {
      en: 'This tradeoff asks which explanation you treat as more basic. It does not say that the other explanation is useless.',
      zh: '这个取舍问的是你把哪一种解释视为更基本。它并不说另一种解释没有用处。',
    },
    options: [
      directional('a', {
        en: 'The physical and causal story of the body and its surroundings.',
        zh: '关于身体及其周围的物理与因果叙述。',
      }, { ontology: -2 }),
      directional('b', {
        en: 'The person’s reasons, understood as something a physical story does not exhaust.',
        zh: '这个人的理由，而这些理由并不被物理叙述穷尽。',
      }, { ontology: 2 }),
      uncertain,
    ],
  }),
  likert({
    id: 'ont-06',
    dimension: 'ontology',
    reverseKeyed: true,
    theme: { en: 'A world without observers', zh: '没有观察者的世界' },
    prompt: {
      en: 'The world would still have the structure it has even if no mind had ever existed to perceive it.',
      zh: '即便从来没有任何心灵感知过它，世界仍会具有它现在的结构。',
    },
    rationale: {
      en: 'This statement concerns whether the world’s structure depends on mind. It belongs to the reality axis. It does not equate mind-dependence with spirituality.',
      zh: '这句话关乎世界的结构是否依赖于心灵。它属于实在之轴。它并不把对心灵的依赖等同于灵性。',
    },
    tags: ['realism'],
  }),
  likert({
    id: 'epi-01',
    dimension: 'epistemology',
    reverseKeyed: true,
    theme: { en: 'Observation', zh: '观察' },
    prompt: {
      en: 'A claim about the world earns its credibility mainly by being checked against observation.',
      zh: '一个关于世界的主张之所以可信，主要是因为它经受了观察的检验。',
    },
    rationale: {
      en: 'This statement is about the weight you give to observation. It does not say that reasoning is dispensable.',
      zh: '这句话关乎你给予观察的分量。它并不说推理是可有可无的。',
    },
    tags: ['observation'],
  }),
  likert({
    id: 'epi-02',
    dimension: 'epistemology',
    reverseKeyed: false,
    theme: { en: 'Reasoning ahead of observation', zh: '先于观察的推理' },
    prompt: {
      en: 'Some important truths about reality can be known by reasoning alone, before any particular observation.',
      zh: '关于实在的某些重要真理，可以仅凭推理得知，而先于任何特定的观察。',
    },
    rationale: {
      en: 'This statement asks whether reasoning can be a source of knowledge about reality, not whether observation ever matters.',
      zh: '这句话问的是推理能否成为关于实在的知识来源，而不是在问观察是否重要。',
    },
    tags: ['a-priori'],
  }),
  item({
    id: 'epi-03',
    type: 'scenario',
    theme: { en: 'A messy record and a clean argument', zh: '凌乱的记录与干净的论证' },
    prompt: {
      en: 'Two investigators disagree about how some part of the world works. One has a careful observational record and a theory that is still untidy. The other has an elegant argument from general principles and very little observation.',
      zh: '两位探究者对世界的某一部分如何运作意见不同。一位有仔细的观察记录，理论却仍然凌乱。另一位有一个从一般原则出发的优美论证，观察却很少。',
    },
    dimensions: ['epistemology'],
    primaryDimension: 'epistemology',
    tags: ['observation', 'principles'],
    rationale: {
      en: 'The case asks where you put more initial trust. It does not ask which investigator is more intelligent, and it allows that both observation and argument can matter.',
      zh: '这个情境问的是你最初更信任哪一边。它不问哪位探究者更聪明，也允许观察与论证都重要。',
    },
    options: [
      directional('a', {
        en: 'I give more initial trust to the observational record.',
        zh: '我最初更信任观察记录。',
      }, { epistemology: -2 }),
      directional('b', {
        en: 'I give more initial trust to the argument from principles.',
        zh: '我最初更信任从原则出发的论证。',
      }, { epistemology: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'epi-04',
    type: 'thought-experiment',
    theme: { en: 'Reason without acquaintance', zh: '没有亲知的理性' },
    prompt: {
      en: 'Imagine someone who can reason flawlessly but has never observed the natural world, and someone else who has rich observation and a weak grasp of theory. You want to learn what the world is like.',
      zh: '想象一个人能够完美地推理，却从未观察过自然世界；另一个人观察丰富，对理论的掌握却很弱。你想知道世界究竟是怎样的。',
    },
    dimensions: ['epistemology'],
    primaryDimension: 'epistemology',
    tags: ['a-priori', 'observation'],
    rationale: {
      en: 'This contrast asks what you think can teach you about the world. It is not a test of whether you can reason flawlessly yourself.',
      zh: '这个对照问的是，你认为什么能让你了解世界。它并不是在测验你自己能否完美地推理。',
    },
    options: [
      directional('a', {
        en: 'Observation is indispensable. Reasoning alone cannot substitute for it.',
        zh: '观察不可缺少。仅有推理不能代替它。',
      }, { epistemology: -2 }),
      directional('b', {
        en: 'Rigorous reasoning could reveal the world’s basic structure without that observation.',
        zh: '严格的推理可以在没有那些观察的情况下揭示世界的基本结构。',
      }, { epistemology: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'epi-05',
    type: 'forced-choice',
    theme: { en: 'When observation and argument conflict', zh: '观察与论证冲突时' },
    prompt: {
      en: 'A repeated observation conflicts with an argument that still seems sound. What should give way first?',
      zh: '反复出现的观察与一个看起来仍然成立的论证互相冲突。应当先让哪一边退让？',
    },
    dimensions: ['epistemology'],
    primaryDimension: 'epistemology',
    tags: ['conflict'],
    rationale: {
      en: 'The question asks which kind of check you run first. It does not say that the other kind should be ignored.',
      zh: '这个问题问的是你先做哪一种核对。它并不说另一种核对应当被忽略。',
    },
    options: [
      directional('a', {
        en: 'Revise the argument to fit the observations, unless the observations themselves fail a further check.',
        zh: '修改论证以符合观察，除非观察本身没能通过进一步的核对。',
      }, { epistemology: -2 }),
      directional('b', {
        en: 'Recheck the observations first. A sound argument can outweigh an apparent observation.',
        zh: '先重新核对观察。一个成立的论证可以压过一次表面上的观察。',
      }, { epistemology: 2 }),
      uncertain,
    ],
  }),
  likert({
    id: 'epi-06',
    dimension: 'epistemology',
    reverseKeyed: false,
    theme: { en: 'Necessity as a model of knowledge', zh: '作为知识典范的必然性' },
    prompt: {
      en: 'Mathematical and logical necessity is a model for the strongest kind of knowledge we can have.',
      zh: '数学与逻辑的必然性，是我们所能拥有的最强知识的一种典范。',
    },
    rationale: {
      en: 'This statement asks how far you take necessity as a model of knowledge. It does not deny that observation can be knowledge.',
      zh: '这句话问的是你在多大程度上把必然性当作知识的典范。它并不否认观察也可以是知识。',
    },
    tags: ['necessity'],
  }),
  likert({
    id: 'eth-01',
    dimension: 'ethics',
    reverseKeyed: true,
    theme: { en: 'Outcomes', zh: '结果' },
    prompt: {
      en: 'Whether an action is right depends primarily on the outcomes it brings about.',
      zh: '一个行为是否正当，主要取决于它所带来的结果。',
    },
    rationale: {
      en: 'This statement asks how much of rightness you place in outcomes. Other moral traditions, including virtue ethics, are discussed in the atlas and are not a hidden third score.',
      zh: '这句话问的是你把多少“正当性”放在结果上。包括德性伦理在内的其他道德传统在图谱中讨论，并不是一个隐藏的第三分数。',
    },
    tags: ['outcomes'],
  }),
  likert({
    id: 'eth-02',
    dimension: 'ethics',
    reverseKeyed: false,
    theme: { en: 'Constraints', zh: '约束' },
    prompt: {
      en: 'Some actions are wrong even when they produce better overall outcomes.',
      zh: '有些行为即使带来更好的总体结果，仍然是错的。',
    },
    rationale: {
      en: 'This statement asks whether outcomes can be blocked by a constraint. It does not say that outcomes are irrelevant.',
      zh: '这句话问的是结果能否被一项约束挡住。它并不说结果无关紧要。',
    },
    tags: ['constraints'],
  }),
  item({
    id: 'eth-03',
    type: 'thought-experiment',
    theme: { en: 'The runaway tram', zh: '失控的电车' },
    prompt: {
      en: 'A runaway tram is heading toward five people. You can divert it onto another track, where it will kill one person. You cannot stop it. This case comes from Philippa Foot’s 1967 discussion and was later reworked by Judith Jarvis Thomson.',
      zh: '一辆失控的电车正冲向五个人。你可以把它转到另一条轨道，在那里它会撞死一个人。你无法让它停下。这个案例来自菲莉帕·福特 1967 年的讨论，后来由朱迪丝·贾维斯·汤姆森改写。',
    },
    dimensions: ['ethics'],
    primaryDimension: 'ethics',
    tags: ['trolley'],
    rationale: {
      en: 'The case asks how you weigh a smaller harm you would steer against a larger harm you would otherwise allow. The page does not report what Foot or Thomson concluded.',
      zh: '这个情境问的是：你如何权衡一个因你转向而造成的较小伤害，与一个若你不转向就会发生的较大伤害。本页不报告福特或汤姆森的结论。',
    },
    references: [
      {
        label: 'Philippa Foot, “The Problem of Abortion and the Doctrine of the Double Effect,” Oxford Review (1967)',
        href: 'https://plato.stanford.edu/entries/philippa-foot/',
      },
    ],
    options: [
      directional('a', {
        en: 'Divert the tram. Five deaths are worse than one.',
        zh: '转向。五个人的死比一个人的死更糟。',
      }, { ethics: -2 }),
      directional('b', {
        en: 'Do not divert it. Steering the tram onto someone is a wrong I must not commit for the sake of the numbers.',
        zh: '不转向。为了数字而把电车转向某一个人，是我不应当做的错事。',
      }, { ethics: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'eth-04',
    type: 'scenario',
    theme: { en: 'A promise and a harm', zh: '承诺与伤害' },
    prompt: {
      en: 'You promised a friend to keep a confidence. Breaking that promise would prevent serious harm to several other people. Your friend would not be physically injured by the disclosure.',
      zh: '你答应一位朋友保守一个秘密。打破这个承诺可以防止对其他几个人的严重伤害。披露并不会使你的朋友身体受伤。',
    },
    dimensions: ['ethics'],
    primaryDimension: 'ethics',
    tags: ['promise'],
    rationale: {
      en: 'The case puts a promise next to a harm that the promise helps to permit. It does not say which consideration is morally superior.',
      zh: '这个情境把一个承诺与它间接容许的伤害放在一起对照。它并不说哪一种考虑在道德上更胜一筹。',
    },
    options: [
      directional('a', {
        en: 'Break the promise if the harm prevented is great enough.',
        zh: '如果因此防止的伤害足够大，就打破承诺。',
      }, { ethics: -2 }),
      directional('b', {
        en: 'Keep the promise. The duty to the friend is not canceled by a better overall result.',
        zh: '守住承诺。对朋友的义务并不因总体结果更好而被取消。',
      }, { ethics: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'eth-05',
    type: 'forced-choice',
    theme: { en: 'A benefit and a right', zh: '利益与权利' },
    prompt: {
      en: 'A policy would greatly improve well-being for a large majority, and it would do so by violating one innocent person’s basic rights.',
      zh: '一项政策会大大改善大多数人的福祉，而它这样做的方式是侵犯一个无辜者的基本权利。',
    },
    dimensions: ['ethics'],
    primaryDimension: 'ethics',
    tags: ['rights'],
    rationale: {
      en: 'The tradeoff asks whether a right can block an improvement in well-being. It does not name a party, a country, or a law now in force.',
      zh: '这个取舍问的是一项权利能否挡住福祉的改善。它不指向任何政党、国家或现行法律。',
    },
    options: [
      directional('a', {
        en: 'The improvement can justify the violation.',
        zh: '这种改善可以为这一侵犯辩护。',
      }, { ethics: -2 }),
      directional('b', {
        en: 'The right stands even if the numbers favor violating it.',
        zh: '即使数字支持侵犯它，这项权利仍然成立。',
      }, { ethics: 2 }),
      uncertain,
    ],
  }),
  likert({
    id: 'eth-06',
    dimension: 'ethics',
    reverseKeyed: false,
    theme: { en: 'Rules under pressure', zh: '压力下的规则' },
    prompt: {
      en: 'A moral rule can bind you even when breaking it would help more people.',
      zh: '即使打破一条道德规则会帮助更多的人，它仍然可以约束你。',
    },
    rationale: {
      en: 'This statement asks whether a rule can outrank a wider benefit. Helping more people remains a serious consideration either way.',
      zh: '这句话问的是一条规则能否压过更广的利益。无论哪一种回答，帮助更多的人仍然是严肃的考虑。',
    },
    tags: ['constraints'],
  }),
  likert({
    id: 'age-01',
    dimension: 'agency',
    reverseKeyed: true,
    theme: { en: 'Could have done otherwise', zh: '本来可以另作选择' },
    prompt: {
      en: 'Given the past and the laws of nature, a person’s choice could not have been otherwise.',
      zh: '给定过去与自然法则，一个人的选择本来不可能是另一个样子。',
    },
    rationale: {
      en: 'This statement concerns whether the past and the laws leave an alternative open. Compatibilism, which this axis does not score as a midpoint, is available on a later question.',
      zh: '这句话关乎过去与法则是否还留有别的可能。相容论在后面的题目中可以作为选项出现；这一轴并不把它计成中点。',
    },
    tags: ['determinism'],
  }),
  likert({
    id: 'age-02',
    dimension: 'agency',
    reverseKeyed: false,
    theme: { en: 'An unsettled alternative', zh: '尚未确定的另一种可能' },
    prompt: {
      en: 'At the moment of a genuine decision, more than one action is open, and nothing already settled which one the person will take.',
      zh: '在一个真正的决定发生的时刻，不止一个行动是开放的，而且没有任何已经确定的东西规定这个人将采取哪一个。',
    },
    rationale: {
      en: 'This statement describes a libertarian picture of decision. Disagreeing with it does not by itself say what you think about blame.',
      zh: '这句话描述的是一种自由意志论式的决定图景。不同意它，本身并不说明你如何看待责备。',
    },
    tags: ['libertarian'],
  }),
  item({
    id: 'age-03',
    type: 'thought-experiment',
    theme: { en: 'A perfect prediction', zh: '完美的预测' },
    prompt: {
      en: 'A predictor that has never been wrong tells you what you will choose before you choose. The case is about whether a choice is fixed ahead of time. It is related to Laplace’s image of a complete prediction and is not Newcomb’s problem.',
      zh: '一个从未出错的预测者，在你做出选择之前就告诉你你会怎么选。这个情境关乎选择是否在事先就已经被决定。它与拉普拉斯关于完整预测的设想有关，但并不是纽科姆难题。',
    },
    dimensions: ['agency'],
    primaryDimension: 'agency',
    tags: ['prediction'],
    rationale: {
      en: 'The case asks what a perfect prediction would mean. It does not ask you to outsmart the predictor.',
      zh: '这个情境问的是完美预测意味着什么。它并不要求你比预测者更高明。',
    },
    references: [
      {
        label: 'Pierre-Simon Laplace, A Philosophical Essay on Probabilities (1814)',
        href: 'https://plato.stanford.edu/entries/determinism-causal/',
      },
    ],
    options: [
      directional('a', {
        en: 'The prediction can be right because the choice is already fixed by prior causes.',
        zh: '预测可以是对的，因为选择已经被先前的原因固定。',
      }, { agency: -2 }),
      directional('b', {
        en: 'The prediction cannot already be settled, because the choice itself is not yet fixed.',
        zh: '预测不可能已经被确定，因为选择本身尚未被固定。',
      }, { agency: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'age-04',
    type: 'scenario',
    theme: { en: 'Causes and blame', zh: '原因与责备' },
    prompt: {
      en: 'A person’s harmful act is fully explained by their history and circumstances. No step in the story is missing.',
      zh: '一个人的有害行为可以由其历史与处境完全解释。叙述中没有任何缺失的步骤。',
    },
    dimensions: ['agency'],
    primaryDimension: 'agency',
    tags: ['responsibility', 'compatibilism'],
    rationale: {
      en: 'One response here is compatibilist. Choosing it records that position and does not place you halfway along the axis.',
      zh: '这里有一个回应是相容论的。选择它会记下这个立场，而不会把你放在轴线的半途。',
    },
    options: [
      directional('a', {
        en: 'They are not morally responsible, because the act was produced by causes they did not author.',
        zh: '他们不负有道德责任，因为这个行为是由并非他们自己造成的原因所导致的。',
      }, { agency: -2 }),
      directional('b', {
        en: 'They are responsible only if they could have done otherwise in a way not fixed by prior causes.',
        zh: '只有当他们本来可以以一种不被先前原因固定的方式另作选择时，他们才负有责任。',
      }, { agency: 2 }),
      alternative('c', {
        en: 'They can be responsible because they acted for their own reasons, even if those reasons have causes.',
        zh: '他们可以负有责任，因为他们出于自己的理由而行动，即便那些理由有原因。',
      }, 'compatibilism'),
      uncertain,
    ],
  }),
  item({
    id: 'age-05',
    type: 'forced-choice',
    theme: { en: 'The experience of choosing', zh: '选择的体验' },
    prompt: {
      en: 'What best accounts for the experience of choosing?',
      zh: '什么最能说明选择的体验？',
    },
    dimensions: ['agency'],
    primaryDimension: 'agency',
    tags: ['experience-of-choice'],
    rationale: {
      en: 'The question asks how you understand the experience of choice. It does not treat that experience as proof.',
      zh: '这个问题问的是你如何理解选择的体验。它并不把那种体验当作证明。',
    },
    options: [
      directional('a', {
        en: 'It is the way a caused process appears from the inside.',
        zh: '它是一个有原因的过程从内部呈现出来的方式。',
      }, { agency: -2 }),
      directional('b', {
        en: 'It is the exercise of a power to settle what was not yet settled.',
        zh: '它是一种能力的行使，用来确定尚未被确定的事情。',
      }, { agency: 2 }),
      uncertain,
    ],
  }),
  likert({
    id: 'age-06',
    dimension: 'agency',
    reverseKeyed: false,
    theme: { en: 'New beginnings', zh: '新的开端' },
    prompt: {
      en: 'Human choices introduce beginnings into the course of events. They are not only continuations of what came before.',
      zh: '人的选择为事件的进程带来新的开端。它们不只是先前之事的延续。',
    },
    rationale: {
      en: 'This statement asks whether a choice is a beginning or only a continuation. It is not a claim about political liberty.',
      zh: '这句话问的是选择究竟是一个开端，还是仅仅是延续。它不是关于政治自由的主张。',
    },
    tags: ['libertarian'],
  }),
  likert({
    id: 'mea-01',
    dimension: 'meaning',
    reverseKeyed: true,
    theme: { en: 'A purpose to be found', zh: '有待发现的目的' },
    prompt: {
      en: 'A life goes well, in the deepest sense, by realizing purposes that are there to be found, not only invented.',
      zh: '从最深的层面说，一种生活过得好，是因为它实现了那些有待发现的目的，而不只是自己发明出来的目的。',
    },
    rationale: {
      en: 'This statement asks whether the deepest purposes are found. Inventing a purpose is not described here as emptiness.',
      zh: '这句话问的是：最根本的目的是不是被发现的。它并没有说，自己发明一个目的就是空洞的。',
    },
    tags: ['discovery'],
  }),
  likert({
    id: 'mea-02',
    dimension: 'meaning',
    reverseKeyed: false,
    theme: { en: 'Commitments that confer weight', zh: '赋予分量的承诺' },
    prompt: {
      en: 'Meaning in a life comes from the commitments a person chooses and sustains, not from a purpose built into the world.',
      zh: '生活的意义来自一个人选择并坚持下去的承诺，而不是来自世界本身固有的某种目的。',
    },
    rationale: {
      en: 'This statement describes meaning as conferred by commitment. It is not a statement that nothing is worth doing.',
      zh: '这句话把意义说成是由承诺赋予的。它并不是在说没有什么值得去做。',
    },
    tags: ['creation'],
  }),
  item({
    id: 'mea-03',
    type: 'thought-experiment',
    theme: { en: 'A universe without a purpose', zh: '没有目的的宇宙' },
    prompt: {
      en: 'Suppose the universe has no purpose of its own. This theme is associated with Albert Camus’s treatment of the absurd in The Myth of Sisyphus (1942). The question does not treat the creation of meaning as nihilism.',
      zh: '假设宇宙本身没有目的。这一主题与阿尔贝·加缪在《西西弗神话》（1942）中对荒诞的讨论有关。这道题并不把创造意义看作虚无主义。',
    },
    dimensions: ['meaning'],
    primaryDimension: 'meaning',
    tags: ['absurd', 'nihilism'],
    rationale: {
      en: 'One response refuses both discovery and creation. That response is recorded as its own position and is not scored as the midpoint.',
      zh: '有一个回答同时拒绝发现和创造。这个回答被单独记为一种立场，而不会被算作中间点。',
    },
    references: [
      {
        label: 'Albert Camus, The Myth of Sisyphus (1942)',
        href: 'https://plato.stanford.edu/entries/camus/',
      },
    ],
    options: [
      directional('a', {
        en: 'Meaning can still be found in values that hold without a cosmic purpose.',
        zh: '即使没有宇宙层面的目的，意义仍然可以在站得住脚的价值中找到。',
      }, { meaning: -2 }),
      directional('b', {
        en: 'Meaning is something people create by the projects and loyalties they sustain.',
        zh: '意义是人通过自己坚持的事业和忠诚创造出来的。',
      }, { meaning: 2 }),
      alternative('c', {
        en: 'Without a cosmic purpose, there is no sense in which a life is meaningful.',
        zh: '如果没有宇宙层面的目的，人生就谈不上有什么意义。',
      }, 'nihilism'),
      uncertain,
    ],
  }),
  item({
    id: 'mea-04',
    type: 'scenario',
    theme: { en: 'Two paths', zh: '两条道路' },
    prompt: {
      en: 'One path fits a standard of a worthwhile life that you did not invent. Another path is yours alone and would not be recommended by any standard outside your choice.',
      zh: '一条道路符合某种“值得过的生活”的标准，而这个标准并不是你发明的。另一条道路只属于你，除了你自己的选择，没有任何外在标准会推荐它。',
    },
    dimensions: ['meaning'],
    primaryDimension: 'meaning',
    tags: ['vocation'],
    rationale: {
      en: 'The case asks which path you treat as more meaningful. It does not ask which path is more impressive.',
      zh: '这个情境问的是：你把哪条道路看作更有意义，而不是哪条道路更让人印象深刻。',
    },
    options: [
      directional('a', {
        en: 'The first is more meaningful, because it answers to something beyond preference.',
        zh: '第一条更有意义，因为它回应的是偏好之外的某种东西。',
      }, { meaning: -2 }),
      directional('b', {
        en: 'The second is more meaningful, because you are the one who gives it weight.',
        zh: '第二条更有意义，因为它的分量是你给的。',
      }, { meaning: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'mea-05',
    type: 'forced-choice',
    theme: { en: 'What a life is for', zh: '生活是为了什么' },
    prompt: {
      en: 'When someone asks what their life is for, which search do you treat as the more honest one?',
      zh: '当一个人问自己的生活是为了什么时，你觉得哪一种追问更诚实？',
    },
    dimensions: ['meaning'],
    primaryDimension: 'meaning',
    tags: ['search'],
    rationale: {
      en: 'The question contrasts two searches. It does not say that one of them is morally better.',
      zh: '这道题把两种追问放在一起对照，并不是说其中一种在道德上更高尚。',
    },
    options: [
      directional('a', {
        en: 'A search for what is worth loving and serving, whether or not one feels like it.',
        zh: '追问什么值得去爱、去奉献，无论自己当下有没有那个心情。',
      }, { meaning: -2 }),
      directional('b', {
        en: 'A search for what one is willing to stand for and build.',
        zh: '追问自己愿意为什么站出来、愿意去建设什么。',
      }, { meaning: 2 }),
      uncertain,
    ],
  }),
  likert({
    id: 'mea-06',
    dimension: 'meaning',
    reverseKeyed: true,
    theme: { en: 'Worth without endorsement', zh: '无需认可的价值' },
    prompt: {
      en: 'Some things are worth pursuing even if no one chooses to value them.',
      zh: '有些东西，即使没有人选择去重视，也依然值得追求。',
    },
    rationale: {
      en: 'This statement asks whether worth can outrun endorsement. It does not ask whether commitment is unimportant.',
      zh: '这句话问的是：价值能否不依赖任何人的认可而存在。它并不是在问承诺重不重要。',
    },
    tags: ['discovery'],
  }),
  likert({
    id: 'soc-01',
    dimension: 'society',
    reverseKeyed: true,
    theme: { en: 'A person’s own direction', zh: '一个人自己的方向' },
    prompt: {
      en: 'A just society protects each person’s right to direct their own life, even when the community would prefer otherwise.',
      zh: '一个公正的社会会保护每个人主导自己生活的权利，即使共同体更希望他们不这么做。',
    },
    rationale: {
      en: 'This statement is about a limit on communal preference. It does not name a political party or a current policy.',
      zh: '这句话讲的是对共同体偏好的一种限制，它没有点名任何政党或现行政策。',
    },
    tags: ['rights'],
  }),
  likert({
    id: 'soc-02',
    dimension: 'society',
    reverseKeyed: false,
    theme: { en: 'Duties of membership', zh: '成员身份带来的义务' },
    prompt: {
      en: 'A person owes real duties to their community that can outweigh a preference to be left alone.',
      zh: '一个人对自己的共同体负有实实在在的义务，这些义务有时会压过“别来管我”的意愿。',
    },
    rationale: {
      en: 'This statement asks whether membership can generate duties. It does not say that personal direction is trivial.',
      zh: '这句话问的是：成员身份能不能产生义务。它并没有说个人的方向无足轻重。',
    },
    tags: ['duty'],
  }),
  item({
    id: 'soc-03',
    type: 'scenario',
    theme: { en: 'A shared hardship', zh: '共同面对的困苦' },
    prompt: {
      en: 'A community faces a shared hardship. One member can contribute at a personal cost, or refuse because the plan limits their freedom and they did not consent to it.',
      zh: '一个共同体面临共同的困难。其中一位成员可以付出个人代价来出力，也可以拒绝，因为这个方案限制了他们的自由，而且他们并没有同意过。',
    },
    dimensions: ['society'],
    primaryDimension: 'society',
    tags: ['consent'],
    rationale: {
      en: 'The case asks whether consent or a common need has priority in this setting. It is not a question about a named state.',
      zh: '这个情境问的是：在这种情况下，是同意优先，还是共同的需要优先。它并不针对某个具体的国家。',
    },
    options: [
      directional('a', {
        en: 'The refusal should be honored. Consent and personal liberty come first.',
        zh: '应当尊重拒绝。同意和个人自由优先。',
      }, { society: -2 }),
      directional('b', {
        en: 'They can be required to contribute. The common need can override that preference.',
        zh: '可以要求他们出力。共同的需要可以压过那种意愿。',
      }, { society: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'soc-04',
    type: 'thought-experiment',
    theme: { en: 'Two kinds of legitimate demand', zh: '两种正当的要求' },
    prompt: {
      en: 'One law treats people as separate individuals and forbids using one person’s good for the group’s advantage. Another law asks each person to bear a burden so that the community can endure.',
      zh: '一部法律把每个人看作独立的个体，禁止为了群体的利益而牺牲某一个人。另一部法律要求每个人承担一份负担，好让共同体能够延续下去。',
    },
    dimensions: ['society'],
    primaryDimension: 'society',
    tags: ['legitimacy'],
    rationale: {
      en: 'The contrast asks which demand is closer to your view of legitimacy. Neither law is described as the decent one.',
      zh: '这个对照问的是：哪一种要求更接近你对正当性的理解。两部法律都没有被写成“更正确”的那一方。',
    },
    options: [
      directional('a', {
        en: 'The first is closer. Each person is a limit on what the group may do.',
        zh: '第一部更接近。每个人都是群体行为的界限。',
      }, { society: -2 }),
      directional('b', {
        en: 'The second is closer. Membership brings obligations the group may enforce for the common good.',
        zh: '第二部更接近。成员身份带来义务，群体可以为了共同利益而强制履行。',
      }, { society: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'soc-05',
    type: 'forced-choice',
    theme: { en: 'The more basic social fact', zh: '更基本的社会事实' },
    prompt: {
      en: 'Which social fact do you treat as more basic?',
      zh: '你把哪一种社会事实看作更基本的？',
    },
    dimensions: ['society'],
    primaryDimension: 'society',
    tags: ['foundation'],
    rationale: {
      en: 'The question asks where you start, not which side you think is kinder.',
      zh: '这道题问的是你从哪里出发，而不是你觉得哪一边更仁慈。',
    },
    options: [
      directional('a', {
        en: 'Individuals, whose agreements and rights create any legitimate group.',
        zh: '个人。任何正当的群体，都是通过个人的同意和权利才得以形成。',
      }, { society: -2 }),
      directional('b', {
        en: 'Communities, within which individuals become who they are and acquire obligations.',
        zh: '共同体。个人在共同体中成为自己，并获得义务。',
      }, { society: 2 }),
      uncertain,
    ],
  }),
  likert({
    id: 'soc-06',
    dimension: 'society',
    reverseKeyed: false,
    theme: { en: 'Duties one does not simply exit', zh: '不能一走了之的义务' },
    prompt: {
      en: 'Belonging to a community is not only a benefit. It is a source of duties one does not simply opt out of.',
      zh: '属于一个共同体不只是一种好处，它也是义务的来源，而这些义务并不能说退出就退出。',
    },
    rationale: {
      en: 'This statement asks whether belonging itself creates duties. It does not ask you to endorse every demand a community makes.',
      zh: '这句话问的是：归属本身是否会产生义务。它并不要求你赞同共同体提出的每一项要求。',
    },
    tags: ['belonging'],
  }),
  item({
    id: 'x-01',
    type: 'thought-experiment',
    theme: { en: 'The experience machine', zh: '体验机' },
    prompt: {
      en: 'A machine can give you any experiences you choose. While you are connected, you will not be doing the things you seem to be doing. Robert Nozick posed a machine of this kind in Anarchy, State, and Utopia (1974), in the section “The Experience Machine.”',
      zh: '有一台机器能给你任何你想要的经验。可一旦接上它，你看起来在做的事，其实你并没有真的在做。罗伯特·诺齐克在《无政府、国家与乌托邦》（1974）的“体验机”一节中提出了这样的机器。',
    },
    dimensions: ['meaning', 'ontology'],
    tags: ['experience-machine'],
    rationale: {
      en: 'The case asks whether contact with reality matters beyond how life feels. The two responses emphasize different parts of that question.',
      zh: '这个情境问的是：除了感受好不好之外，与真实世界的接触是否也重要。两种回答强调了这个问题的不同侧面。',
    },
    references: [
      {
        label: 'Robert Nozick, Anarchy, State, and Utopia (1974), “The Experience Machine”',
        href: 'https://plato.stanford.edu/entries/nozick-political/',
      },
    ],
    options: [
      directional('a', {
        en: 'I would not enter. A life should stay in contact with what is real, not only with what is felt.',
        zh: '我不会进去。生活应当与真实的东西保持接触，而不只是与感受保持接触。',
      }, { meaning: -2, ontology: -1 }),
      directional('b', {
        en: 'I would enter if the experiences formed a life I could endorse as mine.',
        zh: '如果这些经验能构成一种我愿意认作自己的生活，我会进去。',
      }, { meaning: 2, ontology: 1 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-02',
    type: 'thought-experiment',
    theme: { en: 'Organs and five patients', zh: '器官与五位病人' },
    prompt: {
      en: 'A surgeon can save five patients only by taking the organs of one healthy person who did not consent and who will die as a result. Judith Jarvis Thomson discussed a transplant case of this kind as a contrast to the tram.',
      zh: '一位外科医生只有取走一个健康人的器官，才能救五位病人；这个健康人并不同意，而且会因此丧命。朱迪丝·贾维斯·汤姆森讨论过这类移植案例，用它来与电车难题作对照。',
    },
    dimensions: ['ethics', 'society'],
    tags: ['transplant', 'rights'],
    rationale: {
      en: 'The case asks whether a gain in lives can license using one person. It is not a medical-knowledge question.',
      zh: '这个情境问的是：多救几条命，能否成为牺牲一个人的理由。它不是医学知识题。',
    },
    references: [
      {
        label: 'Judith Jarvis Thomson, “Killing, Letting Die, and the Trolley Problem,” The Monist (1976)',
        href: 'https://plato.stanford.edu/entries/philippa-foot/',
      },
    ],
    options: [
      directional('a', {
        en: 'Save the five. The outcomes decide it, and the group’s survival outweighs the one refusal.',
        zh: '救那五个人。让结果来决定，群体的存续压过这一个人的拒绝。',
      }, { ethics: -2, society: 2 }),
      directional('b', {
        en: 'Do not take the organs. The healthy person is a limit on what may be done for the others.',
        zh: '不要取走器官。这个健康人就是为他人能做到哪一步的界限。',
      }, { ethics: 2, society: -2 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-03',
    type: 'scenario',
    theme: { en: 'Responsibility under a full explanation', zh: '完整解释之下的责任' },
    prompt: {
      en: 'Someone has harmed another person. A full explanation of the harm can be given in terms of prior causes. What follows for blame?',
      zh: '有人伤害了另一个人。这件事可以用先前的原因得到完整的解释。那么，责备还成立吗？',
    },
    dimensions: ['agency', 'ethics'],
    tags: ['responsibility', 'compatibilism'],
    rationale: {
      en: 'The compatibilist response is recorded without being turned into a midpoint between the other two.',
      zh: '相容论的回答会被单独记录，而不会被当成另外两个回答之间的中间点。',
    },
    options: [
      directional('a', {
        en: 'Blame is misplaced. The act could not have been otherwise, so the usual point of blame is gone.',
        zh: '责备用错了地方。这个行为本来不可能是别的样子，所以责备通常的意义就不存在了。',
      }, { agency: -2, ethics: -1 }),
      directional('b', {
        en: 'Blame fits only if the person had a libertarian power to do otherwise. The duty not to harm depends on that power.',
        zh: '只有当这个人具有自由意志论所说的“本来可以不做”的能力时，责备才成立。不伤害的义务取决于这种能力。',
      }, { agency: 2, ethics: 2 }),
      alternative('c', {
        en: 'Blame can still fit if the act expressed the person’s reasons, even though those reasons have causes.',
        zh: '如果这个行为表达了这个人自己的理由，那么即使这些理由本身也有原因，责备仍然可以成立。',
      }, 'compatibilism'),
      uncertain,
    ],
  }),
  item({
    id: 'x-04',
    type: 'thought-experiment',
    theme: { en: 'A report of consciousness', zh: '一份关于意识的报告' },
    prompt: {
      en: 'A robot reports that it is conscious. You may inspect its behavior and its physical workings for as long as you like.',
      zh: '一个机器人报告说它有意识。你可以随意花多长时间，检查它的行为和它的物理构造。',
    },
    dimensions: ['ontology', 'epistemology'],
    tags: ['consciousness', 'machines'],
    rationale: {
      en: 'The case joins a question about evidence to a question about what consciousness is. It is not a test of technical knowledge about machines.',
      zh: '这个情境把一个关于证据的问题，和一个关于意识究竟是什么的问题连在一起。它不是考你对机器的技术知识。',
    },
    options: [
      directional('a', {
        en: 'Behavioral and physical evidence could be enough to settle the report.',
        zh: '行为和物理层面的证据，或许就足以判定这份报告是真是假。',
      }, { ontology: -2, epistemology: -1 }),
      directional('b', {
        en: 'No amount of that observation settles whether there is an inner reality. The question is partly about what the concept allows.',
        zh: '无论观察多少，都无法确定它内部是否真有一种主观体验。这个问题有一部分取决于“意识”这个概念本身允许什么。',
      }, { ontology: 1, epistemology: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-05',
    type: 'forced-choice',
    theme: { en: 'Evidence of harm, and a rule', zh: '伤害的证据与一条规则' },
    prompt: {
      en: 'You have strong observational evidence that breaking a standing rule would prevent harm. You do not have an argument that shows the rule permits the exception.',
      zh: '你有很强的观察证据表明，打破一条现行规则可以避免伤害。但你并没有一个论证能说明，这条规则允许这个例外。',
    },
    dimensions: ['epistemology', 'ethics'],
    tags: ['rules', 'evidence'],
    rationale: {
      en: 'The tradeoff asks which shortfall you treat as more serious: a missing argument, or a harm the observations lead you to expect.',
      zh: '这个取舍问的是：你把哪一种欠缺看得更严重——是缺少论证，还是观察让你预感到的伤害。',
    },
    options: [
      directional('a', {
        en: 'Act on the evidence of the outcomes.',
        zh: '根据关于结果的证据去行动。',
      }, { epistemology: -1, ethics: -2 }),
      directional('b', {
        en: 'Do not break the rule until there is a justification that survives reasoned scrutiny.',
        zh: '在有一个经得起理性审视的正当理由之前，不要打破规则。',
      }, { epistemology: 1, ethics: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-06',
    type: 'thought-experiment',
    theme: { en: 'A perfect copy', zh: '一个完美的复制体' },
    prompt: {
      en: 'A device destroys your body and creates a perfect physical and psychological duplicate elsewhere. Derek Parfit discussed teletransportation of this kind in Reasons and Persons (1984), in the chapters on personal identity.',
      zh: '一台装置摧毁了你的身体，并在别处造出一个在生理和心理上都与你一模一样的复制体。德里克·帕菲特在《理与人》（1984）讨论个人同一性的几章里，讨论过这类远距传送。',
    },
    dimensions: ['ontology', 'epistemology'],
    tags: ['identity'],
    rationale: {
      en: 'The case asks what you think settles whether a life continues. It does not have a trick answer.',
      zh: '这个情境问的是：你认为什么才决定了一个人的生命是否延续。它并没有一个设了圈套的答案。',
    },
    references: [
      {
        label: 'Derek Parfit, Reasons and Persons (Oxford University Press, 1984)',
        href: 'https://plato.stanford.edu/entries/identity-personal/',
      },
    ],
    options: [
      directional('a', {
        en: 'The observable continuities are all there is to the question. The duplicate continues the life.',
        zh: '可观察到的连续性就是这个问题的全部。复制体延续了这条生命。',
      }, { ontology: -2, epistemology: -1 }),
      directional('b', {
        en: 'Who survives is not settled by observable continuity alone.',
        zh: '谁活了下来，并不能只靠可观察的连续性来决定。',
      }, { ontology: 2, epistemology: 1 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-07',
    type: 'scenario',
    theme: { en: 'A flood and a farm', zh: '洪水与一座农场' },
    prompt: {
      en: 'A flood plan will save a town only if one farm is taken without the owner’s consent. The owner is not personally to blame for the flood.',
      zh: '一项防洪方案只有征用一座农场才能救下一座城镇，而且征用没有得到农场主的同意。这场洪水并不是农场主个人的过错。',
    },
    dimensions: ['society', 'ethics'],
    tags: ['rights', 'common-good'],
    rationale: {
      en: 'The case puts a common emergency next to one person’s refusal. It is not a prompt about a real town or a party platform.',
      zh: '这个情境把共同的紧急情况，放到一个人的拒绝面前。它不是关于某座真实城镇或某个政党的纲领。',
    },
    options: [
      directional('a', {
        en: 'Take the farm. The town’s survival and the smaller harm decide it.',
        zh: '征用农场。城镇的存续和较小的损害决定了这一点。',
      }, { society: 2, ethics: -2 }),
      directional('b', {
        en: 'Do not take it. The owner’s right forbids the taking even to save the town.',
        zh: '不要征用。即使是为了救城镇，农场主的权利也不允许这样做。',
      }, { society: -2, ethics: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-08',
    type: 'forced-choice',
    theme: { en: 'The wrongness of cruelty', zh: '残忍为什么是错的' },
    prompt: {
      en: 'Is cruelty wrong only because people decide to treat it as wrong?',
      zh: '残忍之所以是错的，仅仅是因为人们决定把它当成错的吗？',
    },
    dimensions: ['meaning', 'ethics'],
    tags: ['objectivity'],
    rationale: {
      en: 'The question separates a discovered wrong from a commitment against cruelty. Neither answer calls the other cruel.',
      zh: '这个问题把“被发现的错误”和“反对残忍的承诺”区分开来。两种回答都没有说对方残忍。',
    },
    options: [
      directional('a', {
        en: 'Cruelty is wrong whether or not anyone decides to call it wrong.',
        zh: '无论有没有人决定把它称为错的，残忍都是错的。',
      }, { meaning: -2, ethics: 1 }),
      directional('b', {
        en: 'Cruelty is wrong because agents commit themselves to a norm against it.',
        zh: '残忍之所以是错的，是因为行动者自己承诺遵守一条反对残忍的规范。',
      }, { meaning: 2, ethics: -1 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-09',
    type: 'thought-experiment',
    theme: { en: 'An observation logic calls impossible', zh: '一个被逻辑判定为不可能的观察' },
    prompt: {
      en: 'You seem to observe something that a logical demonstration says is impossible. The demonstration still looks valid, and the observation still looks careful.',
      zh: '你似乎观察到了某样东西，而一个逻辑证明说这不可能。这个证明看起来依然成立，你的观察看起来也依然仔细。',
    },
    dimensions: ['epistemology', 'ontology'],
    tags: ['necessity', 'observation'],
    rationale: {
      en: 'The case asks which check leads when necessity and observation conflict. It is not a logic exam.',
      zh: '这个情境问的是：当必然性和观察发生冲突时，该以哪一方的检验为准。它不是逻辑考试。',
    },
    options: [
      directional('a', {
        en: 'Trust the observation and revise the claim of impossibility. The world can refuse our demonstrations.',
        zh: '相信观察，修改“不可能”的说法。世界可以不服从我们的证明。',
      }, { epistemology: -2, ontology: -1 }),
      directional('b', {
        en: 'Trust the demonstration and treat the observation as misleading. Reality does not violate a valid necessity.',
        zh: '相信证明，把观察当作误导。现实不会违反一条成立的必然性。',
      }, { epistemology: 2, ontology: 1 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-10',
    type: 'scenario',
    theme: { en: 'A role never chosen', zh: '一个从未选择过的角色' },
    prompt: {
      en: 'Your community expects you to continue a role you never chose. Leaving would be possible. Staying would meet a need the community did not invent yesterday.',
      zh: '你的共同体期望你继续扮演一个你从未选择过的角色。你其实可以离开。如果留下，你满足的是一种由来已久的需要，而不是共同体昨天才编出来的需要。',
    },
    dimensions: ['society', 'agency'],
    tags: ['roles'],
    rationale: {
      en: 'The case asks whether an unchosen role can bind, and whether leaving is a real beginning. It does not praise either loyalty or exit.',
      zh: '这个情境问的是：一个未经选择的角色能否约束人，以及离开是否真的意味着重新开始。它既不赞美忠诚，也不赞美离开。',
    },
    options: [
      directional('a', {
        en: 'You may leave. A life path is yours to set, and the role does not outrank that.',
        zh: '你可以离开。人生道路由你自己决定，这个角色并不能凌驾于此。',
      }, { society: -2, agency: 1 }),
      directional('b', {
        en: 'The role binds you. Your choice already sits inside relationships that shape what you can responsibly do.',
        zh: '这个角色对你有约束力。你的选择本来就处在各种关系之中，而这些关系决定了你能负责任地做什么。',
      }, { society: 2, agency: -1 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-11',
    type: 'forced-choice',
    theme: { en: 'A project and a prohibition', zh: '一个计划与一条禁令' },
    prompt: {
      en: 'A rule forbids an action that would give you a project you deeply want. Following the rule will not give you a different project of equal appeal.',
      zh: '有一条规则禁止你做某件事，而这件事会给你带来一个你非常想要的计划。遵守规则，也不会让你得到另一个同样有吸引力的计划。',
    },
    dimensions: ['meaning', 'ethics'],
    tags: ['projects', 'constraints'],
    rationale: {
      en: 'The tradeoff asks whether a wanted project can override a prohibition. Wanting the project is not treated as a flaw.',
      zh: '这个取舍问的是：一个你渴望的计划能否压过一条禁令。渴望这个计划本身并没有被当成缺点。',
    },
    options: [
      directional('a', {
        en: 'The project’s meaning can override the rule if the life it makes is better.',
        zh: '如果这个计划带来的生活更好，它的意义就可以压过这条规则。',
      }, { meaning: 1, ethics: -2 }),
      directional('b', {
        en: 'The rule can make the project one you should not pursue, even though it feels like your purpose.',
        zh: '即使这个计划让你觉得那就是你的目的，规则仍然可以让它成为你不该追求的东西。',
      }, { meaning: -1, ethics: 2 }),
      uncertain,
    ],
  }),
  item({
    id: 'x-12',
    type: 'thought-experiment',
    theme: { en: 'If physics were complete', zh: '如果物理学已经完备' },
    prompt: {
      en: 'Suppose physics is a complete account of the motions of matter. What follows for consciousness and choice?',
      zh: '假设物理学已经完整地说明了物质的运动。那么，这对意识和选择意味着什么？',
    },
    dimensions: ['ontology', 'agency'],
    tags: ['consciousness', 'determinism'],
    rationale: {
      en: 'The responses separate a fully physical and determined picture from pictures that leave room for choice, for mind, or for both. More than one of those pictures is philosophically serious.',
      zh: '这些回答把一种纯物理、被决定的图景，与另外一些为选择、为心灵或者为两者留出空间的图景区分开来。这几种图景中，不止一种在哲学上是严肃的。',
    },
    options: [
      directional('a', {
        en: 'Consciousness and choice are physical processes, and the choice could not have been otherwise.',
        zh: '意识和选择都是物理过程，而且那个选择本来不可能是别的样子。',
      }, { ontology: -2, agency: -2 }),
      directional('b', {
        en: 'The mind is physical, but a genuine choice is an opening that physics has not already closed.',
        zh: '心灵是物理的，但一个真正的选择，是物理学尚未封死的余地。',
      }, { ontology: -1, agency: 2 }),
      directional('c', {
        en: 'Conscious choice is a reason to think the physical account is not complete.',
        zh: '有意识的选择本身就足以让人认为，物理的说明还不完整。',
      }, { ontology: 2, agency: 1 }),
      uncertain,
    ],
  }),
];
