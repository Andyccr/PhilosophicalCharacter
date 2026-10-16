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
        zh: '你让解释对一个能够抗拒它们的世界负责。',
      },
      blind: {
        en: 'You may decide too quickly that a physical description has already said what experience is.',
        zh: '你也许过快地认定，一份物理描述已经说出了经验是什么。',
      },
    },
    right: {
      strength: {
        en: 'You refuse to treat consciousness as an embarrassment to be defined away.',
        zh: '你拒绝把意识当成一种应当被定义掉的尴尬。',
      },
      blind: {
        en: 'You may underweight the ways a mind-independent world corrects a cherished picture.',
        zh: '你也许低估了不依赖于心灵的世界纠正一幅珍视图景的方式。',
      },
    },
  },
  epistemology: {
    left: {
      strength: {
        en: 'You let observation revise a theory that was pleasant to believe.',
        zh: '你让观察去修改一个相信起来令人愉快的理论。',
      },
      blind: {
        en: 'You may wait for more data when the trouble is already in the question being asked.',
        zh: '当麻烦已经在所问的问题之中时，你也许仍在等待更多数据。',
      },
    },
    right: {
      strength: {
        en: 'You look for the difference between a coincidence and a reason.',
        zh: '你寻找巧合与理由之间的差别。',
      },
      blind: {
        en: 'You may trust an elegant argument after the world has already spoken against it.',
        zh: '在世界已经说出反对之后，你也许仍然信任一个优美的论证。',
      },
    },
  },
  ethics: {
    left: {
      strength: {
        en: 'You keep harm and benefit in view when a principle starts to feel abstract.',
        zh: '当一条原则开始显得抽象时，你仍然把伤害与益处放在眼前。',
      },
      blind: {
        en: 'You may talk yourself into using a person once the sum looks favorable.',
        zh: '一旦总数看起来有利，你也许会说服自己去使用一个人。',
      },
    },
    right: {
      strength: {
        en: 'You notice when a welcome result would be bought by a wrongful act.',
        zh: '你会注意到，一个受欢迎的结果是否将由一个不正当的行为买来。',
      },
      blind: {
        en: 'You may hold a rule so firmly that the harm of keeping it leaves the picture.',
        zh: '你也许把一条规则握得太紧，以至于遵守它所造成的伤害离开了画面。',
      },
    },
  },
  agency: {
    left: {
      strength: {
        en: 'You take the causes of character seriously, including the ones no one chose.',
        zh: '你严肃对待品格的原因，包括那些无人选择的原因。',
      },
      blind: {
        en: 'You may conclude too quickly that a caused act leaves nothing to call responsibility.',
        zh: '你也许过快地断定，一个有原因的行为就没有什么还可以称为责任。',
      },
    },
    right: {
      strength: {
        en: 'You protect the thought that a person can be the source of a turn not already written.',
        zh: '你维护这样的想法：一个人可以成为一个尚未被写好的转折的来源。',
      },
      blind: {
        en: 'You may ignore how much of a choice arrives already shaped.',
        zh: '你也许忽略了一个选择在到达时已经有多少是被塑造好的。',
      },
    },
  },
  meaning: {
    left: {
      strength: {
        en: 'You can care about a value you did not happen to prefer.',
        zh: '你可以在意一种你并非恰好偏好的价值。',
      },
      blind: {
        en: 'You may treat your reading of what was “already there” as if it were not also an interpretation.',
        zh: '你也许把自己对“已经在那里”的东西的解读，当成仿佛它不是一种解释。',
      },
    },
    right: {
      strength: {
        en: 'You take a sustained commitment to be capable of giving a life weight.',
        zh: '你认为一种持续的承诺能够给予一种生活以分量。',
      },
      blind: {
        en: 'You may underdescribe the standards a project answers to that its author did not create. This pole is not nihilism.',
        zh: '你也许没有充分说明一个计划所要回应的、并非其作者所创造的标准。这一极不是虚无主义。',
      },
    },
  },
  society: {
    left: {
      strength: {
        en: 'You refuse to dissolve a person into a collective aim.',
        zh: '你拒绝把一个人消融进一个集体目标。',
      },
      blind: {
        en: 'You may understate debts and dependencies that were never the product of consent.',
        zh: '你也许低估了那些从来不是同意之产物的亏欠与依赖。',
      },
    },
    right: {
      strength: {
        en: 'You see that a life is formed with others and can owe them something.',
        zh: '你看到一种生活是与他人一起形成的，并且可以亏欠他们某种东西。',
      },
      blind: {
        en: 'You may let “the community” speak without asking who is unheard inside it.',
        zh: '你也许让“共同体”发言，而不问其中谁没有被听见。',
      },
    },
  },
} as const;

const knowledge: Record<string, Localized> = {
  'left-left': {
    en: 'Reality, on this profile, is a physical order, and observation is what should be able to correct a claim about it. Reasoning organizes what inquiry delivers. It is not pictured as a separate route around the world.',
    zh: '在这一剖面上，实在是一种物理秩序，而观察应当能够纠正关于它的主张。推理组织探究所交付的东西。它并没有被描绘成一条绕过世界的单独道路。',
  },
  'left-right': {
    en: 'Reality is taken to be physical, and reason is trusted to reach something of its structure. Observation still matters, but a demonstration of what must be so can outweigh a first look.',
    zh: '实在被视为物理的，而理性被信任为能够触及它的结构中的某种东西。观察仍然重要，但关于“必定如此”的证明可以压过最初的一瞥。',
  },
  'right-left': {
    en: 'The physical inventory is not treated as the whole of what is real, and experience is still what disciplines belief. If something more than matter is to be credited, it has to be answerable to a life that can be attended to.',
    zh: '物理清单并没有被当成真实之物的全部，而经验仍然是约束信念的东西。如果物质之外的某种东西要被承认，它必须对一种可以被留意的生活负责。',
  },
  'right-right': {
    en: 'Reality is taken to have a rational depth that is not identical with physical process, and argument is trusted to approach that depth. Experience prompts the inquiry. It is not the final court.',
    zh: '实在被视为具有一种并不等同于物理过程的理性深度，而论证被信任为能够接近这一深度。经验激发探究。它不是终审。',
  },
};

const morality: Record<string, Localized> = {
  'left-left': {
    en: 'Acts are judged by what they produce, and they are read as the outcome of earlier conditions. If praise and blame survive, they survive as ways of shaping causes, not as verdicts on an uncaused will.',
    zh: '行为依其产生的东西而被判断，并且被读作先前条件的结果。如果赞扬与责备还留下，它们是作为塑造原因的方式留下的，而不是作为对一个无因意志的裁决。',
  },
  'left-right': {
    en: 'Acts are judged by what they produce, and the agent is treated as someone who could have produced something else. Responsibility tracks a difference the person could actually have made.',
    zh: '行为依其产生的东西而被判断，而行动者被看作一个本来可以产生别的东西的人。责任追踪的是这个人本可以实际造成的差别。',
  },
  'right-left': {
    en: 'Some acts stay wrong even when their results are better, and the agent is not pictured as standing outside the causal order. The open question is what a duty can require of a will that was going to act as it did.',
    zh: '有些行为即使结果更好也仍然是错的，而行动者并没有被描绘成站在因果秩序之外。未决的问题是：义务能够向一个本来就会如此行动的意志要求什么。',
  },
  'right-right': {
    en: 'Some acts stay wrong even when their results are better, and the agent is treated as able to have refused them. The constraint has force, on this picture, because the person could have honored it.',
    zh: '有些行为即使结果更好也仍然是错的，而行动者被看作本来能够拒绝它们的人。在这幅图景里，约束之所以有力，是因为这个人本可以遵守它。',
  },
};

const purpose: Record<string, Localized> = {
  'left-left': {
    en: 'Meaning is something a life answers to, and the one who answers is the person. Other people may help the search. They do not own it.',
    zh: '意义是一种生活所要回应的东西，而作出回应的是这个人。他人可以帮助这一寻找。他们并不拥有它。',
  },
  'left-right': {
    en: 'Meaning is something a life answers to, and a community is a place where that answer can be recognized and kept. Belonging is part of finding what is worth living for.',
    zh: '意义是一种生活所要回应的东西，而共同体是这一回答可以被认出并被持守的地方。归属是寻找何为值得活的一部分。',
  },
  'right-left': {
    en: 'Meaning is something a person institutes by commitment. Company can matter, but the authority to give a life its point stays with the one who lives it. This is not a claim that nothing is valuable.',
    zh: '意义是一个人通过承诺而确立的东西。同伴可以重要，但赋予生活要旨的权威留在生活者本人那里。这并不是主张没有什么是有价值的。',
  },
  'right-right': {
    en: 'Meaning is something people institute together. A common project can be genuinely weighty without having been a purpose the universe already had, and without reducing each member to a tool.',
    zh: '意义是人们共同确立的东西。一个共同计划可以真正有分量，而不必曾经是宇宙已经具有的目的，也不必把每个成员还原为工具。',
  },
};

const pressure: Record<string, Localized> = {
  'left-left': {
    en: 'A pressure in this pairing: once outcomes lead and the will is caused, it is easy to replace “who is answerable?” with “what will change the effects?” The replacement may be right. It should be noticed.',
    zh: '这一配对中的压力：一旦由结果领头、意志又是被引起的，就很容易用“什么会改变后果？”替换“谁应当负责？”。这一替换也许是对的。它应当被注意到。',
  },
  'left-right': {
    en: 'A pressure in this pairing: an open alternative matters because the results could have differed. It is worth asking whether that is the whole of responsibility, or only the part this profile uses.',
    zh: '这一配对中的压力：一种开放的替代可能之所以重要，是因为结果本可以不同。值得问的是：这是否就是责任的全部，还是仅仅是这一剖面所使用的那一部分。',
  },
  'right-left': {
    en: 'A pressure in this pairing: a duty that survives a better outcome has to be addressed to a will already in the causal story. Compatibilism is one reading. It is not supplied automatically by the score.',
    zh: '这一配对中的压力：一条在更好的结果面前仍然成立的义务，必须向一个已经处在因果叙述中的意志提出。相容论是一种解读。分数并不会自动提供它。',
  },
  'right-right': {
    en: 'A pressure in this pairing: duty and an open alternative reinforce each other, and they can hide the luck already inside the ability to comply. A free refusal is not yet a full account of fairness.',
    zh: '这一配对中的压力：义务与开放的替代可能互相加强，而它们可以掩盖遵守能力之中已经存在的运气。一次自由的拒绝还不是关于公平的完整说明。',
  },
};

const reflectionOntology: Record<PoleSide, Localized> = {
  left: {
    en: 'What would count as a reason to say that some part of experience is not captured by a physical description?',
    zh: '什么样的理由会让你说，经验的某一部分并没有被一份物理描述捕获？',
  },
  right: {
    en: 'What would count as the world correcting you, if reality is not independent of mind?',
    zh: '如果实在并不独立于心灵，什么算作世界对你的纠正？',
  },
};

const reflectionKnowledge: Record<PoleSide, Localized> = {
  left: {
    en: 'Where has a careful observation forced you to drop an explanation you wanted to keep?',
    zh: '在哪里，一次仔细的观察迫使你放下一个你想保留的解释？',
  },
  right: {
    en: 'Which of your convictions about the world would still stand if you had never had the relevant observations, and why?',
    zh: '如果你从未有过相关的观察，你关于世界的哪些信念仍然成立，为什么？',
  },
};

const reflectionMoral: Record<string, Localized> = {
  'left-left': {
    en: 'If a harmful act was going to happen because of earlier causes, what, if anything, is the point of blame beyond changing what happens next?',
    zh: '如果一个有害行为因先前的原因而将要发生，那么除了改变接下来会发生的事，责备还有什么意义——如果还有的话？',
  },
  'left-right': {
    en: 'If a person could have done otherwise, does that matter because the outcomes would have differed, or for some further reason?',
    zh: '如果一个人本来可以另作选择，这之所以重要，是因为结果会不同，还是因为某种进一步的理由？',
  },
  'right-left': {
    en: 'Can a duty bind someone who could not have acted otherwise? What do you mean by “could not”?',
    zh: '一条义务能否约束一个本来不可能另作行动的人？你所说的“不可能”是什么意思？',
  },
  'right-right': {
    en: 'When you say someone should have refused, is that because a better result was available, or because the act was forbidden even if the result had been worse?',
    zh: '当你说某人应当拒绝时，是因为有一个更好的结果可用，还是因为即使结果更糟，这个行为也是被禁止的？',
  },
};

const reflectionPurpose: Record<string, Localized> = {
  'left-left': {
    en: 'What would it be to find a meaning that is yours, without inventing it and without inheriting it unexamined?',
    zh: '找到一种属于你的意义，既不是发明它，也不是未经审视地继承它，这会是什么样子？',
  },
  'left-right': {
    en: 'If a community claims to have found what is worth living for, how can a member tell a discovery from pressure?',
    zh: '如果一个共同体声称已经找到了什么值得为之生活，一个成员如何分辨发现与压力？',
  },
  'right-left': {
    en: 'What standard, if any, can show that a purpose you created is a bad one?',
    zh: '如果有的话，什么标准能够表明一个你所创造的目的是坏的？',
  },
  'right-right': {
    en: 'How should a group tell that a purpose it created together is one a member may still refuse?',
    zh: '一个群体应当如何辨认：一个它共同创造的目的，仍然是成员可以拒绝的？',
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
