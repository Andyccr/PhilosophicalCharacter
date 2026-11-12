import { familyIdForPoles } from '@/data/archetypes/families';
import { DIMENSION_IDS, POLE_LETTERS } from '@/lib/scoring/config';
import type { DimensionId, Localized, PoleSide } from '@/types/model';

export interface ArchetypeSeed {
  code: string;
  name: Localized;
  thesis: Localized;
}

const sideText = {
  ontology: {
    left: {
      strength: {
        en: 'You keep explanations answerable to a world that can resist them.',
        zh: '你让每一种解释都对一个会抗拒它的世界负责。',
      },
      blind: {
        en: 'You may decide too quickly that a physical description has already said what experience is.',
        zh: '你也许过快断定，一份物理描述已经说尽了经验是什么。',
      },
    },
    right: {
      strength: {
        en: 'You refuse to treat consciousness as an embarrassment to be defined away.',
        zh: '你拒绝把意识当作一个可以用定义打发掉的麻烦。',
      },
      blind: {
        en: 'You may underweight the ways a mind-independent world corrects a cherished picture.',
        zh: '你也许低估了一个独立于心灵的世界如何纠正一幅你所珍爱的图景。',
      },
    },
  },
  epistemology: {
    left: {
      strength: {
        en: 'You let observation revise a theory that was pleasant to believe.',
        zh: '你让观察去修正一个相信起来很舒服的理论。',
      },
      blind: {
        en: 'You may wait for more data when the trouble is already in the question being asked.',
        zh: '当麻烦本就出在所问的问题里时，你也许仍在等待更多数据。',
      },
    },
    right: {
      strength: {
        en: 'You look for the difference between a coincidence and a reason.',
        zh: '你寻找巧合与理由之间的差别。',
      },
      blind: {
        en: 'You may trust an elegant argument after the world has already spoken against it.',
        zh: '即使世界已经说出了反对，你也许仍信任一个优美的论证。',
      },
    },
  },
  ethics: {
    left: {
      strength: {
        en: 'You keep harm and benefit in view when a principle starts to feel abstract.',
        zh: '当一条原则开始显得抽象时，你仍把伤害与益处放在眼前。',
      },
      blind: {
        en: 'You may talk yourself into using a person once the sum looks favorable.',
        zh: '一旦总额看起来划算，你也许就会说服自己去利用一个人。',
      },
    },
    right: {
      strength: {
        en: 'You notice when a welcome result would be bought by a wrongful act.',
        zh: '当一个令人乐见的结果要以一个不正当的行为为代价时，你会觉察到这一点。',
      },
      blind: {
        en: 'You may hold a rule so firmly that the harm of keeping it leaves the picture.',
        zh: '你也许把一条规则守得太死，以至于遵守它的害处淡出了视野。',
      },
    },
  },
  agency: {
    left: {
      strength: {
        en: 'You take the causes of character seriously, including the ones no one chose.',
        zh: '你认真对待品格的形成原因，包括那些无人选择的原因。',
      },
      blind: {
        en: 'You may conclude too quickly that a caused act leaves nothing to call responsibility.',
        zh: '你也许过快断定，一个有其原因的行为就不再有任何可以称为责任的东西。',
      },
    },
    right: {
      strength: {
        en: 'You protect the thought that a person can be the source of a turn not already written.',
        zh: '你守护着这个想法：一个人可以成为某个尚未被写定的转折的源头。',
      },
      blind: {
        en: 'You may ignore how much of a choice arrives already shaped.',
        zh: '你也许忽略了，一个选择在到来时，有多少早已被塑好了形状。',
      },
    },
  },
  meaning: {
    left: {
      strength: {
        en: 'You can care about a value you did not happen to prefer.',
        zh: '你能够在意一种你并非碰巧偏好的价值。',
      },
      blind: {
        en: 'You may treat your reading of what was “already there” as if it were not also an interpretation.',
        zh: '你也许把自己对“早已在那里”之物的解读，当作仿佛那并不也是一种解释。',
      },
    },
    right: {
      strength: {
        en: 'You take a sustained commitment to be capable of giving a life weight.',
        zh: '你相信一种持久的承诺能够给一种生活以分量。',
      },
      blind: {
        en: 'You may underdescribe the standards a project answers to that its author did not create. This pole is not nihilism.',
        zh: '你也许没有充分说明，一个计划所要回应的那些标准，并非其作者所创造。这一端并不是虚无主义。',
      },
    },
  },
  society: {
    left: {
      strength: {
        en: 'You refuse to dissolve a person into a collective aim.',
        zh: '你拒绝把一个人消解进一个集体目标里。',
      },
      blind: {
        en: 'You may understate debts and dependencies that were never the product of consent.',
        zh: '你也许轻描淡写了那些从来不是同意之产物的亏欠与依赖。',
      },
    },
    right: {
      strength: {
        en: 'You see that a life is formed with others and can owe them something.',
        zh: '你看到，一种生活是与他人一起形成的，并且可以亏欠他们一些东西。',
      },
      blind: {
        en: 'You may let “the community” speak without asking who is unheard inside it.',
        zh: '你也许让“共同体”代言，却不去问其中谁的声音未被听见。',
      },
    },
  },
} as const;

const knowledge: Record<string, Localized> = {
  'left-left': {
    en: 'Reality, on this profile, is a physical order, and observation is what should be able to correct a claim about it. Reasoning organizes what inquiry delivers. It is not pictured as a separate route around the world.',
    zh: '在这一剖面上，实在是一种物理秩序，而观察应当能够纠正关于它的主张。推理负责组织探究所交付的东西，而并不被描绘成一条绕开世界的独立通道。',
  },
  'left-right': {
    en: 'Reality is taken to be physical, and reason is trusted to reach something of its structure. Observation still matters, but a demonstration of what must be so can outweigh a first look.',
    zh: '实在被视为物理的，而理性被相信能够触及它的某种结构。观察仍然重要，但关于“何者必然如此”的证明可以压过最初的一瞥。',
  },
  'right-left': {
    en: 'The physical inventory is not treated as the whole of what is real, and experience is still what disciplines belief. If something more than matter is to be credited, it has to be answerable to a life that can be attended to.',
    zh: '物理的清单并不被当作实在的全部，而经验仍是约束信念的东西。若要承认物质之外还有别的，它就必须对一种能够被留意的具体生活负责。',
  },
  'right-right': {
    en: 'Reality is taken to have a rational depth that is not identical with physical process, and argument is trusted to approach that depth. Experience prompts the inquiry. It is not the final court.',
    zh: '实在被视为具有一种并不等同于物理过程的理性深度，而论证被相信能够逼近这一深度。经验激发探究，但它并不是终审。',
  },
};

const morality: Record<string, Localized> = {
  'left-left': {
    en: 'Acts are judged by what they produce, and they are read as the outcome of earlier conditions. If praise and blame survive, they survive as ways of shaping causes, not as verdicts on an uncaused will.',
    zh: '行为依其产生的结果被评判，也被读作先前条件的结果。若赞扬与责备还留存下来，它们是作为塑造原因的方式留存，而非对一个无因意志的裁决。',
  },
  'left-right': {
    en: 'Acts are judged by what they produce, and the agent is treated as someone who could have produced something else. Responsibility tracks a difference the person could actually have made.',
    zh: '行为依其产生的结果被评判，而行动者被看作一个本可以造出别样结果的人。责任追踪的是这个人本可真正造成的差别。',
  },
  'right-left': {
    en: 'Some acts stay wrong even when their results are better, and the agent is not pictured as standing outside the causal order. The open question is what a duty can require of a will that was going to act as it did.',
    zh: '有些行为即便结果更好也仍是错的，而行动者并不被描绘成置身于因果秩序之外。悬而未决的问题是：一条义务能向一个本来就要如此行动的意志要求什么。',
  },
  'right-right': {
    en: 'Some acts stay wrong even when their results are better, and the agent is treated as able to have refused them. The constraint has force, on this picture, because the person could have honored it.',
    zh: '有些行为即便结果更好也仍是错的，而行动者被看作本可以拒绝它们的人。在这幅图景里，约束之所以有力，正是因为这个人本可以遵从它。',
  },
};

const purpose: Record<string, Localized> = {
  'left-left': {
    en: 'Meaning is something a life answers to, and the one who answers is the person. Other people may help the search. They do not own it.',
    zh: '意义是一种生活所要回应的东西，而作出回应的是这个人自己。他人可以帮忙寻找，却并不拥有这场寻找。',
  },
  'left-right': {
    en: 'Meaning is something a life answers to, and a community is a place where that answer can be recognized and kept. Belonging is part of finding what is worth living for.',
    zh: '意义是一种生活所要回应的东西，而共同体是这份回应得以被辨认、被持守的地方。归属是寻得何为值得活的一部分。',
  },
  'right-left': {
    en: 'Meaning is something a person institutes by commitment. Company can matter, but the authority to give a life its point stays with the one who lives it. This is not a claim that nothing is valuable.',
    zh: '意义是一个人借承诺而确立的东西。同伴固然重要，但赋予生活要旨的权柄仍留在生活者本人手中。这并不等于主张世间并无有价值之物。',
  },
  'right-right': {
    en: 'Meaning is something people institute together. A common project can be genuinely weighty without having been a purpose the universe already had, and without reducing each member to a tool.',
    zh: '意义是人们共同确立的东西。一个共同计划可以真正有分量，而无须曾经是宇宙早已具备的目的，也无须把每个成员降格为工具。',
  },
};

const pressure: Record<string, Localized> = {
  'left-left': {
    en: 'A pressure in this pairing: once outcomes lead and the will is caused, it is easy to replace “who is answerable?” with “what will change the effects?” The replacement may be right. It should be noticed.',
    zh: '这一配对中的张力：一旦由结果领路、意志又被因果决定，就很容易用“什么会改变后果”取代“谁应当负责”。这种取代也许是对的，但应当被察觉。',
  },
  'left-right': {
    en: 'A pressure in this pairing: an open alternative matters because the results could have differed. It is worth asking whether that is the whole of responsibility, or only the part this profile uses.',
    zh: '这一配对中的张力：一种开放的替代可能之所以重要，是因为结果本可以不同。值得追问：这是责任的全部，还是仅仅是这一剖面所采用的那一部分。',
  },
  'right-left': {
    en: 'A pressure in this pairing: a duty that survives a better outcome has to be addressed to a will already in the causal story. Compatibilism is one reading. It is not supplied automatically by the score.',
    zh: '这一配对中的张力：一条在更好结果面前仍成立的义务，必须向一个已身处因果叙事中的意志提出。相容论是其中一种解读，但分数并不会自动给出它。',
  },
  'right-right': {
    en: 'A pressure in this pairing: duty and an open alternative reinforce each other, and they can hide the luck already inside the ability to comply. A free refusal is not yet a full account of fairness.',
    zh: '这一配对中的张力：义务与开放的替代可能彼此加强，却可能掩盖了“能够遵从”本身所蕴含的运气。一次自由的拒绝，还算不上对公平的完整说明。',
  },
};

const reflectionOntology: Record<PoleSide, Localized> = {
  left: {
    en: 'What would count as a reason to say that some part of experience is not captured by a physical description?',
    zh: '什么样的理由，会让你说经验的某一部分并未被一份物理描述所捕获？',
  },
  right: {
    en: 'What would count as the world correcting you, if reality is not independent of mind?',
    zh: '如果实在并不独立于心灵，什么才算是世界在纠正你？',
  },
};

const reflectionKnowledge: Record<PoleSide, Localized> = {
  left: {
    en: 'Where has a careful observation forced you to drop an explanation you wanted to keep?',
    zh: '在哪一次，一次仔细的观察迫使你放下了某个本不想放弃的解释？',
  },
  right: {
    en: 'Which of your convictions about the world would still stand if you had never had the relevant observations, and why?',
    zh: '如果你从未有过相关的观察，你关于世界的哪些信念仍会成立？为什么？',
  },
};

const reflectionMoral: Record<string, Localized> = {
  'left-left': {
    en: 'If a harmful act was going to happen because of earlier causes, what, if anything, is the point of blame beyond changing what happens next?',
    zh: '如果一个有害的行为因先前的原因而注定发生，那么除了改变接下来发生的事，责备还有什么意义——如果还有的话？',
  },
  'left-right': {
    en: 'If a person could have done otherwise, does that matter because the outcomes would have differed, or for some further reason?',
    zh: '如果一个人本可以另作选择，这之所以要紧，是因为结果会不同，还是另有更深的原因？',
  },
  'right-left': {
    en: 'Can a duty bind someone who could not have acted otherwise? What do you mean by “could not”?',
    zh: '一条义务能否约束一个本不可能另作行动的人？你所说的“不可能”又是什么意思？',
  },
  'right-right': {
    en: 'When you say someone should have refused, is that because a better result was available, or because the act was forbidden even if the result had been worse?',
    zh: '当你说某人本应拒绝时，是因为当时有一个更好的结果可得，还是因为这个行为即便结果更糟也是被禁止的？',
  },
};

const reflectionPurpose: Record<string, Localized> = {
  'left-left': {
    en: 'What would it be to find a meaning that is yours, without inventing it and without inheriting it unexamined?',
    zh: '找到一种属于你的意义，既不是发明它，也不是不加审视地继承它——那会是什么？',
  },
  'left-right': {
    en: 'If a community claims to have found what is worth living for, how can a member tell a discovery from pressure?',
    zh: '如果一个共同体声称已找到什么值得为之而活，成员又该如何分辨这是发现，还是压力？',
  },
  'right-left': {
    en: 'What standard, if any, can show that a purpose you created is a bad one?',
    zh: '如果有的话，什么标准能够表明你所创造的一个目的是坏的？',
  },
  'right-right': {
    en: 'How should a group tell that a purpose it created together is one a member may still refuse?',
    zh: '一个群体应当如何判断：某个它共同创造的目的，成员是否仍可以拒绝？',
  },
};

function pair(left: PoleSide, right: PoleSide): string {
  return `${left}-${right}`;
}

export function polesFromCode(code: string): Record<DimensionId, PoleSide> {
  const letters = code.split('');
  if (letters.length !== DIMENSION_IDS.length) throw new Error(`Bad code ${code}`);
  const poles = {} as Record<DimensionId, PoleSide>;
  DIMENSION_IDS.forEach((dimension, index) => {
    const letter = letters[index];
    const marks = POLE_LETTERS[dimension];
    if (letter === marks.left) poles[dimension] = 'left';
    else if (letter === marks.right) poles[dimension] = 'right';
    else throw new Error(`Code ${code} has ${letter ?? 'missing'} at ${dimension}`);
  });
  return poles;
}

export function codeFromPoles(poles: Record<DimensionId, PoleSide>): string {
  return DIMENSION_IDS.map((dimension) => POLE_LETTERS[dimension][poles[dimension]]).join('');
}

export function allCodes(): string[] {
  const codes: string[] = [];
  const ontology = ['M', 'I'] as const;
  const epistemology = ['E', 'R'] as const;
  const ethics = ['C', 'D'] as const;
  const agency = ['D', 'L'] as const;
  const meaning = ['F', 'C'] as const;
  const society = ['I', 'C'] as const;
  for (const o of ontology) {
    for (const e of epistemology) {
      for (const h of ethics) {
        for (const a of agency) {
          for (const m of meaning) {
            for (const s of society) codes.push(`${o}${e}${h}${a}${m}${s}`);
          }
        }
      }
    }
  }
  return codes;
}

export function strengthsFor(poles: Record<DimensionId, PoleSide>): Localized[] {
  return DIMENSION_IDS.map((dimension) => sideText[dimension][poles[dimension]].strength);
}

export function blindSpotsFor(poles: Record<DimensionId, PoleSide>): Localized[] {
  return DIMENSION_IDS.map((dimension) => sideText[dimension][poles[dimension]].blind);
}

export function worldviewFor(poles: Record<DimensionId, PoleSide>): Localized[] {
  return [
    knowledge[pair(poles.ontology, poles.epistemology)]!,
    morality[pair(poles.ethics, poles.agency)]!,
    purpose[pair(poles.meaning, poles.society)]!,
  ];
}

export function personalityFor(poles: Record<DimensionId, PoleSide>): Localized[] {
  return [
    {
      en: 'The reading below follows from how your six philosophical tendencies combine. It describes a way of seeing the world, not a clinical personality type, and not a diagnosis.',
      zh: '以下分析来自你六种哲学倾向的组合方式。它描述的是一种看世界的方式，不是临床人格类型，也不是诊断。',
    },
    ...worldviewFor(poles),
    pressureFor(poles),
  ];
}

export function pressureFor(poles: Record<DimensionId, PoleSide>): Localized {
  return pressure[pair(poles.ethics, poles.agency)]!;
}

export function reflectionFor(poles: Record<DimensionId, PoleSide>): Localized[] {
  return [
    reflectionOntology[poles.ontology],
    reflectionKnowledge[poles.epistemology],
    reflectionMoral[pair(poles.ethics, poles.agency)]!,
    reflectionPurpose[pair(poles.meaning, poles.society)]!,
  ];
}

export function familyOfCode(code: string) {
  return familyIdForPoles(polesFromCode(code));
}
