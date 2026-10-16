import type { Article, GlossaryEntry } from '@/types/model';

export const articles: Article[] = [
  {
    slug: 'what-this-is',
    title: { en: 'What this questionnaire is', zh: '这份问卷是什么' },
    description: {
      en: 'NOEMA is an exploratory philosophical questionnaire. It is not a psychological instrument.',
      zh: 'NOEMA 是一份探索性的哲学问卷。它不是心理测量工具。',
    },
    sections: [
      {
        heading: { en: 'A way of seeing', zh: '一种看的方式' },
        body: {
          en: 'The questionnaire asks how you are inclined to answer a set of old questions: what is real, how you know, what makes an act wrong, whether a choice was open, where meaning comes from, and what persons owe one another. The result is a profile of those answers. It is not a diagnosis, a ranking, or a discovery of a hidden self.',
          zh: '这份问卷问的是你倾向于如何回答一组古老的问题：什么是真实的，你如何知道，是什么使一个行为为错，一个选择是否曾经开放，意义从哪里来，以及人们彼此亏欠什么。结果是这些回答的剖面。它不是诊断，不是排名，也不是对一个隐藏自我的发现。',
        },
      },
      {
        heading: { en: 'What it cannot say', zh: '它不能说什么' },
        body: {
          en: 'It cannot say that you are intelligent, well, employable, or politically located. It cannot say how you compare with other people, because it has no reference population. A six-letter code is a compression of six binary leans. Where the leans are mixed or the answers are thin, the code is provisional or withheld.',
          zh: '它不能说你聪明、健康、适于被雇用，或在政治上位于何处。它不能说你与其他人相比如何，因为它没有参照人群。一个六字母代码是六次二元倾向的压缩。在倾向混合或回答稀薄的地方，代码是暂定的，或被保留不给。',
        },
      },
    ],
  },
  {
    slug: 'how-to-read-an-axis',
    title: { en: 'How to read an axis', zh: '如何阅读一条轴' },
    description: {
      en: 'Zero and one hundred are poles. Fifty is not uncertainty, and it is not wisdom.',
      zh: '零与一百是两极。五十不是不确定，也不是智慧。',
    },
    sections: [
      {
        heading: { en: 'The number', zh: '这个数字' },
        body: {
          en: 'Each axis is a directional index from 0 to 100, computed only from answers that took a side. Skipping a question, or saying you cannot determine it, leaves that question out. It is not entered as 50. Fifty means the directional answers you did give are balanced. It can be a real philosophical position. It can also be a sign that the axis is too coarse.',
          zh: '每一轴是一个从 0 到 100 的方向指数，只由那些选了边的回答计算。跳过一题，或说你无法判断，都会把那一题留在外面。它不会被记成 50。五十意味着你确实给出的方向性回答是平衡的。它可以是一种真实的哲学立场。它也可以表示这条轴太粗。',
        },
      },
      {
        heading: { en: 'The thresholds', zh: '这些阈值' },
        body: {
          en: 'Below 40 is read as the left pole, above 60 as the right pole, and the band between as mixed. These cuts are design assumptions. They are printed so that the classification is inspectable. They are not validated clinical cutoffs, and they should not be treated as if a study had justified them.',
          zh: '低于 40 被读作左极，高于 60 被读作右极，其间的带子被读作混合。这些切分是设计上的假定。把它们印出来，是为了使分类可以被检查。它们不是经过验证的临床切点，也不应当被当成仿佛已有研究证成了它们。',
        },
      },
    ],
  },
  {
    slug: 'compatibilism',
    title: { en: 'Why compatibilism is missing from the line', zh: '为什么相容论不在这条线上' },
    description: {
      en: 'The agency axis cannot place compatibilism between determinism and libertarian free will.',
      zh: '能动性之轴不能把相容论放在决定论与自由意志论之间。',
    },
    sections: [
      {
        heading: { en: 'A third position', zh: '第三种立场' },
        body: {
          en: 'Compatibilists hold that a person can be responsible even if the past and the laws settle what they do, because responsibility tracks the quality of the will rather than an uncaused power. That view denies an assumption shared by the two poles. Putting it at 50 would pretend that “sometimes determined” is the same idea.',
          zh: '相容论者认为，即使过去与法则决定了一个人做什么，这个人仍然可以负有责任，因为责任追踪的是意志的性质，而不是一种无因的能力。这一看法否定两极共同的一个假定。把它放在 50，就是假装“有时被决定”是同一个想法。',
        },
      },
      {
        heading: { en: 'How an answer is kept', zh: '一个回答如何被保留' },
        body: {
          en: 'Where the questionnaire offers a compatibilist description, choosing it is stored and reported. It does not move the agency index. If you choose it, the result says so in words. The absence of a letter for compatibilism is a limitation of the model, stated on purpose.',
          zh: '在问卷提供相容论描述的地方，选择它会被存储并报告。它不推动能动性指数。如果你选择了它，结果会用文字说明。相容论没有字母，是这个模型的限度，并且是有意陈述的。',
        },
      },
    ],
  },
  {
    slug: 'virtue-and-other-ethics',
    title: { en: 'Virtue and the other ethics', zh: '德性与其他伦理' },
    description: {
      en: 'The moral axis is a line between outcomes and constraints. It leaves virtue ethics, care, and role ethics off the line.',
      zh: '道德之轴是结果与约束之间的一条线。它把德性伦理、关怀伦理和角色伦理留在线外。',
    },
    sections: [
      {
        heading: { en: 'What the line asks', zh: '这条线问什么' },
        body: {
          en: 'Some of the questions ask whether a better outcome can justify breaking a rule, a promise, or a right. That is a real dispute. It is not the whole of moral philosophy. Aristotle asks what a good person discerns. Confucius and Mencius ask how a person is formed in relationships. Those questions can cut across the line.',
          zh: '有些问题问一个更好的结果能否证成打破一条规则、一个承诺或一项权利。这是一场真实的争论。它不是道德哲学的全部。亚里士多德问一个好人辨认什么。孔子与孟子问一个人如何在关系中被形成。那些问题可以横切这条线。',
        },
      },
      {
        heading: { en: 'A mixed score', zh: '一个混合的分数' },
        body: {
          en: 'If your moral index sits between the poles, do not read it as “virtue.” Read it as the statement the page actually makes: the directional answers did not settle. The atlas is where the other traditions are described without being forced into a letter.',
          zh: '如果你的道德指数落在两极之间，不要把它读成“德性”。把它读成页面实际说出的那句话：方向性回答没有落定。图谱是其他传统被描述、而不被强行放进一个字母的地方。',
        },
      },
    ],
  },
  {
    slug: 'meaning-and-nihilism',
    title: { en: 'Meaning is not a slide into nihilism', zh: '意义并不是滑向虚无主义' },
    description: {
      en: 'Creating meaning is a positive claim. The absence of a cosmic purpose is not yet the claim that nothing matters.',
      zh: '创造意义是一个肯定性的主张。宇宙目的的缺席还不是“没有什么重要”这一主张。',
    },
    sections: [
      {
        heading: { en: 'Three different sentences', zh: '三句不同的话' },
        body: {
          en: '“There are purposes worth finding.” “People can give a life weight by what they sustain.” “If the universe has no purpose, a life is not meaningful.” The questionnaire keeps these apart. Only the first two move the meaning index. The third is reported as its own position.',
          zh: '“有值得发现的目的。”“人们可以通过他们所维持的东西给予一种生活以分量。”“如果宇宙没有目的，一种生活就没有意义。”问卷把这些分开。只有前两句推动意义指数。第三句被报告为其自身的立场。',
        },
      },
      {
        heading: { en: 'Camus is not a type', zh: '加缪不是一个类型' },
        body: {
          en: 'The Myth of Sisyphus is a relevant book because it refuses an easy ending. It is not the owner of a NOEMA letter, and a result that leans toward creation is not a finding that you are an existentialist.',
          zh: '《西西弗神话》是一本相关的书，因为它拒绝一个轻易的结尾。它不是某个 NOEMA 字母的所有者，而一个偏向创造的结果也不是“你是存在主义者”的发现。',
        },
      },
    ],
  },
  {
    slug: 'limits-of-the-model',
    title: { en: 'Limits of the model', zh: '模型的限度' },
    description: {
      en: 'Six axes, two poles each, and a family map are editorial devices. They omit more than they contain.',
      zh: '六条轴、每条两个极，以及一张家族地图，都是编辑装置。它们省略的比它们包含的更多。',
    },
    sections: [
      {
        heading: { en: 'Compression', zh: '压缩' },
        body: {
          en: 'A binary code is useful because it can be listed, shared, and compared. It is costly because most philosophical positions are not binary. The pages for compatibilism, virtue, Madhyamaka, and Daoist philosophy exist to show some of what the code cannot say. A provisional code is a warning, not a softer certainty.',
          zh: '二元代码有用，是因为它可以被列举、分享和比较。它的代价是：大多数哲学立场并不是二元的。关于相容论、德性、中观和道家哲学的页面，是为了展示代码所不能说的一部分。暂定的代码是一个警告，不是一种更软的确定。',
        },
      },
      {
        heading: { en: 'No norms', zh: '没有常模' },
        body: {
          en: 'There is no claim that a score is rare, common, mature, or stable over time. A later study could test the items. Until then, the honest report is the report of your answers under stated rules.',
          zh: '这里并不主张一个分数是罕见的、常见的、成熟的，或在时间中稳定的。以后的研究可以检验这些题目。在那之前，诚实的报告就是：在已陈述的规则之下，对你的回答的报告。',
        },
      },
    ],
  },
];

export const glossary: GlossaryEntry[] = [
  { id: 'physicalism', term: { en: 'Physicalism', zh: '物理主义' }, definition: { en: 'The inclination to treat the physical as the basic account of what exists.', zh: '把物理的东西当作关于存在之物的基本说明的倾向。' } },
  { id: 'idealism', term: { en: 'Idealism', zh: '观念论' }, definition: { en: 'The inclination to treat mind, experience, or an ideal order as basic. Not a synonym for spirituality.', zh: '把心灵、经验或理想秩序当作基本之物的倾向。不是灵性的同义词。' } },
  { id: 'empiricism', term: { en: 'Empiricism', zh: '经验论' }, definition: { en: 'The inclination to give observation the leading role in knowledge of the world.', zh: '在关于世界的知识中给予观察以领头角色的倾向。' } },
  { id: 'rationalism', term: { en: 'Rationalism', zh: '理性论' }, definition: { en: 'The inclination to treat reasoning as able to reach truths observation does not first deliver.', zh: '把推理看作能够触及观察并未首先交付的真理的倾向。' } },
  { id: 'consequentialism', term: { en: 'Consequentialism', zh: '后果论' }, definition: { en: 'The inclination to make rightness depend primarily on outcomes.', zh: '使正当性主要依赖于结果的倾向。' } },
  { id: 'deontology', term: { en: 'Deontology', zh: '义务论' }, definition: { en: 'The inclination to hold that some acts are wrong even when their outcomes are better.', zh: '认为有些行为即使结果更好也仍然是错的倾向。' } },
  { id: 'determinism', term: { en: 'Determinism', zh: '决定论' }, definition: { en: 'The claim that the past and the laws settle what a person will choose.', zh: '过去与法则决定一个人将如何选择的主张。' } },
  { id: 'libertarian', term: { en: 'Libertarian free will', zh: '自由意志论' }, definition: { en: 'The metaphysical claim that a genuine choice was not already settled. Not a political position.', zh: '一个真正的选择并未预先被决定的形而上学主张。不是政治立场。' } },
  { id: 'compatibilism', term: { en: 'Compatibilism', zh: '相容论' }, definition: { en: 'The view that responsibility does not require an unsettled will. It is not the midpoint of the agency axis.', zh: '责任并不需要一个尚未被决定的意志的看法。它不是能动性之轴的中点。' } },
  { id: 'discovery', term: { en: 'Discovery', zh: '发现' }, definition: { en: 'The inclination to treat meaning as answerable to worth the person did not invent.', zh: '把意义看作对这个人并未发明的价值之回应的倾向。' } },
  { id: 'creation', term: { en: 'Creation', zh: '创造' }, definition: { en: 'The inclination to treat commitment as able to give a life weight. Not nihilism.', zh: '把承诺看作能够给予一种生活以分量的倾向。不是虚无主义。' } },
  { id: 'individual', term: { en: 'Individual priority', zh: '个人优先' }, definition: { en: 'The inclination to treat the person as a limit on the group. Not a party.', zh: '把个人当作群体之界限的倾向。不是政党。' } },
  { id: 'communal', term: { en: 'Communal priority', zh: '共同体优先' }, definition: { en: 'The inclination to treat membership as a source of duties. Not a party.', zh: '把成员身份当作义务来源的倾向。不是政党。' } },
  { id: 'archetype', term: { en: 'Archetype', zh: '哲学原型' }, definition: { en: 'An editorial name for one of the 64 pole combinations. Not a personality type.', zh: '六十四种极的组合之一的编辑名称。不是人格类型。' } },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
