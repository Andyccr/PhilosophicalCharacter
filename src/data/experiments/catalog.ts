import type { ThoughtExperiment } from '@/types/model';

export const experiments: ThoughtExperiment[] = [
  {
    slug: 'experience-machine',
    title: { en: 'The experience machine', zh: '体验机' },
    attribution: { en: 'Robert Nozick, Anarchy, State, and Utopia (1974), the section “The Experience Machine.”', zh: '罗伯特·诺齐克，《无政府、国家与乌托邦》（1974），“体验机”一节。' },
    summary: { en: 'A machine offers any felt life you choose, while you are not actually living it.', zh: '一台机器提供任何你选择的感受生活，而你并没有实际在过它。' },
    essay: [
      { en: 'Nozick asks you to imagine a machine that stimulates the brain so that you think and feel you are writing, or meeting a friend, or reading, while you float in a tank. He uses the case against the idea that only the felt quality of experience matters for how well a life goes. He suggests that we also care about doing things, about being a certain sort of person, and about contact with a reality deeper than a constructed sequence of feelings.', zh: '诺齐克请你想象一台机器刺激大脑，使你以为并感觉自己正在写作、会见朋友或阅读，而你其实漂在一只槽中。他用这个案例反对这样一种想法：对一种生活过得好不好，只有经验的感受性质才重要。他提出，我们还在乎去做事情，在乎成为某一种人，以及与一种比被构造的感受序列更深的实在相接触。' },
      { en: 'The case is not a proof. A reader can enter the machine and then say what they think Nozick has missed. NOEMA’s question uses an original wording and does not tell you his conclusion before you answer. Refusing the machine is not, on this site, a better personality.', zh: '这个案例不是一个证明。读者可以进入机器，然后说明他们认为诺齐克错过了什么。NOEMA 的问题使用原创表述，并且不在你回答之前告诉你他的结论。在本站，拒绝机器并不是一种更好的人格。' },
    ],
    dimensions: ['meaning', 'ontology'],
    questionIds: ['x-01'],
    references: [{ label: 'Stanford Encyclopedia of Philosophy, “Robert Nozick”', href: 'https://plato.stanford.edu/entries/nozick-political/' }],
  },
  {
    slug: 'runaway-tram',
    title: { en: 'The runaway tram', zh: '失控的电车' },
    attribution: { en: 'Philippa Foot, “The Problem of Abortion and the Doctrine of the Double Effect,” Oxford Review (1967); later reworked by Judith Jarvis Thomson.', zh: '菲莉帕·福特，《堕胎问题与双重效应学说》，《牛津评论》（1967）；后来由朱迪丝·贾维斯·汤姆森改写。' },
    summary: { en: 'A tram will kill five people unless it is diverted onto a track where it will kill one.', zh: '一辆电车将撞死五个人，除非它被转到一条会撞死一个人的轨道上。' },
    essay: [
      { en: 'Foot’s 1967 paper discusses a driver who can steer a runaway tram from five people onto one. She is interested in the doctrine of double effect and in the difference between negative and positive rights, not in inventing a party game. Thomson later changes the picture to a bystander at a switch and argues that the problem is harder than Foot’s contrast. “The Trolley Problem” in The Yale Law Journal (1985) is Thomson’s later statement.', zh: '福特 1967 年的论文讨论一个司机可以把失控的电车从五个人转向一个人。她关心的是双重效应学说，以及消极权利与积极权利的差别，而不是发明一种派对游戏。汤姆森后来把图景改成道岔旁的旁观者，并主张问题比福特的对照更难。《电车难题》发表于《耶鲁法律杂志》（1985），是汤姆森后来的陈述。' },
      { en: 'NOEMA asks the question without reporting either philosopher’s verdict on the page where you answer. Both diverting and refusing are treated as intelligible. The case does not measure nerve or intelligence.', zh: 'NOEMA 在你作答的页面上提问，而不报告两位哲学家的裁决。转向与拒绝都被当作可理解的。这个案例不测量胆量或智力。' },
    ],
    dimensions: ['ethics'],
    questionIds: ['eth-03'],
    references: [{ label: 'Stanford Encyclopedia of Philosophy, “Philippa Foot”', href: 'https://plato.stanford.edu/entries/philippa-foot/' }],
  },
  {
    slug: 'transplant',
    title: { en: 'The transplant', zh: '移植' },
    attribution: { en: 'Judith Jarvis Thomson, “Killing, Letting Die, and the Trolley Problem,” The Monist (1976), as a contrast with the tram.', zh: '朱迪丝·贾维斯·汤姆森，《杀戮、放任死亡与电车难题》，《一元论者》（1976），用作与电车的对照。' },
    summary: { en: 'Five patients can be saved only by taking the organs of one healthy person who did not consent.', zh: '五位病人只有在取走一个并未同意的健康人的器官时才能被救活。' },
    essay: [
      { en: 'The transplant case is used because many people who would divert the tram would not harvest the organs. If both are “one death against five,” the difference has to be stated. Thomson’s discussion is part of that effort. The difference might be about rights, about using a person, about doing and allowing, or about something the numbers do not capture.', zh: '使用移植案例，是因为许多愿意让电车转向的人并不愿意摘取器官。如果二者都是“一死对五死”，差别就必须被说出来。汤姆森的讨论是这一努力的一部分。差别可能关乎权利，关乎使用一个人，关乎作为与放任，或关乎数字所不能捕获的某种东西。' },
      { en: 'On this site the case bears on both the moral axis and the social axis, because it is at once a question about outcomes and a question about whether one person is a limit. It is not a prompt for medical advice.', zh: '在本站，这个案例同时压在道德之轴与社会之轴上，因为它既是关于结果的问题，也是关于一个人是否构成界限的问题。它不是医疗建议的提示。' },
    ],
    dimensions: ['ethics', 'society'],
    questionIds: ['x-02'],
    references: [{ label: 'Stanford Encyclopedia of Philosophy, “Doing vs. Allowing Harm”', href: 'https://plato.stanford.edu/entries/doing-allowing/' }],
  },
  {
    slug: 'predicting-a-choice',
    title: { en: 'Predicting a choice', zh: '预测一个选择' },
    attribution: { en: 'Related to Pierre-Simon Laplace’s image of a complete prediction in A Philosophical Essay on Probabilities (1814). This is not Newcomb’s problem.', zh: '与皮埃尔-西蒙·拉普拉斯在《概率的哲学随笔》（1814）中关于完整预测的意象有关。这不是纽科姆难题。' },
    summary: { en: 'A predictor that has never been wrong names your choice before you make it.', zh: '一个从未错过的预测者在你作出选择之前说出你的选择。' },
    essay: [
      { en: 'Laplace imagined an intelligence that, knowing the forces and the positions of everything, would see past and future as one formula. The questionnaire’s case is a small and human version: a predictor tells you what you will choose. If the prediction can be settled in advance, the choice looks fixed. If it cannot, something about the choice is not yet a fact.', zh: '拉普拉斯想象一种理智：它若知道一切的力与位置，就会把过去与未来看成一个公式。问卷中的案例是一个小而属于人的版本：一个预测者告诉你你将如何选择。如果预测可以预先确定，选择看起来就是被固定的。如果不能，选择之中就有某种东西还不是事实。' },
      { en: 'Newcomb’s problem adds a box, a reward, and a decision theory dispute. Those are not this question. Compatibilists can say a prediction is compatible with responsibility. That reply is available elsewhere in the questionnaire and is not scored as the middle of the line.', zh: '纽科姆难题加上了盒子、奖赏，以及一场决策论争论。那些不是这个问题。相容论者可以说预测与责任相容。这一回应在问卷的别处可以出现，并且不被计成这条线的中间。' },
    ],
    dimensions: ['agency'],
    questionIds: ['age-03'],
    references: [{ label: 'Stanford Encyclopedia of Philosophy, “Causal Determinism”', href: 'https://plato.stanford.edu/entries/determinism-causal/' }],
  },
  {
    slug: 'perfect-copy',
    title: { en: 'The perfect copy', zh: '完美的复制' },
    attribution: { en: 'Derek Parfit, Reasons and Persons (Oxford University Press, 1984), the discussion of teletransportation in the chapters on personal identity.', zh: '德里克·帕菲特，《理与人》（牛津大学出版社，1984），在讨论个人同一性的章节中对远距传输的讨论。' },
    summary: { en: 'Your body is destroyed and a perfect physical and psychological duplicate is made elsewhere.', zh: '你的身体被摧毁，一个物理与心理上都完美的复制体在别处被造出。' },
    essay: [
      { en: 'Parfit uses teletransportation to ask whether identity is what matters in survival, or whether psychological continuity matters even if strict identity fails. The questionnaire does not reproduce his argument or his conclusion. It asks whether you think observable continuity settles the question of who continues.', zh: '帕菲特用远距传输来问：在存活中重要的是同一性，还是即使严格的同一性失败，心理连续性仍然重要。问卷并不复述他的论证或结论。它问的是：你是否认为可观察的连续性决定了谁在继续。' },
      { en: 'The case sits on the reality axis and the knowledge axis because it asks both what a person is and what kind of evidence would show it. There is no clever answer.', zh: '这个案例落在实在之轴与知识之轴上，因为它既问一个人是什么，也问什么样的证据能够表明这一点。没有一个机巧的答案。' },
    ],
    dimensions: ['ontology', 'epistemology'],
    questionIds: ['x-06'],
    references: [{ label: 'Stanford Encyclopedia of Philosophy, “Personal Identity”', href: 'https://plato.stanford.edu/entries/identity-personal/' }],
  },
  {
    slug: 'purposeless-universe',
    title: { en: 'A universe without a purpose', zh: '没有目的的宇宙' },
    attribution: { en: 'Associated with Albert Camus, The Myth of Sisyphus (1942). The questionnaire’s options are original.', zh: '与阿尔贝·加缪的《西西弗神话》（1942）有关。问卷的选项是原创的。' },
    summary: { en: 'The universe has no purpose of its own. The question is what follows for the meaning of a life.', zh: '宇宙自身没有目的。问题是这对一种生活的意义意味着什么。' },
    essay: [
      { en: 'Camus describes the absurd as a confrontation, not as a doctrine that nothing is worth doing. The questionnaire separates three responses: meaning can still be found in values that do not need a cosmic purpose; meaning is created by sustained projects; or, without a cosmic purpose, meaning does not get a foothold. The third response is recorded and not forced onto the creation pole.', zh: '加缪把荒诞描述为一种对峙，而不是一种“没有什么值得做”的学说。问卷分开三种回应：意义仍然可以在并不需要宇宙目的的价值中被发现；意义由持续的计划所创造；或者，如果没有宇宙目的，意义就无处立足。第三种回应被记下，并且不被强行放上创造一极。' },
      { en: 'Creation is not nihilism. Discovery does not require a providential plan. The page exists to keep those distinctions visible.', zh: '创造不是虚无主义。发现并不要求一份天意的计划。这个页面的存在是为了让这些区分保持可见。' },
    ],
    dimensions: ['meaning'],
    questionIds: ['mea-03'],
    references: [{ label: 'Stanford Encyclopedia of Philosophy, “Albert Camus”', href: 'https://plato.stanford.edu/entries/camus/' }],
  },
  {
    slug: 'machine-and-pain',
    title: { en: 'A machine that reports pain', zh: '一台报告疼痛的机器' },
    attribution: { en: 'An original case in the neighborhood of debates about machine consciousness and the explanatory gap. It is not a quotation from any one paper.', zh: '一个位于机器意识争论与解释鸿沟附近的原创案例。它不是任何一篇论文的引文。' },
    summary: { en: 'A machine organized as a nervous system says that it is in pain.', zh: '一台按神经系统组织起来的机器说它正在疼痛。' },
    essay: [
      { en: 'The case asks whether sameness of physical organization settles whether there is something it is like to be the machine. One response says there is no further fact. Another says the organization does not settle the question. Neither response is a test of technical literacy.', zh: '这个案例问：物理组织的相同，是否决定了对这台机器而言有没有某种“是什么样子”。一种回应说没有进一步的事实。另一种说组织并不能决定这个问题。两种回应都不是技术素养的测验。' },
      { en: 'Thomas Nagel’s 1974 bat paper is the usual modern statement of why subjective character resists a purely objective description. You do not need that paper to answer, and the questionnaire does not grade you against it.', zh: '托马斯·内格尔 1974 年关于蝙蝠的论文，是关于主观性格为何抗拒纯粹客观描述的通常现代陈述。你不需要那篇论文也能回答，问卷也不对照它来给你评分。' },
    ],
    dimensions: ['ontology'],
    questionIds: ['ont-04', 'x-04'],
    references: [{ label: 'Stanford Encyclopedia of Philosophy, “Qualia”', href: 'https://plato.stanford.edu/entries/qualia/' }],
  },
  {
    slug: 'observation-and-necessity',
    title: { en: 'Observation and necessity', zh: '观察与必然性' },
    attribution: { en: 'An original conflict between a careful observation and a demonstration that the observed thing is impossible.', zh: '一个原创的冲突：一次仔细的观察，与一个证明所观察之物不可能的论证。' },
    summary: { en: 'Logic says the thing you seem to see is impossible. The seeing still looks careful.', zh: '逻辑说你似乎看见的东西是不可能的。这一看见看起来仍然仔细。' },
    essay: [
      { en: 'The case is not a logic examination. It asks which check you run first when a claim of necessity and an observation will not both stand. Trusting the demonstration is not the same as being rational in every other dispute. Trusting the observation is not the same as abandoning argument.', zh: '这个案例不是逻辑考试。它问的是：当一个必然性主张与一次观察不能同时成立时，你先做哪一种核对。信任证明，并不等于在每一场其他争论里都是理性的。信任观察，也并不等于放弃论证。' },
    ],
    dimensions: ['epistemology', 'ontology'],
    questionIds: ['x-09'],
    references: [{ label: 'Stanford Encyclopedia of Philosophy, “Rationalism vs. Empiricism”', href: 'https://plato.stanford.edu/entries/rationalism-empiricism/' }],
  },
];

export function getExperiment(slug: string): ThoughtExperiment | undefined {
  return experiments.find((experiment) => experiment.slug === slug);
}
