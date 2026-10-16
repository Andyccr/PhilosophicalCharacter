import type { DimensionId, FamilyDefinition, FamilyId, Localized, PoleSide } from '@/types/model';

export const FAMILY_ORDER = [
  'explorers',
  'harmonists',
  'creators',
  'pragmatists',
  'seekers',
  'guardians',
  'transcendents',
  'architects',
] as const satisfies readonly FamilyId[];

/**
 * Families are an editorial map, not a statistical cluster.
 * The family is fixed by three axes only:
 * ontology (physicalism M / idealism I),
 * meaning (discovery F / creation C),
 * society (individual I / communal C).
 * Epistemology, ethics, and agency distinguish members inside a family.
 */
export const FAMILY_KEY: Record<string, FamilyId> = {
  MFI: 'explorers',
  MFC: 'harmonists',
  MCI: 'creators',
  MCC: 'pragmatists',
  IFI: 'seekers',
  IFC: 'guardians',
  ICI: 'transcendents',
  ICC: 'architects',
};

export function familyKey(poles: Record<DimensionId, PoleSide>): string {
  const ontology = poles.ontology === 'left' ? 'M' : 'I';
  const meaning = poles.meaning === 'left' ? 'F' : 'C';
  const society = poles.society === 'left' ? 'I' : 'C';
  return `${ontology}${meaning}${society}`;
}

export function familyIdForPoles(poles: Record<DimensionId, PoleSide>): FamilyId {
  const key = familyKey(poles);
  const family = FAMILY_KEY[key];
  if (!family) throw new Error(`No family for key ${key}`);
  return family;
}

export const families: Record<FamilyId, FamilyDefinition> = {
  explorers: {
    id: 'explorers',
    name: { en: 'Explorers', zh: '探问者' },
    rule: {
      en: 'Physicalism, discovered meaning, and the priority of the person.',
      zh: '物理主义、被发现的意义，以及个人优先。',
    },
    essay: {
      en: 'Explorers treat the world as a physical order that can be investigated, and they treat meaning as something a person can find rather than merely declare. The individual, not the crowd, is the one who has to track that finding. Members of this family still divide on whether observation or argument should lead, on whether outcomes or constraints decide a hard case, and on whether the will is fixed by what came before.',
      zh: '探问者把世界看作可以探究的物理秩序，并把意义看作一个人能够发现、而不只是宣布的东西。必须去追踪这一发现的是个人，不是人群。这个家族的成员仍然会在这些问题上分开：应当由观察还是论证来领头，艰难情形由结果还是约束来决定，以及意志是否被先前之事固定。',
    },
  },
  harmonists: {
    id: 'harmonists',
    name: { en: 'Harmonists', zh: '协和者' },
    rule: {
      en: 'Physicalism, discovered meaning, and the priority of the community.',
      zh: '物理主义、被发现的意义，以及共同体优先。',
    },
    essay: {
      en: 'Harmonists look for goods that are already worth recognizing, in a world they take to be physical, and they expect a community to be the place where those goods are kept. Harmony here is not a mood. It is the claim that a shared life can answer to something the members did not vote into being. The family still contains deep disagreements about knowledge, duty, and freedom.',
      zh: '协和者在一个他们视为物理的世界里，寻找已经值得被认出的善，并期望共同体成为保存这些善的地方。这里的协和不是一种情绪。它是这样一个主张：共同生活可以回应某种并非成员投票产生的东西。这个家族内部仍然在知识、义务与自由上有深的分歧。',
    },
  },
  creators: {
    id: 'creators',
    name: { en: 'Creators', zh: '创作者' },
    rule: {
      en: 'Physicalism, created meaning, and the priority of the person.',
      zh: '物理主义、被创造的意义，以及个人优先。',
    },
    essay: {
      en: 'Creators take the furniture of the world to be physical and the point of a life to be something a person institutes. Creation, on this map, is not a shrug and not a claim that nothing matters. It is the claim that weight can come from a commitment the universe did not already contain. What the person owes, and whether they could have committed otherwise, still splits the family.',
      zh: '创作者认为世界的陈设是物理的，而一种生活的要旨是由个人确立的。在这张图上，创造不是耸肩，也不是主张没有什么重要。它主张：分量可以来自一种宇宙原本并不包含的承诺。这个人亏欠什么，以及他们本来是否可以不作此承诺，仍然把这个家族分开。',
    },
  },
  pragmatists: {
    id: 'pragmatists',
    name: { en: 'Pragmatists', zh: '实践者' },
    rule: {
      en: 'Physicalism, created meaning, and the priority of the community.',
      zh: '物理主义、被创造的意义，以及共同体优先。',
    },
    essay: {
      en: 'Pragmatists treat shared purposes as things people build in a material world. The name does not mean “whatever works,” and it does not mean a political party. It means that a common project can be meaningful without being written into the universe, and that the building is done with others. Members still disagree about the role of principle, prediction, and proof.',
      zh: '实践者把共同目的看作人们在物质世界中建造的东西。这个名字并不意味着“只要有用就行”，也不意味着一个政党。它意味着：一个共同计划可以有意义，而不必被写进宇宙；而且这种建造是与他人一起完成的。成员们仍然在原则、预测与证明的角色上彼此不同意。',
    },
  },
  seekers: {
    id: 'seekers',
    name: { en: 'Seekers', zh: '寻求者' },
    rule: {
      en: 'Idealism, discovered meaning, and the priority of the person.',
      zh: '观念论、被发现的意义，以及个人优先。',
    },
    essay: {
      en: 'Seekers do not take the physical inventory to exhaust what is real, and they think a person can search for a meaning that is not merely a private decision. The search is individual. That does not make it arbitrary. Idealism here is a claim about reality or mind, not a synonym for spirituality. Knowledge, moral constraint, and the openness of the will remain open questions inside the family.',
      zh: '寻求者并不认为物理清单穷尽了真实之物，而且他们认为一个人可以寻找一种并不只是私人决定的意义。这一寻找是个人的。这并不使它任意。这里的观念论是关于实在或心灵的主张，不是灵性的同义词。知识、道德约束与意志是否开放，在这个家族内部仍然是未决的问题。',
    },
  },
  guardians: {
    id: 'guardians',
    name: { en: 'Guardians', zh: '守护者' },
    rule: {
      en: 'Idealism, discovered meaning, and the priority of the community.',
      zh: '观念论、被发现的意义，以及共同体优先。',
    },
    essay: {
      en: 'Guardians hold that a community can keep a moral or metaphysical order it did not invent, and that this order is not identical with a physical ledger. Guarding is not the same as refusing every change. It is the claim that some goods are received, shared, and answerable. The family is divided by how those goods are known and by what freedom remains inside them.',
      zh: '守护者认为，一个共同体可以持守一种它并未发明的道德或形而上学秩序，而且这一秩序并不等同于一份物理账册。守护并不等于拒绝一切变化。它主张：有些善是被领受的、被共享的、并且可以被追问的。这个家族的分裂在于这些善如何被认识，以及在它们之内还留下什么样的自由。',
    },
  },
  transcendents: {
    id: 'transcendents',
    name: { en: 'Transcendents', zh: '超越者' },
    rule: {
      en: 'Idealism, created meaning, and the priority of the person.',
      zh: '观念论、被创造的意义，以及个人优先。',
    },
    essay: {
      en: 'Transcendents take mind, meaning, or both to be more basic than a physical script, and they locate the authority to give a life its point in the person. The name is not an honorific and not a claim of mystical rank. It marks a profile in which reality is not merely material and meaning is instituted rather than found. The profile can still be strict about duty or highly concerned with results.',
      zh: '超越者把心灵、意义或二者视为比物理脚本更基本，并把赋予生活要旨的权威放在个人身上。这个名字不是尊称，也不是一种神秘等级的宣称。它标记的是这样一种剖面：实在不只是物质的，意义是被确立的而不是被找到的。这一剖面仍然可以在义务上很严格，或对结果高度关切。',
    },
  },
  architects: {
    id: 'architects',
    name: { en: 'Architects', zh: '建筑师' },
    rule: {
      en: 'Idealism, created meaning, and the priority of the community.',
      zh: '观念论、被创造的意义，以及共同体优先。',
    },
    essay: {
      en: 'Architects hold that shared worlds of meaning are built, and that what is built is not reducible to matter in motion. The building is common. A member is not, on this profile, the sole author of the point of life. Nor does the profile say the building is exempt from duty, evidence, or the causal past. Those are the disagreements that separate one architect from another.',
      zh: '建筑师认为，意义的共享世界是被建造的，而且所建造的东西不能还原为运动中的物质。这种建造是共同的。在这一剖面上，成员并不是生活要旨的唯一作者。这一剖面也并不说这种建造可以免除义务、证据或因果上的过去。正是这些分歧把一位建筑师与另一位分开。',
    },
  },
};

export function familyParagraph(id: FamilyId): Localized {
  return families[id].essay;
}
