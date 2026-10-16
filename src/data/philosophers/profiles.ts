import type { Philosopher } from '@/types/model';

const sep = (slug: string, label: string) => ({ label, href: `https://plato.stanford.edu/entries/${slug}/` });

export const philosophers: Philosopher[] = [
  {
    slug: 'plato',
    name: { en: 'Plato', zh: '柏拉图' },
    dates: { en: 'c. 428/427–348/347 BCE', zh: '约公元前 428/427–前 348/347 年' },
    traditionSlugs: ['idealism', 'rationalism', 'discovered-meaning'],
    themes: [
      { en: 'Forms', zh: '相' },
      { en: 'Knowledge and inquiry', zh: '知识与探究' },
      { en: 'The examined life', zh: '经过省察的生活' },
    ],
    biography: {
      en: 'Plato was an Athenian philosopher, a student of Socrates and a teacher of Aristotle. He founded the Academy. His dialogues do not speak in a single doctrinal voice, and Socrates is not always a mask for a settled system. Across the dialogues, a recurring question is whether the things we perceive are the most real things, and whether a life can be oriented by a good that is not just a preference.',
      zh: '柏拉图是雅典哲学家，苏格拉底的学生，亚里士多德的老师。他建立了学园。他的对话并不以单一的教条声音说话，苏格拉底也不总是一个已定体系的面具。贯穿这些对话的一个反复问题是：我们所知觉的事物是否就是最真实的事物，以及一种生活能否被一种并不只是偏好的善所定向。',
    },
    works: [
      { title: { en: 'Apology', zh: '《申辩篇》' }, detail: { en: 'Socrates’ defense, and a picture of a life under examination.', zh: '苏格拉底的申辩，以及一幅处于省察之下的生活图景。' } },
      { title: { en: 'Phaedo', zh: '《斐多篇》' }, detail: { en: 'Death, the soul, and arguments that the body is not the whole of the person.', zh: '死亡、灵魂，以及身体并非人的全部的论证。' } },
      { title: { en: 'Republic', zh: '《理想国》' }, detail: { en: 'Justice in the city and the soul, and the image of forms that outrank appearances.', zh: '城邦与灵魂中的正义，以及高于现象的相的意象。' } },
    ],
    questions: [
      { en: 'Can a just person be harmed by the loss of reputation alone?', zh: '一个正义的人能否仅因名誉的丧失而受到伤害？' },
      { en: 'If appearances change, what would it mean for knowledge to stay put?', zh: '如果现象会变，知识保持不动意味着什么？' },
    ],
    dimensions: ['ontology', 'epistemology', 'meaning'],
    readingNote: {
      en: 'Plato is a reference for the right pole of reality only with a warning: the forms are not “idealism” in the modern textbook sense, and the dialogues disagree among themselves.',
      zh: '把柏拉图当作实在之轴右极的参照时必须带一个警告：相并不是现代教科书意义上的“观念论”，而且各篇对话彼此并不一致。',
    },
    references: [sep('plato', 'Stanford Encyclopedia of Philosophy, “Plato”')],
  },
  {
    slug: 'aristotle',
    name: { en: 'Aristotle', zh: '亚里士多德' },
    dates: { en: '384–322 BCE', zh: '公元前 384–前 322 年' },
    traditionSlugs: ['virtue-ethics', 'discovered-meaning', 'communal-thought'],
    themes: [
      { en: 'Substance and explanation', zh: '实体与解释' },
      { en: 'Virtue and flourishing', zh: '德性与繁荣' },
      { en: 'Political life', zh: '政治生活' },
    ],
    biography: {
      en: 'Aristotle was born in Stagira, studied in Plato’s Academy, and later founded the Lyceum in Athens. He is not a British empiricist, though he insists that knowledge of nature begins from what we encounter. In ethics he asks what a human life looks like when its capacities are exercised well, and he treats the polis as a setting of that life rather than as an optional club.',
      zh: '亚里士多德生于斯塔吉拉，在柏拉图的学园学习，后来在雅典建立了吕克昂。他不是英国经验论者，尽管他坚持关于自然的知识从我们所遭遇的东西开始。在伦理学中，他问人的能力被很好地运用时，一种人的生活是什么样子，并且他把城邦看作这种生活的场所，而不是一个可选的俱乐部。',
    },
    works: [
      { title: { en: 'Nicomachean Ethics', zh: '《尼各马可伦理学》' }, detail: { en: 'Virtue, practical wisdom, friendship, and the human good.', zh: '德性、实践智慧、友爱与人的善。' } },
      { title: { en: 'Politics', zh: '《政治学》' }, detail: { en: 'The claim that a human being is a political animal, and the study of constitutions.', zh: '人是政治动物的主张，以及对政体的研究。' } },
      { title: { en: 'De Anima', zh: '《论灵魂》' }, detail: { en: 'A study of soul as the form of a living body, not a casual dualism.', zh: '把灵魂作为生命体之形式的研究，而不是一种随意的二元论。' } },
    ],
    questions: [
      { en: 'What is the difference between a life that is pleasant and a life that goes well?', zh: '一种愉快的生活与一种过得好的生活，差别在哪里？' },
      { en: 'Which obligations come from being a citizen rather than from a promise?', zh: '哪些义务来自作为公民，而不是来自一个承诺？' },
    ],
    dimensions: ['meaning', 'society', 'ethics'],
    readingNote: {
      en: 'Aristotle is the main atlas entry for virtue ethics, which the moral axis does not score. His relation to empiricism is thematic, not an identity with Locke or Hume.',
      zh: '亚里士多德是图谱中德性伦理的主要条目，而道德之轴并不给德性伦理计分。他与经验论的关系是主题上的，并不是与洛克或休谟的同一。',
    },
    references: [sep('aristotle', 'Stanford Encyclopedia of Philosophy, “Aristotle”'), sep('aristotle-ethics', 'Stanford Encyclopedia of Philosophy, “Aristotle’s Ethics”')],
  },
  {
    slug: 'descartes',
    name: { en: 'René Descartes', zh: '勒内·笛卡尔' },
    dates: { en: '1596–1650', zh: '1596–1650 年' },
    traditionSlugs: ['rationalism'],
    themes: [
      { en: 'Methodical doubt', zh: '方法性怀疑' },
      { en: 'Mind and body', zh: '心灵与身体' },
      { en: 'Clear and distinct ideas', zh: '清楚明白的观念' },
    ],
    biography: {
      en: 'Descartes, born in Touraine and dying in Stockholm, published the Discourse on the Method in 1637 and the Meditations in 1641. He uses doubt as a tool, not as a resting place, and argues that the mind is really distinct from body. That distinction is not the same as the idealism pole of this site: Descartes is a dualist about created substance, not a Berkeleyan idealist. His views on freedom are debated and are not scored here as a settled libertarianism.',
      zh: '笛卡尔生于都兰，卒于斯德哥尔摩。他在 1637 年出版《谈谈方法》，在 1641 年出版《第一哲学沉思集》。他把怀疑用作工具，而不是停驻之处，并论证心灵与身体真实地区分。这一区分并不等同于本站的观念论一极：笛卡尔是关于受造实体的二元论者，不是贝克莱式的观念论者。他关于自由的看法存在争议，这里并不把它们计成一种已定的自由意志论。',
    },
    works: [
      { title: { en: 'Discourse on the Method (1637)', zh: '《谈谈方法》（1637）' }, detail: { en: 'A vernacular account of method and of a life ordered by inquiry.', zh: '一份用方言写成的、关于方法以及由探究所安排的生活的说明。' } },
      { title: { en: 'Meditations on First Philosophy (1641)', zh: '《第一哲学沉思集》（1641）' }, detail: { en: 'Doubt, the cogito, God, and the real distinction of mind and body.', zh: '怀疑、我思、上帝，以及心灵与身体的真实区分。' } },
    ],
    questions: [
      { en: 'What, if anything, survives a doubt that is trying to be as general as possible?', zh: '一种试图尽可能普遍的怀疑，如果还有东西留下，留下的是什么？' },
      { en: 'Does a clear conception of mind show that mind is not physical?', zh: '对心灵的一个清楚构想，是否表明心灵不是物理的？' },
    ],
    dimensions: ['epistemology', 'ontology'],
    readingNote: {
      en: 'Use Descartes for the rationalist pole, and do not collapse his dualism into idealism or into a score for free will.',
      zh: '用笛卡尔来理解理性论一极，不要把他的二元论压成观念论，或压成一个自由意志分数。',
    },
    references: [sep('descartes', 'Stanford Encyclopedia of Philosophy, “René Descartes”')],
  },
  {
    slug: 'locke',
    name: { en: 'John Locke', zh: '约翰·洛克' },
    dates: { en: '1632–1704', zh: '1632–1704 年' },
    traditionSlugs: ['empiricism', 'liberal-individualism'],
    themes: [
      { en: 'The origin of ideas', zh: '观念的来源' },
      { en: 'Personal identity', zh: '个人同一性' },
      { en: 'Limited government', zh: '有限政府' },
    ],
    biography: {
      en: 'Locke’s Essay Concerning Human Understanding and Two Treatises of Government both appeared in 1689, as did A Letter Concerning Toleration. He argues that the materials of knowledge come from experience, while also defending a natural right to life, liberty, and property that political power may not simply absorb. His account of personal identity through consciousness later became a standard reference for puzzles about what makes a person the same over time.',
      zh: '洛克的《人类理解论》与《政府论两篇》都在 1689 年问世，《论宽容》也是如此。他主张知识的材料来自经验，同时也保卫生命、自由与财产的自然权利，政治权力不能径自吞没它们。他通过意识来说明个人同一性的论述，后来成为“是什么使一个人在时间中保持为同一个人”这类难题的标准参照。',
    },
    works: [
      { title: { en: 'An Essay Concerning Human Understanding (1689)', zh: '《人类理解论》（1689）' }, detail: { en: 'Experience as the source of ideas, and the limits of knowledge.', zh: '经验作为观念的来源，以及知识的限度。' } },
      { title: { en: 'Two Treatises of Government (1689)', zh: '《政府论两篇》（1689）' }, detail: { en: 'Consent, rights, and the limits of political power.', zh: '同意、权利，以及政治权力的限度。' } },
    ],
    questions: [
      { en: 'If identity follows consciousness, what happens when memory fails?', zh: '如果同一性跟随着意识，记忆失败时会发生什么？' },
      { en: 'Which powers may a community exercise over a member who never consented to this particular law?', zh: '一个共同体可以对一个从未同意这部特定法律的成员行使哪些权力？' },
    ],
    dimensions: ['epistemology', 'society', 'ontology'],
    readingNote: {
      en: 'Locke supports the empiricist and individual-priority poles only as a historical neighbor. His theory of rights is not Mill’s utilitarianism.',
      zh: '洛克只是作为历史近邻支持经验论与个人优先这两极。他的权利理论不是密尔的功利主义。',
    },
    references: [sep('locke', 'Stanford Encyclopedia of Philosophy, “John Locke”')],
  },
  {
    slug: 'hume',
    name: { en: 'David Hume', zh: '大卫·休谟' },
    dates: { en: '1711–1776', zh: '1711–1776 年' },
    traditionSlugs: ['empiricism', 'compatibilism'],
    themes: [
      { en: 'Impressions and ideas', zh: '印象与观念' },
      { en: 'Causation and habit', zh: '因果与习惯' },
      { en: 'Liberty and necessity', zh: '自由与必然' },
    ],
    biography: {
      en: 'Hume, a Scottish philosopher, published A Treatise of Human Nature in 1739–40 and later recast parts of it in the two Enquiries (1748 and 1751). He ties the content of thought to experience and treats causal inference as habit rather than as a glimpse of necessary connection. In the discussion of liberty and necessity he is a central early compatibilist: necessity, as he understands it, does not abolish moral sentiment.',
      zh: '休谟是苏格兰哲学家。他在 1739–40 年出版《人性论》，后来在两篇《研究》（1748 与 1751）中改写了其中部分。他把思想的内容系于经验，并把因果推论看作习惯，而不是对必然联系的一瞥。在关于自由与必然的讨论中，他是早期相容论的核心人物：按他的理解，必然并不废除道德情感。',
    },
    works: [
      { title: { en: 'A Treatise of Human Nature (1739–40)', zh: '《人性论》（1739–40）' }, detail: { en: 'The earlier, larger system, including identity, causation, and the passions.', zh: '较早、较大的体系，包括同一性、因果与情感。' } },
      { title: { en: 'An Enquiry Concerning Human Understanding (1748)', zh: '《人类理解研究》（1748）' }, detail: { en: 'A shorter statement on experience, causation, and liberty.', zh: '关于经验、因果与自由的一份较短陈述。' } },
    ],
    questions: [
      { en: 'If causes are regularities we are used to, what is left of “could have done otherwise”?', zh: '如果原因是我们习惯了的规则性，“本来可以另作选择”还剩下什么？' },
      { en: 'Can a moral judgment be a conclusion of reason alone?', zh: '一个道德判断能否仅凭理性得出？' },
    ],
    dimensions: ['epistemology', 'agency'],
    readingNote: {
      en: 'Hume is the atlas’s clearest pointer to compatibilism, which the agency axis deliberately does not score.',
      zh: '休谟是图谱中指向相容论的最清楚的路标，而能动性之轴有意不给相容论计分。',
    },
    references: [sep('hume', 'Stanford Encyclopedia of Philosophy, “David Hume”')],
  },
  {
    slug: 'kant',
    name: { en: 'Immanuel Kant', zh: '伊曼努尔·康德' },
    dates: { en: '1724–1804', zh: '1724–1804 年' },
    traditionSlugs: ['deontology', 'rationalism'],
    themes: [
      { en: 'The limits of theoretical knowledge', zh: '理论知识的限度' },
      { en: 'The categorical imperative', zh: '绝对命令' },
      { en: 'Autonomy', zh: '自律' },
    ],
    biography: {
      en: 'Kant spent his life in Königsberg. The Critique of Pure Reason (1781, revised 1787) argues that knowledge of nature requires both sensible intuition and concepts, and that traditional metaphysics overreaches when it claims knowledge of the soul, the world-whole, or God. The Groundwork (1785) argues that moral duty binds independently of inclination and of the sum of happiness. He is a bad fit for a simple rationalist-versus-empiricist score: he criticizes both sides.',
      zh: '康德一生都在柯尼斯堡。 《纯粹理性批判》（1781，1787 年修订）主张关于自然的知识同时需要感性直观与概念，而传统形而上学在声称认识灵魂、世界整体或上帝时越出了界限。《奠基》（1785）主张道德义务独立于偏好、也独立于幸福的总和而约束人。他很难被放进一个简单的理性论对经验论分数：他批评双方。',
    },
    works: [
      { title: { en: 'Critique of Pure Reason (1781/1787)', zh: '《纯粹理性批判》（1781/1787）' }, detail: { en: 'The conditions and the limits of theoretical knowledge.', zh: '理论知识的条件与限度。' } },
      { title: { en: 'Groundwork of the Metaphysics of Morals (1785)', zh: '《道德形而上学奠基》（1785）' }, detail: { en: 'Duty, humanity as an end, and autonomy.', zh: '义务、作为目的的人性，以及自律。' } },
    ],
    questions: [
      { en: 'Can a helpful lie still be forbidden?', zh: '一个有帮助的谎言是否仍然可以被禁止？' },
      { en: 'What is the difference between acting from duty and acting from a good result you happen to like?', zh: '出于义务而行动，与出于一个你恰好喜欢的好结果而行动，差别在哪里？' },
    ],
    dimensions: ['ethics', 'epistemology', 'agency'],
    readingNote: {
      en: 'Kant is the main reference for the deontological pole. His critical philosophy is coarser than any single NOEMA axis.',
      zh: '康德是义务论一极的主要参照。他的批判哲学比任何单一的 NOEMA 轴都更细致，轴因此显得更粗。',
    },
    references: [sep('kant', 'Stanford Encyclopedia of Philosophy, “Immanuel Kant”')],
  },
  {
    slug: 'mill',
    name: { en: 'John Stuart Mill', zh: '约翰·斯图亚特·密尔' },
    dates: { en: '1806–1873', zh: '1806–1873 年' },
    traditionSlugs: ['consequentialism', 'empiricism', 'liberal-individualism'],
    themes: [
      { en: 'Utility', zh: '效用' },
      { en: 'Liberty of thought and action', zh: '思想与行动的自由' },
      { en: 'The subjection of women', zh: '妇女的从属地位' },
    ],
    biography: {
      en: 'Mill was an English philosopher and, for a time, a Member of Parliament. A System of Logic (1843) defends an empiricist account of scientific inference. On Liberty (1859) argues for a strong protection of individual experiments in living, on grounds that include the long-run benefits of that protection. Utilitarianism appeared in Fraser’s Magazine in 1861 and as a book in 1863. He is a reminder that consequentialism and individual priority can be held together, and also that the combination is an argument, not a psychological type.',
      zh: '密尔是英国哲学家，并曾担任议会议员。《逻辑体系》（1843）保卫一种关于科学推论的经验论说明。《论自由》（1859）论证对个人生活实验的强保护，其根据包括这种保护的长远益处。《功利主义》于 1861 年发表在《弗雷泽杂志》，1863 年成书。他提醒我们：后果论与个人优先可以被放在一起，而且这一组合是一个论证，不是一种心理类型。',
    },
    works: [
      { title: { en: 'On Liberty (1859)', zh: '《论自由》（1859）' }, detail: { en: 'The harm principle and the value of experiments in living.', zh: '伤害原则，以及生活实验的价值。' } },
      { title: { en: 'Utilitarianism (1861)', zh: '《功利主义》（1861）' }, detail: { en: 'Rightness and the general happiness, including a defense of higher pleasures.', zh: '正当性与普遍幸福，包括对更高快乐的辩护。' } },
      { title: { en: 'The Subjection of Women (1869)', zh: '《妇女的屈从地位》（1869）' }, detail: { en: 'A consequentialist and liberal argument against the legal subordination of women.', zh: '一篇反对妇女在法律上从属地位的后果论与自由主义论证。' } },
    ],
    questions: [
      { en: 'If liberty is justified by its benefits, what happens in a case where suppressing a person would benefit more people now?', zh: '如果自由是由其益处证成的，那么在压制一个人会在当下使更多人受益的情形中会发生什么？' },
    ],
    dimensions: ['ethics', 'society', 'epistemology'],
    readingNote: {
      en: 'Mill sits on the consequentialist and individual-priority sides of this model, and the tension between those sides is part of why he is worth reading.',
      zh: '密尔处在这个模型的后果论一侧与个人优先一侧，而这两侧之间的张力正是他值得阅读的一部分原因。',
    },
    references: [sep('mill', 'Stanford Encyclopedia of Philosophy, “John Stuart Mill”')],
  },
  {
    slug: 'nietzsche',
    name: { en: 'Friedrich Nietzsche', zh: '弗里德里希·尼采' },
    dates: { en: '1844–1900', zh: '1844–1900 年' },
    traditionSlugs: ['existentialism'],
    themes: [
      { en: 'The genealogy of moral values', zh: '道德价值的谱系' },
      { en: 'The revaluation of values', zh: '价值的重估' },
      { en: 'Affirmation', zh: '肯定' },
    ],
    biography: {
      en: 'Nietzsche, born in Röcken in Prussia, wrote The Birth of Tragedy (1872), The Gay Science (1882, expanded 1887), Thus Spoke Zarathustra (1883–85), Beyond Good and Evil (1886), and On the Genealogy of Morality (1887). He attacks the idea that received moral values are simply discovered truths, and he is often recruited for the “creation” pole. That recruitment is partial. His work is not a permission slip for arbitrary preference, and it is not a clinical description of nihilism as a mood.',
      zh: '尼采生于普鲁士的勒肯。他写了《悲剧的诞生》（1872）、《快乐的科学》（1882，1887 年增订）、《查拉图斯特拉如是说》（1883–85）、《善恶的彼岸》（1886）和《道德的谱系》（1887）。他攻击“被接受的道德价值只是被发现的真理”这一想法，因而常常被征用到“创造”一极。这种征用是部分的。他的工作不是一张任意偏好的许可证，也不是把虚无主义当作一种情绪的临床描述。',
    },
    works: [
      { title: { en: 'The Gay Science (1882/1887)', zh: '《快乐的科学》（1882/1887）' }, detail: { en: 'Includes the announcement that the belief in the Christian God has become unbelievable, in a definite literary setting.', zh: '在一个确定的文学场景中，包含基督教上帝之信仰已经变得不可信的宣告。' } },
      { title: { en: 'On the Genealogy of Morality (1887)', zh: '《道德的谱系》（1887）' }, detail: { en: 'A historical and psychological critique of guilt, ascetic ideals, and “good and evil.”', zh: '对罪疚、禁欲理想以及“善与恶”的历史与心理批判。' } },
    ],
    questions: [
      { en: 'If a moral value has a history, does that show it is not binding?', zh: '如果一种道德价值有历史，这是否表明它没有约束力？' },
    ],
    dimensions: ['meaning', 'ethics'],
    readingNote: {
      en: 'Read Nietzsche beside the meaning axis, not as a diagnosis and not as the owner of the creation pole.',
      zh: '把尼采放在意义之轴旁边来读，而不是当作一种诊断，也不是当作创造一极的所有者。',
    },
    references: [sep('nietzsche', 'Stanford Encyclopedia of Philosophy, “Friedrich Nietzsche”')],
  },
  {
    slug: 'kierkegaard',
    name: { en: 'Søren Kierkegaard', zh: '索伦·克尔凯郭尔' },
    dates: { en: '1813–1855', zh: '1813–1855 年' },
    traditionSlugs: ['existentialism', 'discovered-meaning'],
    themes: [
      { en: 'The single individual', zh: '单一的个体' },
      { en: 'Faith and offense', zh: '信仰与冒犯' },
      { en: 'Pseudonymous authorship', zh: '假名写作' },
    ],
    biography: {
      en: 'Kierkegaard lived in Copenhagen. Either/Or, Fear and Trembling, and other major works of 1843–46 were published under pseudonyms, and he asked readers not to treat those voices as a simple report of his own doctrine. A recurring theme is the individual before God, and the claim that a decision of faith is not the conclusion of a public proof. He is a poor fit for a secular “create your own meaning” slogan, and also a poor fit for a merely social morality.',
      zh: '克尔凯郭尔生活在哥本哈根。《非此即彼》、《恐惧与战栗》以及 1843–46 年的其他主要作品以假名出版，他要求读者不要把那些声音当成对他自己学说的简单报告。一个反复的主题是上帝面前的个体，以及信仰的决定并不是一项公共证明的结论。他既不适合“创造你自己的意义”这句世俗口号，也不适合一种仅仅是社会性的道德。',
    },
    works: [
      { title: { en: 'Either/Or (1843)', zh: '《非此即彼》（1843）' }, detail: { en: 'Pseudonymous contrasts among aesthetic and ethical ways of life.', zh: '以假名对照审美的与伦理的生活方式。' } },
      { title: { en: 'Fear and Trembling (1843)', zh: '《恐惧与战栗》（1843）' }, detail: { en: 'Abraham, published under the name Johannes de Silentio.', zh: '关于亚伯拉罕，以约翰尼斯·德·西伦提奥的名字出版。' } },
    ],
    questions: [
      { en: 'What is lost if a personal decision has to be justified in terms everyone already accepts?', zh: '如果一个个人决定必须用每个人已经接受的语词来证成，失去的是什么？' },
    ],
    dimensions: ['meaning', 'society'],
    readingNote: {
      en: 'Kierkegaard presses the individual pole of social life and resists both a purely invented meaning and a meaning that is only the crowd’s.',
      zh: '克尔凯郭尔推挤社会生活中的个人一极，并且同时抵抗一种纯粹被发明的意义和一种只属于人群的意义。',
    },
    references: [sep('kierkegaard', 'Stanford Encyclopedia of Philosophy, “Søren Kierkegaard”')],
  },
  {
    slug: 'sartre',
    name: { en: 'Jean-Paul Sartre', zh: '让-保罗·萨特' },
    dates: { en: '1905–1980', zh: '1905–1980 年' },
    traditionSlugs: ['existentialism'],
    themes: [
      { en: 'Existence and essence', zh: '存在与本质' },
      { en: 'Bad faith', zh: '自欺' },
      { en: 'Situation', zh: '处境' },
    ],
    biography: {
      en: 'Sartre’s Being and Nothingness (1943) is a phenomenological ontology of consciousness, nothingness, and bad faith. The 1945 lecture published in 1946 as Existentialism Is a Humanism says, in a public and simplified way, that existence precedes essence and that we are responsible for the values we invent. That lecture should not be substituted for the book. Sartre’s freedom is not the same claim as the metaphysical libertarianism of the agency axis, though the two are often confused.',
      zh: '萨特的《存在与虚无》（1943）是一部关于意识、虚无与自欺的现象学本体论。1945 年的讲演于 1946 年以《存在主义是一种人道主义》出版，它以一种公开而简化的方式说：存在先于本质，并且我们为自己所发明的价值负责。那篇讲演不应代替这本书。萨特的自由并不是能动性之轴上的形而上学自由意志论，尽管二者常被混淆。',
    },
    works: [
      { title: { en: 'Being and Nothingness (1943)', zh: '《存在与虚无》（1943）' }, detail: { en: 'Consciousness, negation, the look, and bad faith.', zh: '意识、否定、注视与自欺。' } },
      { title: { en: 'Existentialism Is a Humanism (1946)', zh: '《存在主义是一种人道主义》（1946）' }, detail: { en: 'A lecture that states the invented-value claim more bluntly than the treatise.', zh: '一篇比论著更直白地陈述“价值被发明”这一主张的讲演。' } },
    ],
    questions: [
      { en: 'If there is no human essence to consult, what makes one project a betrayal of another person?', zh: '如果没有人性本质可以咨询，是什么使一个计划成为对另一个人的背叛？' },
    ],
    dimensions: ['meaning', 'agency', 'ontology'],
    readingNote: {
      en: 'Sartre belongs beside created meaning. Do not read the agency letter L as “Sartre’s freedom.”',
      zh: '萨特应放在被创造的意义旁边。不要把能动性字母 L 读成“萨特的自由”。',
    },
    references: [sep('sartre', 'Stanford Encyclopedia of Philosophy, “Jean-Paul Sartre”')],
  },
  {
    slug: 'camus',
    name: { en: 'Albert Camus', zh: '阿尔贝·加缪' },
    dates: { en: '1913–1960', zh: '1913–1960 年' },
    traditionSlugs: ['existentialism'],
    themes: [
      { en: 'The absurd', zh: '荒诞' },
      { en: 'Revolt', zh: '反抗' },
      { en: 'Limits on violence', zh: '对暴力的限制' },
    ],
    biography: {
      en: 'Camus was born in French Algeria and died in France in 1960. The Myth of Sisyphus (1942) describes the absurd as the confrontation between a human demand for meaning and a world that does not answer it. The Rebel (1951) then asks what revolt may not do. Camus often resisted being filed simply as an existentialist. He is relevant here because he refuses both a ready-made cosmic purpose and the slide from that refusal into “nothing matters.”',
      zh: '加缪生于法属阿尔及利亚，1960 年卒于法国。《西西弗神话》（1942）把荒诞描述为人对意义的要求与一个并不回答的世界之间的对峙。《反抗者》（1951）接着问反抗不可以做什么。加缪常常拒绝被简单地归入存在主义者。他在这里相关，是因为他既拒绝一个现成的宇宙目的，也拒绝从这一拒绝滑向“没有什么重要”。',
    },
    works: [
      { title: { en: 'The Myth of Sisyphus (1942)', zh: '《西西弗神话》（1942）' }, detail: { en: 'The absurd, suicide, and a life without metaphysical consolation.', zh: '荒诞、自杀，以及没有形而上学安慰的生活。' } },
      { title: { en: 'The Rebel (1951)', zh: '《反抗者》（1951）' }, detail: { en: 'Revolt, murder, and the demand for a limit.', zh: '反抗、杀戮，以及对界限的要求。' } },
    ],
    questions: [
      { en: 'If the world does not answer the demand for meaning, what is the difference between revolt and invention?', zh: '如果世界并不回答对意义的要求，反抗与发明的差别是什么？' },
    ],
    dimensions: ['meaning'],
    readingNote: {
      en: 'Camus is the best atlas warning against equating the creation pole, or the absence of cosmic purpose, with nihilism.',
      zh: '加缪是图谱中最好的警告：不要把创造一极或宇宙目的的缺席等同于虚无主义。',
    },
    references: [sep('camus', 'Stanford Encyclopedia of Philosophy, “Albert Camus”')],
  },
  {
    slug: 'beauvoir',
    name: { en: 'Simone de Beauvoir', zh: '西蒙娜·德·波伏瓦' },
    dates: { en: '1908–1986', zh: '1908–1986 年' },
    traditionSlugs: ['existentialism'],
    themes: [
      { en: 'Ambiguity', zh: '暧昧' },
      { en: 'Situation and freedom', zh: '处境与自由' },
      { en: 'Women’s oppression', zh: '对妇女的压迫' },
    ],
    biography: {
      en: 'Beauvoir’s The Ethics of Ambiguity (1947) argues that freedom is real and that it is always situated, so an ethics cannot pretend the subject is a pure inventor standing nowhere. The Second Sex (1949) studies woman as a situation made by myth, law, and habit, not as a biological destiny and not as a mere idea. She is essential in this atlas because created meaning, on her account, is not a private hobby and not a release from other people.',
      zh: '波伏瓦的《暧昧伦理学》（1947）主张自由是真实的，并且总是处在处境之中，因此一种伦理学不能假装主体是一个无处立足的纯粹发明者。《第二性》（1949）把女人研究为一种由神话、法律与习惯做成的处境，而不是一种生物学命运，也不是一个单纯的观念。她在这个图谱中不可缺少，因为按她的说明，被创造的意义不是一种私人爱好，也不是从他人那里的解脱。',
    },
    works: [
      { title: { en: 'The Ethics of Ambiguity (1947)', zh: '《暧昧伦理学》（1947）' }, detail: { en: 'Freedom, childhood, and the temptation to flee responsibility.', zh: '自由、童年，以及逃避责任的诱惑。' } },
      { title: { en: 'The Second Sex (1949)', zh: '《第二性》（1949）' }, detail: { en: 'The argument that one is not born, but becomes, a woman, developed across a long study.', zh: '在一部长篇研究中展开的论证：人不是生而为女人，而是变成女人。' } },
    ],
    questions: [
      { en: 'How can a project be one’s own if the situation in which it is chosen was not?', zh: '如果选择所处的处境并不是自己的，一个计划如何能够是自己的？' },
    ],
    dimensions: ['meaning', 'agency', 'society'],
    readingNote: {
      en: 'Beauvoir complicates both the creation pole and the individual-priority pole. That complication is the reason to read her, not a reason to force her onto one letter.',
      zh: '波伏瓦同时使创造一极和个人优先一极变得更复杂。这种复杂正是阅读她的理由，而不是把她强行放上一个字母的理由。',
    },
    references: [sep('beauvoir', 'Stanford Encyclopedia of Philosophy, “Simone de Beauvoir”')],
  },
  {
    slug: 'arendt',
    name: { en: 'Hannah Arendt', zh: '汉娜·阿伦特' },
    dates: { en: '1906–1975', zh: '1906–1975 年' },
    traditionSlugs: ['communal-thought'],
    themes: [
      { en: 'Action and plurality', zh: '行动与复数性' },
      { en: 'The public world', zh: '公共世界' },
      { en: 'Judgment', zh: '判断' },
    ],
    biography: {
      en: 'Arendt was born in 1906 in Linden, later part of Hanover, and died in 1975. The Origins of Totalitarianism (1951), The Human Condition (1958), and Eichmann in Jerusalem (1963) are different books and should not be collapsed into one thesis. For this atlas, the relevant thought is that political life is action among equals who do not fuse into one will. She is not a communitarian in the late-twentieth-century academic sense, and she is not a partisan marker.',
      zh: '阿伦特 1906 年生于林登，后来属于汉诺威，1975 年去世。《极权主义的起源》（1951）、《人的境况》（1958）和《艾希曼在耶路撒冷》（1963）是不同的书，不应被压成一个论点。对这个图谱而言，相关的想法是：政治生活是平等者之间的行动，他们并不融成一个意志。她不是二十世纪末学术意义上的共同体主义者，也不是一个党派标记。',
    },
    works: [
      { title: { en: 'The Human Condition (1958)', zh: '《人的境况》（1958）' }, detail: { en: 'Labor, work, and action, and the publicity of a world shared with others.', zh: '劳动、工作与行动，以及一个与他人共享的世界的公共性。' } },
      { title: { en: 'Eichmann in Jerusalem (1963)', zh: '《艾希曼在耶路撒冷》（1963）' }, detail: { en: 'A report on the trial, and a contested account of thoughtlessness.', zh: '一份关于审判的报道，以及一个有争议的关于无思想的说明。' } },
    ],
    questions: [
      { en: 'What is the difference between a common world and a single collective will?', zh: '一个共同世界与一个单一的集体意志，差别是什么？' },
    ],
    dimensions: ['society', 'agency'],
    readingNote: {
      en: 'Arendt belongs on the society pages as a thinker of plurality, not as the owner of either pole.',
      zh: '阿伦特出现在社会页面上，是作为复数性的思考者，而不是作为任何一极的所有者。',
    },
    references: [sep('arendt', 'Stanford Encyclopedia of Philosophy, “Hannah Arendt”')],
  },
  {
    slug: 'rawls',
    name: { en: 'John Rawls', zh: '约翰·罗尔斯' },
    dates: { en: '1921–2002', zh: '1921–2002 年' },
    traditionSlugs: ['liberal-individualism', 'deontology'],
    themes: [
      { en: 'Justice as fairness', zh: '作为公平的正义' },
      { en: 'The basic structure', zh: '基本结构' },
      { en: 'Public reason', zh: '公共理性' },
    ],
    biography: {
      en: 'Rawls’s A Theory of Justice (1971) asks what principles free and equal persons would accept for the basic structure of society behind a veil of ignorance. Political Liberalism (1993) later asks how such a society can be stable among people who do not share one comprehensive doctrine. He is a reference for individual priority and for constraints on what may be done for the sake of a greater sum. He is not a party label.',
      zh: '罗尔斯的《正义论》（1971）问：自由而平等的人，在无知之幕背后，会为社会制度的基本结构接受什么原则。《政治自由主义》（1993）后来问：在并不共享一种整全学说的人们之间，这样的社会如何能够稳定。他是个人优先的参照，也是“为了更大的总数可以做什么”之约束的参照。他不是一个党派标签。',
    },
    works: [
      { title: { en: 'A Theory of Justice (1971)', zh: '《正义论》（1971）' }, detail: { en: 'The original position, the two principles, and the critique of utilitarianism.', zh: '原初状态、两条原则，以及对功利主义的批评。' } },
      { title: { en: 'Political Liberalism (1993)', zh: '《政治自由主义》（1993）' }, detail: { en: 'Stability, overlapping consensus, and public reason.', zh: '稳定性、重叠共识与公共理性。' } },
    ],
    questions: [
      { en: 'Which inequalities would you refuse if you did not know whose place you would occupy?', zh: '如果你不知道自己将占据谁的位置，你会拒绝哪些不平等？' },
    ],
    dimensions: ['society', 'ethics'],
    readingNote: {
      en: 'Rawls is a neighbor of deontology and of individual priority. The questionnaire does not score “Rawlsianism.”',
      zh: '罗尔斯是义务论与个人优先的近邻。问卷并不给“罗尔斯主义”计分。',
    },
    references: [sep('rawls', 'Stanford Encyclopedia of Philosophy, “John Rawls”')],
  },
  {
    slug: 'nagel',
    name: { en: 'Thomas Nagel', zh: '托马斯·内格尔' },
    dates: { en: 'Born 1937', zh: '生于 1937 年' },
    datesNote: {
      en: 'Birth date 4 July 1937 is a matter of public record. This page does not state a death date.',
      zh: '1937 年 7 月 4 日的出生日期有公开记录。本页不陈述去世日期。',
    },
    traditionSlugs: ['physicalism', 'liberal-individualism'],
    themes: [
      { en: 'Subjective and objective standpoints', zh: '主观观点与客观观点' },
      { en: 'What experience is like', zh: '经验是什么样子' },
      { en: 'Moral luck', zh: '道德运气' },
    ],
    biography: {
      en: 'Nagel was born in Belgrade in 1937 and has taught philosophy at New York University. “What Is It Like to Be a Bat?” (1974) argues that a physical account, however complete in its own terms, leaves out the subjective character of experience. The View from Nowhere (1986) extends the tension between subjective and objective standpoints into knowledge, freedom, ethics, and the meaning of life. The Mortal Questions essay “Moral Luck” (1979) is a separate and important pressure on simple pictures of responsibility.',
      zh: '内格尔 1937 年生于贝尔格莱德，并曾在纽约大学教授哲学。《成为一只蝙蝠是什么样子？》（1974）主张：一份物理说明无论在它自己的语词里多么完整，都遗漏了经验的主观性格。《本然的观点》（1986）把主观观点与客观观点之间的张力延伸到知识、自由、伦理与生活的意义。《人的问题》中的《道德运气》（1979）是对简单责任图景的另一种重要压力。',
    },
    works: [
      { title: { en: '“What Is It Like to Be a Bat?” (1974)', zh: '《成为一只蝙蝠是什么样子？》（1974）' }, detail: { en: 'The subjective character of experience.', zh: '经验的主观性格。' } },
      { title: { en: 'Mortal Questions (1979)', zh: '《人的问题》（1979）' }, detail: { en: 'Includes “Moral Luck” and essays on death and the absurd.', zh: '包括《道德运气》以及关于死亡与荒诞的论文。' } },
      { title: { en: 'The View from Nowhere (1986)', zh: '《本然的观点》（1986）' }, detail: { en: 'Subjective and objective standpoints across several philosophical problems.', zh: '主观与客观观点穿越若干哲学问题。' } },
    ],
    questions: [
      { en: 'If an objective description leaves out what an experience is like, is that a fact about us or a fact about the world?', zh: '如果一份客观描述遗漏了经验是什么样子，这是关于我们的事实，还是关于世界的事实？' },
    ],
    dimensions: ['ontology', 'agency', 'meaning'],
    readingNote: {
      en: 'Nagel is the atlas’s main modern source for the explanatory gap. He is not an idealist by default, and Mind and Cosmos (2012) is a later and contested book that this short page does not summarize.',
      zh: '内格尔是图谱中解释鸿沟的主要现代来源。他并不因此就是观念论者。本短页不概述他后来有争议的《心灵与宇宙》（2012）。',
    },
    references: [sep('nagel', 'Stanford Encyclopedia of Philosophy, “Thomas Nagel”')],
  },
  {
    slug: 'confucius',
    name: { en: 'Confucius', zh: '孔子' },
    dates: { en: '551–479 BCE, traditional', zh: '传统纪年：公元前 551–前 479 年' },
    datesNote: {
      en: 'The dates are the conventional ones. The Analects is a later compilation, not a book written by Confucius as a treatise.',
      zh: '这些是通行的传统纪年。《论语》是后期辑录，不是孔子作为论著写下的一本书。',
    },
    traditionSlugs: ['confucianism', 'communal-thought', 'virtue-ethics'],
    themes: [
      { en: 'Ritual', zh: '礼' },
      { en: 'Humaneness', zh: '仁' },
      { en: 'Learning and role', zh: '学与名分' },
    ],
    biography: {
      en: 'Confucius, Kong Qiu, is the pivotal figure of the Ru tradition. What we have are sayings and scenes gathered by later hands in the Analects, not a systematic treatise in his voice. The teaching that emerges ties moral life to relationships, ritual, and the work of becoming a person others can rely on. It is a mistake to file this as Western communitarianism, and a mistake to treat it as the opposite of having a self.',
      zh: '孔子，名丘，是儒家传统的枢纽人物。我们所有的是后来的手在《论语》中汇集的言语与场景，不是一部以他的声音写成的系统论著。从中浮现的教导把道德生活系于关系、礼，以及成为别人可以依靠的人的功夫。把它归档为西方共同体主义是错误的，把它当成“有一个自我”的反面也是错误的。',
    },
    works: [
      { title: { en: 'The Analects', zh: '《论语》' }, detail: { en: 'A composite record of sayings and conversations, compiled after Confucius’ lifetime.', zh: '一部复合的言语与对话记录，编成于孔子生年之后。' } },
    ],
    questions: [
      { en: 'Which duties would remain if you had never chosen your parents, your place, or your rites?', zh: '如果你从未选择自己的父母、位置或礼仪，哪些义务仍然留下？' },
    ],
    dimensions: ['society', 'meaning', 'ethics'],
    readingNote: {
      en: 'Confucius is a primary non-Western reference for communal priority and for a moral picture the ethics axis does not capture.',
      zh: '孔子是共同体优先的一个主要的非西方参照，也是道德之轴所不能捕获的一种道德图景的参照。',
    },
    references: [sep('confucius', 'Stanford Encyclopedia of Philosophy, “Confucius”')],
  },
  {
    slug: 'mencius',
    name: { en: 'Mencius', zh: '孟子' },
    dates: { en: 'Fourth–third century BCE, traditional dates uncertain', zh: '公元前四至三世纪，传统纪年并不确定' },
    datesNote: {
      en: 'Conventional dates such as 372–289 BCE are scholarly approximations, not a settled record.',
      zh: '诸如公元前 372–前 289 年之类的通行纪年是学术上的近似，不是已定的记录。',
    },
    traditionSlugs: ['confucianism', 'virtue-ethics'],
    themes: [
      { en: 'The sprouts of virtue', zh: '善端' },
      { en: 'Human nature', zh: '人性' },
      { en: 'Humane government', zh: '仁政' },
    ],
    biography: {
      en: 'Mencius, Meng Ke, is the most important early developer of Confucian moral psychology. The book Mencius argues that human nature contains sprouts of compassion, shame, deference, and a sense of right and wrong, which cultivation can grow and circumstances can damage. He defends a partial concern that begins with those near at hand, against Mohist impartiality. The comparison with Western virtue ethics is useful and incomplete.',
      zh: '孟子，名轲，是儒家道德心理学早期最重要的发展者。《孟子》主张人性包含恻隐、羞恶、辞让与是非之端，修养可以使之生长，处境也可以毁伤它们。他保卫一种从身边开始的有差等的关切，以反对墨家的兼爱。与西方德性伦理的比较有用，但不完整。',
    },
    works: [
      { title: { en: 'Mencius', zh: '《孟子》' }, detail: { en: 'Dialogues and arguments on nature, righteousness, and government.', zh: '关于性、义与政的对话和论证。' } },
    ],
    questions: [
      { en: 'If compassion is a sprout rather than a decision, is morality discovered in us or built by us?', zh: '如果恻隐是一端而不是一个决定，道德是在我们之中被发现的，还是由我们建成的？' },
    ],
    dimensions: ['ethics', 'meaning', 'society'],
    readingNote: {
      en: 'Mencius is a bridge between discovered moral tendencies and the communal cultivation of a person. He is not a data point for a personality cluster.',
      zh: '孟子是被发现的道德倾向与对一个人的共同修养之间的桥梁。他不是人格聚类的一个数据点。',
    },
    references: [sep('mencius', 'Stanford Encyclopedia of Philosophy, “Mencius”')],
  },
  {
    slug: 'zhuangzi',
    name: { en: 'Zhuangzi', zh: '庄子' },
    dates: { en: 'Traditionally fourth century BCE; the dates are uncertain', zh: '传统上为公元前四世纪；纪年不确定' },
    datesNote: {
      en: 'The Zhuangzi is a composite text. The Inner Chapters are often treated as earlier; the Outer and Miscellaneous Chapters are later and varied. Biographical details are not secure.',
      zh: '《庄子》是一部复合文本。内篇常被看作较早；外篇与杂篇较晚而且并不一律。传记细节并不可靠。',
    },
    traditionSlugs: ['daoist-philosophy'],
    themes: [
      { en: 'Perspective', zh: '视角' },
      { en: 'Spontaneity', zh: '自然' },
      { en: 'The limits of fixed distinctions', zh: '固定区分的限度' },
    ],
    biography: {
      en: 'Zhuangzi is the name attached to a composite Daoist text and, more loosely, to a person of the Warring States period. The book unsettles confident distinctions between useful and useless, self and other, life and death, often by stories rather than by treatise. It is a mistake to score this as libertarian free will, and a mistake to score it as quietism. Its relevance to NOEMA is the pressure it puts on any axis that pretends a distinction is simply given.',
      zh: '庄子这个名字系于一部复合的道家文本，也较宽泛地系于战国时期的一个人。这本书常常用故事而不是论著，动摇有用与无用、自我与他者、生与死之间的自信区分。把它计成自由意志论是错误的，把它计成寂静主义也是错误的。它对 NOEMA 的意义在于：它压迫任何假装一种区分是简单地被给予的轴。',
    },
    works: [
      { title: { en: 'Zhuangzi', zh: '《庄子》' }, detail: { en: 'A composite work; the Inner Chapters are the usual starting point, with later chapters that do not all speak in one voice.', zh: '一部复合作品；内篇是通常的起点，其后的篇章并不都以一个声音说话。' } },
    ],
    questions: [
      { en: 'Which of your distinctions would survive if you took the other pole’s description as seriously as your own?', zh: '如果你把另一极的描述看得和你自己的一样认真，你的哪些区分还会留下？' },
    ],
    dimensions: ['agency', 'epistemology', 'ontology'],
    readingNote: {
      en: 'Zhuangzi is included so the agency and knowledge pages are not an exclusively European argument. He is not assigned a six-letter code.',
      zh: '收入庄子，是为了使能动性与知识的页面不是一场只属于欧洲的论证。他没有被指派一个六字母代码。',
    },
    references: [sep('zhuangzi', 'Stanford Encyclopedia of Philosophy, “Zhuangzi”')],
  },
  {
    slug: 'mozi',
    name: { en: 'Mozi', zh: '墨子' },
    dates: { en: 'Traditionally fifth century BCE; dates uncertain', zh: '传统上为公元前五世纪；纪年不确定' },
    datesNote: {
      en: 'The Mozi is a composite text of the Mohist school. Conventional personal dates are approximate.',
      zh: '《墨子》是墨家学派的复合文本。通行的个人纪年是近似的。',
    },
    traditionSlugs: ['mohism', 'consequentialism', 'communal-thought'],
    themes: [
      { en: 'Impartial concern', zh: '兼爱' },
      { en: 'Benefit and harm', zh: '利与害' },
      { en: 'Against wasteful ritual', zh: '反对靡费之礼' },
    ],
    biography: {
      en: 'Mozi and the Mohist school argue for an impartial concern — jian ai — and evaluate practices by the benefits and harms they bring to the world. The Mohists criticize Confucian partiality and elaborate funerals on those grounds. Later Mohist chapters also contain important work in logic, language, and optics. Comparing jian ai with British utilitarianism is a real scholarly topic and not an identity. The school is not a consequence of Western consequentialism.',
      zh: '墨子与墨家主张兼爱，并以实践给世界带来的利与害来评价它们。墨家据此批评儒家的差等之爱与厚葬。后期墨家篇章还包含逻辑、语言与光学上的重要工作。把兼爱与英国功利主义相比较，是一个真实的学术题目，而不是一种等同。这个学派不是西方后果论的一个后果。',
    },
    works: [
      { title: { en: 'Mozi', zh: '《墨子》' }, detail: { en: 'A composite school text. The chapters on impartial caring are the usual moral starting point; their exact numbering is an editorial matter.', zh: '一部学派的复合文本。兼爱诸篇是通常的道德起点；它们的确切篇次是一个编辑问题。' } },
    ],
    questions: [
      { en: 'If concern should be impartial, what happens to the duties you have because of who is near you?', zh: '如果关切应当是无差等的，那些因为谁在你近旁而产生的义务会怎样？' },
    ],
    dimensions: ['ethics', 'society'],
    readingNote: {
      en: 'Mozi is the atlas’s non-Western neighbor to consequentialism and to a demanding form of common concern. The neighbor is not a translation.',
      zh: '墨子是图谱中后果论的非西方近邻，也是一种要求很高的共同关切的近邻。近邻不是翻译。',
    },
    references: [sep('mohism', 'Stanford Encyclopedia of Philosophy, “Mohism”')],
  },
  {
    slug: 'nagarjuna',
    name: { en: 'Nāgārjuna', zh: '龙树' },
    dates: { en: 'c. 2nd–3rd century CE; the dates are uncertain', zh: '约公元二至三世纪；纪年不确定' },
    datesNote: {
      en: 'Traditional biographies are late and legendary. The conventional scholarly range is roughly the second or third century CE.',
      zh: '传统传记较晚而且带有传说。通行的学术范围大约是公元二世纪或三世纪。',
    },
    traditionSlugs: ['madhyamaka'],
    themes: [
      { en: 'Emptiness', zh: '空性' },
      { en: 'The two truths', zh: '二谛' },
      { en: 'Dependent arising', zh: '缘起' },
    ],
    biography: {
      en: 'Nāgārjuna is the central philosopher of Madhyamaka Buddhism. The Mūlamadhyamakakārikā argues that things lack inherent existence and that this emptiness is tied to dependent arising, not to the claim that nothing exists and not to the claim that mind is the only substance. The doctrine of two truths distinguishes conventional truth from ultimate truth without licensing a casual “everything is an illusion.” He is in this atlas as a correction to any story in which ontology is only a European choice between matter and mind.',
      zh: '龙树是中观佛教的核心哲学家。《中论》主张诸法无自性，而且这一空性系于缘起，既不是“什么都不存在”的主张，也不是“心灵是唯一实体”的主张。二谛区分世俗谛与胜义谛，但并不许可一种随意的“一切都是幻觉”。他出现在这个图谱中，是为了纠正任何把本体论仅仅说成欧洲人在物质与心灵之间作选择的故事。',
    },
    works: [
      { title: { en: 'Mūlamadhyamakakārikā', zh: '《中论》' }, detail: { en: 'The fundamental verses on the middle way. Chapter attributions and commentaries are a large scholarly field of their own.', zh: '关于中道的根本偈颂。分品与注释本身就是一大片学术领域。' } },
    ],
    questions: [
      { en: 'If nothing has inherent existence, what is the difference between that claim and “only minds are real”?', zh: '如果没有什么具有自性，这一主张与“只有心灵是真实的”差别在哪里？' },
    ],
    dimensions: ['ontology', 'epistemology'],
    readingNote: {
      en: 'Do not place Nāgārjuna on the idealism pole. The page exists so that the pole is not mistaken for the whole of non-physicalist thought.',
      zh: '不要把龙树放在观念论一极上。这个页面的存在，是为了使这一极不被误认为非物理主义思想的全部。',
    },
    references: [sep('nagarjuna', 'Stanford Encyclopedia of Philosophy, “Nāgārjuna”'), sep('madhyamaka', 'Stanford Encyclopedia of Philosophy, “Madhyamaka”')],
  },
];

export function getPhilosopher(slug: string): Philosopher | undefined {
  return philosophers.find((philosopher) => philosopher.slug === slug);
}
