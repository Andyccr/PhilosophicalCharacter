import type { DimensionDefinition } from '@/types/model';

export const dimensionList: DimensionDefinition[] = [
  {
    id: 'ontology',
    plainName: { en: 'Reality', zh: '实在' },
    technicalName: { en: 'Ontology', zh: '本体论' },
    leftLetter: 'M',
    rightLetter: 'I',
    leftPole: { en: 'Physicalism', zh: '物理主义' },
    rightPole: { en: 'Idealism', zh: '观念论' },
    question: {
      en: 'What has to be true of the world for a description of it to be finished?',
      zh: '一份关于世界的描述要算完成，世界必须是什么样的？',
    },
    summary: {
      en: 'This axis records a stated inclination about the fundamental character of reality. The left pole treats the physical as basic. The right pole treats mind, experience, or an ideal order as basic. Spirituality is not a synonym for the right pole.',
      zh: '这一轴记录的是关于实在之根本性格的一种陈述倾向。左极把物理的东西当作基本的。右极把心灵、经验或一种理想秩序当作基本的。灵性不是右极的同义词。',
    },
    leftEssay: {
      en: 'Physicalism, as scored here, is the inclination to say that what exists is physical, or depends on the physical in a way that leaves no second kind of substance. A person can hold this and still think consciousness is difficult. The score does not say they have solved that difficulty.',
      zh: '这里所计的物理主义，是这样一种倾向：存在之物是物理的，或以一种并不留下第二种实体的方式依赖于物理的东西。一个人可以持有这一点，同时仍然认为意识是困难的。分数并不表示他们已经解决了这一困难。',
    },
    rightEssay: {
      en: 'Idealism, as scored here, is the inclination to deny that a physical inventory is the whole of what is fundamental. Berkeley’s immaterialism is one historical form. It is not the only one, and the pole is not a measure of religious belief.',
      zh: '这里所计的观念论，是这样一种倾向：否认物理清单就是根本之物的全部。贝克莱的非物质论是一种历史形态。它不是唯一的形态，而这一极也不是宗教信仰的度量。',
    },
    mixedEssay: {
      en: 'A mixed result on this axis means your directional answers do not settle on one pole, or they pull against each other. That can be caution. It can also be a sign that the question is coarser than your view. The midpoint is not automatically “neutral monism.”',
      zh: '这一轴上的混合结果意味着：你的方向性回答没有落在一极，或者它们彼此拉扯。这可以是审慎。它也可以表示这个问题比你的看法更粗。中点并不会自动成为“中立一元论”。',
    },
    notThis: [
      { en: 'It does not measure intelligence or scientific literacy.', zh: '它不测量智力或科学素养。' },
      { en: 'It does not classify religious belonging.', zh: '它不给宗教归属分类。' },
      { en: 'A low score is not a failure to appreciate art, moral life, or meaning.', zh: '低分并不是对艺术、道德生活或意义缺乏欣赏。' },
    ],
    relatedTraditionSlugs: ['physicalism', 'idealism', 'madhyamaka'],
    relatedPhilosopherSlugs: ['nagel', 'descartes', 'nagarjuna'],
  },
  {
    id: 'epistemology',
    plainName: { en: 'Knowledge', zh: '知识' },
    technicalName: { en: 'Epistemology', zh: '知识论' },
    leftLetter: 'E',
    rightLetter: 'R',
    leftPole: { en: 'Empiricism', zh: '经验论' },
    rightPole: { en: 'Rationalism', zh: '理性论' },
    question: {
      en: 'When observation and reasoning pull apart, which one do you let lead?',
      zh: '当观察与推理拉开时，你让哪一个领头？',
    },
    summary: {
      en: 'This axis is about sources of justification, not about a forced choice between evidence and logic. Both can matter. The score records which one you treat as more authoritative when they conflict or when a starting point has to be chosen.',
      zh: '这一轴关乎证成的来源，而不是在证据与逻辑之间作被迫的单选。二者都可以重要。分数记录的是：当它们冲突，或必须选择一个起点时，你把哪一个视为更有权威。',
    },
    leftEssay: {
      en: 'The empiricist inclination gives observation the power to revise a theory. It does not say that reasoning is decoration. Hume is a central reference, with the caution that his empiricism is not a slogan about “trusting science” in the twenty-first-century sense.',
      zh: '经验论倾向把修改理论的力量交给观察。它并不说推理是装饰。休谟是一个核心参照，但要小心：他的经验论并不是二十一世纪意义上“信任科学”的口号。',
    },
    rightEssay: {
      en: 'The rationalist inclination gives reasoning a power to reach truths that a particular observation does not first deliver. Descartes is a central reference. Kant is related and also a warning: he limits what theoretical reason can know about the world.',
      zh: '理性论倾向给予推理一种力量，去触及特定观察并未首先交付的真理。笛卡尔是一个核心参照。康德既相关，也是一个警告：他限制了理论理性能够认识世界的范围。',
    },
    mixedEssay: {
      en: 'A mixed result means you do not grant either source a standing victory. That is a familiar philosophical position, not an error and not a midpoint called “skepticism” unless your answers also withhold judgment.',
      zh: '混合结果意味着你并不把常胜授予任何一种来源。这是一种熟悉的哲学立场，不是错误，也不是一个名叫“怀疑论”的中点，除非你的回答同时还拒绝判断。',
    },
    notThis: [
      { en: 'It does not measure mathematical ability.', zh: '它不测量数学能力。' },
      { en: 'It does not say that scientists are empiricists and philosophers are rationalists.', zh: '它并不说科学家是经验论者、哲学家是理性论者。' },
    ],
    relatedTraditionSlugs: ['empiricism', 'rationalism'],
    relatedPhilosopherSlugs: ['hume', 'locke', 'descartes', 'kant'],
  },
  {
    id: 'ethics',
    plainName: { en: 'Morality', zh: '道德' },
    technicalName: { en: 'Ethics', zh: '伦理学' },
    leftLetter: 'C',
    rightLetter: 'D',
    leftPole: { en: 'Consequentialism', zh: '后果论' },
    rightPole: { en: 'Deontology', zh: '义务论' },
    question: {
      en: 'When a constraint and a better outcome conflict, which one gives way?',
      zh: '当一条约束与一个更好的结果冲突时，哪一个退让？',
    },
    summary: {
      en: 'This axis sets outcomes against constraints such as duties and rights. Virtue ethics is a major alternative and is not the midpoint. The score is not a verdict on whether you are kind.',
      zh: '这一轴把结果与义务、权利之类的约束相对。德性伦理是一种主要的替代，而不是中点。分数不是对你是否善良的裁决。',
    },
    leftEssay: {
      en: 'The consequentialist inclination makes rightness depend primarily on what an act brings about. Mill’s utilitarianism is one developed form. It can still defend rules, if the rules are justified by the outcomes of having them.',
      zh: '后果论倾向使正当性主要依赖于一个行为带来什么。密尔的功利主义是一种发展了的形态。它仍然可以保卫规则，如果规则是由拥有它们的结果来证成的。',
    },
    rightEssay: {
      en: 'The deontological inclination holds that some acts are wrong even when their results are better. Kant’s duty is the usual reference, and it is stricter and more systematic than a feeling that some things are “just wrong.”',
      zh: '义务论倾向认为，有些行为即使结果更好也是错的。康德的义务是通常的参照，而且它比“有些事就是错的”这种感觉更严格、更成体系。',
    },
    mixedEssay: {
      en: 'A mixed result often means you treat some constraints as real and some outcomes as decisive, depending on the case. That can be a moral view. It is not automatically virtue ethics, which asks what a good person would do and what a good life is.',
      zh: '混合结果常常意味着：依情形而定，你把某些约束当作真实的，把某些结果当作决定性的。这可以是一种道德看法。它并不自动就是德性伦理。德性伦理问的是一个好人会做什么，以及一种好生活是什么。',
    },
    notThis: [
      { en: 'It does not sort people into kind and cruel.', zh: '它不把人分成善良与残忍。' },
      { en: 'It does not include virtue, care, or Confucian role ethics as scored poles.', zh: '它并不把德性、关怀或儒家角色伦理当作被计分的两极。' },
    ],
    relatedTraditionSlugs: ['consequentialism', 'deontology', 'virtue-ethics', 'mohism'],
    relatedPhilosopherSlugs: ['mill', 'kant', 'aristotle', 'mozi', 'rawls'],
  },
  {
    id: 'agency',
    plainName: { en: 'Freedom', zh: '自由与因果' },
    technicalName: { en: 'Agency', zh: '能动性' },
    leftLetter: 'D',
    rightLetter: 'L',
    leftPole: { en: 'Determinism', zh: '决定论' },
    rightPole: { en: 'Libertarian free will', zh: '自由意志论' },
    question: {
      en: 'Was there an open alternative at the moment of choice, or only the appearance of one?',
      zh: '在选择的时刻，是否有一种开放的替代可能，还是只有替代可能的表象？',
    },
    summary: {
      en: 'The left pole says the past and the laws settle the choice. The right pole says a genuine decision is not settled until the person settles it. Compatibilism — the view that responsibility does not require that kind of open alternative — is not a midpoint and is not given a letter.',
      zh: '左极认为过去与法则决定了选择。右极认为一个真正的决定在这个人决定它之前并未被决定。相容论——即责任并不需要那种开放的替代可能——不是中点，也没有被给予一个字母。',
    },
    leftEssay: {
      en: 'Determinism here is a claim about choice, not a mood of fatalism. A person can think choices are fixed by prior causes and still ask what institutions, education, and reasons can change. The questionnaire does not convert that claim into “no one is responsible” unless an answer says so.',
      zh: '这里的决定论是关于选择的主张，不是一种宿命的情绪。一个人可以认为选择被先前的原因固定，同时仍然追问制度、教育与理由能够改变什么。除非某个回答如此说，问卷并不把这一主张换成“没有人负有责任”。',
    },
    rightEssay: {
      en: 'Libertarian free will, in the metaphysical sense used here, is not a political position. It says that more than one act was open and that nothing already settled which one would be taken. Political “libertarianism” is a different idea and is not what the letter L records.',
      zh: '这里所使用的形而上学意义上的自由意志论，不是一种政治立场。它说的是：不止一个行为曾经开放，而且没有任何已经确定的东西规定将采取哪一个。政治上的“自由至上主义”是另一个想法，并不是字母 L 所记录的。',
    },
    mixedEssay: {
      en: 'A mixed result may mean the cases pulled you in different directions. If you chose a compatibilist answer where one was offered, that answer is reported separately and was not averaged into 50.',
      zh: '混合结果可能意味着不同情境把你拉向不同方向。如果在提供了相容论回答的地方你选择了它，那个回答会被单独报告，并且没有被平均成 50。',
    },
    notThis: [
      { en: 'It does not measure self-control or political freedom.', zh: '它不测量自制或政治自由。' },
      { en: 'Compatibilism is acknowledged and then left off the line.', zh: '相容论被承认，然后被留在这条线之外。',
      },
    ],
    relatedTraditionSlugs: ['determinism', 'libertarian-freedom', 'compatibilism', 'daoist-philosophy'],
    relatedPhilosopherSlugs: ['hume', 'kant', 'sartre', 'zhuangzi', 'nagel'],
  },
  {
    id: 'meaning',
    plainName: { en: 'Meaning', zh: '意义' },
    technicalName: { en: 'Meaning', zh: '意义问题' },
    leftLetter: 'F',
    rightLetter: 'C',
    leftPole: { en: 'Discovery', zh: '发现' },
    rightPole: { en: 'Creation', zh: '创造' },
    question: {
      en: 'Is the point of a life found, or instituted by commitment?',
      zh: '一种生活的要旨是被发现的，还是由承诺所确立的？',
    },
    summary: {
      en: 'The left pole treats meaning as answerable to values or purposes that are not merely chosen. The right pole treats meaning as something conferred by projects and loyalties a person or a community sustains. Creation is not nihilism. A separate answer records the view that, without a cosmic purpose, meaning does not get a foothold.',
      zh: '左极把意义看作对并非仅仅被选择的价值或目的的回应。右极把意义看作由一个人或一个共同体所维持的计划与忠诚所赋予的东西。创造不是虚无主义。另有一个单独的回答记录这种看法：如果没有宇宙目的，意义就无处立足。',
    },
    leftEssay: {
      en: 'Discovery does not require a cosmic plan written in advance. It requires that some things are worth living for whether or not one has decided to value them. Aristotle’s account of a life that goes well is one traditional place this thought appears, and it is not a religious test.',
      zh: '发现并不要求一份预先写好的宇宙计划。它要求：有些事情值得为之生活，无论一个人是否已经决定去珍视它们。亚里士多德关于一种过得好的生活的说明，是这一想法出现的一个传统地点，而且它不是宗教测验。',
    },
    rightEssay: {
      en: 'Creation says that commitment can give a life weight even when the universe has no purpose of its own. Sartre’s 1946 lecture is a famous and simplified statement of a related view. Camus is nearby and should not be flattened into the same sentence: the absurd, for him, is not an instruction to invent a private meaning and stop.',
      zh: '创造是说：即使宇宙自身没有目的，承诺也可以给予一种生活以分量。萨特 1946 年的讲演是一种相关看法的著名而简化的陈述。加缪在附近，但不应被压成同一句话：对他而言，荒诞并不是一条“发明一种私人意义然后停止”的指令。',
    },
    mixedEssay: {
      en: 'A mixed result can mean you think some values are found and some projects are genuinely authored. The questionnaire will not rename that combination as balance, health, or maturity.',
      zh: '混合结果可以意味着：你认为有些价值是被发现的，有些计划是真正被撰写的。问卷不会把这一组合重新命名为平衡、健康或成熟。',
    },
    notThis: [
      { en: 'It does not diagnose depression, despair, or purpose in life as a clinical construct.', zh: '它不诊断抑郁、绝望，也不把人生目的当作临床构念。' },
      { en: 'Creating meaning is not scored as nihilism.', zh: '创造意义不会被计成虚无主义。' },
    ],
    relatedTraditionSlugs: ['discovered-meaning', 'existentialism'],
    relatedPhilosopherSlugs: ['aristotle', 'camus', 'sartre', 'beauvoir', 'kierkegaard', 'nietzsche'],
  },
  {
    id: 'society',
    plainName: { en: 'Social life', zh: '共同生活' },
    technicalName: { en: 'Society', zh: '社会哲学' },
    leftLetter: 'I',
    rightLetter: 'C',
    leftPole: { en: 'Individual priority', zh: '个人优先' },
    rightPole: { en: 'Communal priority', zh: '共同体优先' },
    question: {
      en: 'When a person’s refusal and a community’s need conflict, which one limits the other?',
      zh: '当一个人的拒绝与一个共同体的需要冲突时，哪一个限制另一个？',
    },
    summary: {
      en: 'The left pole treats the person as a limit on what the group may do. The right pole treats membership as a source of duties that can outweigh a preference to be left alone. The axis does not infer a political party, a nation, or an ideology.',
      zh: '左极把个人当作群体可以做什么的界限。右极把成员身份当作义务的来源，这些义务可以压过“希望被放开”的偏好。这一轴不推断政党、民族或意识形态。',
    },
    leftEssay: {
      en: 'Individual priority, here, is a claim about legitimate demands. Mill’s liberty and Nozick’s constraints are different arguments for a related limit. The score does not say which argument you accept, and it does not place you on a left-right political spectrum.',
      zh: '这里的个人优先，是关于正当要求的主张。密尔的自由与诺齐克的约束，是为一种相关界限所作的不同论证。分数并不说你接受哪一种论证，也不把你放在政治上的左右光谱里。',
    },
    rightEssay: {
      en: 'Communal priority is the claim that belonging can generate obligations the person did not individually design. Confucian traditions are one place this thought is worked out in detail. They are not a Western communitarian theory in disguise, and the pole is not a measure of conformity.',
      zh: '共同体优先是这样一个主张：归属可以产生并非个人单独设计的义务。儒家传统是这一想法被详细展开的一个地方。它们不是伪装的西方共同体主义理论，而这一极也不是从众的度量。',
    },
    mixedEssay: {
      en: 'A mixed result is easy to reach, because many people affirm both a protection against being used and a duty that comes with a shared life. The axis records the split instead of forcing a partisan label.',
      zh: '混合结果很容易出现，因为许多人既肯定一种反对被利用的保护，也肯定一种来自共同生活的义务。这一轴记下分裂，而不是强加一个党派标签。',
    },
    notThis: [
      { en: 'It does not identify party, nationality, or voting behavior.', zh: '它不识别党派、国籍或投票行为。' },
      { en: 'Neither pole is scored as more generous.', zh: '两极都不会被计成更慷慨。' },
    ],
    relatedTraditionSlugs: ['liberal-individualism', 'communal-thought', 'confucianism'],
    relatedPhilosopherSlugs: ['mill', 'rawls', 'confucius', 'arendt', 'aristotle'],
  },
];

export const dimensions = Object.fromEntries(dimensionList.map((dimension) => [dimension.id, dimension])) as Record<
  DimensionDefinition['id'],
  DimensionDefinition
>;
