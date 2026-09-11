/**
 * THE COURTROOM — case engine.
 * Classifies the user's problem, builds problem-specific questions,
 * adapts follow-ups to answers, and produces (entirely unrelated) verdicts.
 */

export type Question = {
  id: string;
  aspect: string;
  text: string;
  hint?: string;
};

export type CategoryId =
  | "procrastination"
  | "academics"
  | "timeManagement"
  | "friendship"
  | "social"
  | "family"
  | "roommate"
  | "decision"
  | "college"
  | "organization"
  | "motivation"
  | "food"
  | "money"
  | "technology"
  | "sleep"
  | "health"
  | "habits"
  | "work"
  | "project"
  | "romance"
  | "general";

type Category = {
  id: CategoryId;
  label: string;
  keywords: string[];
  questions: Question[];
};

const q = (id: string, aspect: string, text: string, hint?: string): Question => ({
  id,
  aspect,
  text,
  hint,
});

const CATEGORIES: Category[] = [
  {
    id: "procrastination",
    label: "Procrastination & Avoidance",
    keywords: [
      "procrastinat",
      "putting off",
      "put off",
      "delay",
      "postpone",
      "avoid",
      "last minute",
      "lazy",
      "keep delaying",
      "can't start",
      "cant start",
      "never start",
    ],
    questions: [
      q("pro-1", "trigger-task", "What kind of task do you find yourself avoiding the most?"),
      q("pro-2", "timing", "At what time of day does the avoiding usually happen?"),
      q("pro-3", "distraction", "What normally pulls your attention away the moment you try to begin?"),
      q(
        "pro-4",
        "bottleneck",
        "Is the hardest part starting, understanding the work, or staying with it once you've begun?",
      ),
      q("pro-5", "pressure", "Do approaching deadlines make it easier or harder for you to begin?"),
      q("pro-6", "attempts", "What have you already tried in order to fix this?"),
      q("pro-7", "cost", "What has this actually cost you so far?"),
    ],
  },
  {
    id: "academics",
    label: "Academics & Study",
    keywords: [
      "study",
      "studying",
      "exam",
      "test",
      "homework",
      "assignment",
      "grade",
      "marks",
      "syllabus",
      "revision",
      "class",
      "lecture",
      "teacher",
      "professor",
      "school",
      "subject",
      "semester",
    ],
    questions: [
      q("aca-1", "scope", "Which subject or piece of work is causing the most trouble right now?"),
      q("aca-2", "method", "How do you currently study for it — notes, videos, practice, group work?"),
      q("aca-3", "environment", "Where do you usually sit down to work, and how well does that place work for you?"),
      q("aca-4", "deadline", "What deadline or date is hanging over this?"),
      q("aca-5", "bottleneck", "Is the difficulty the volume of material, understanding it, or remembering it?"),
      q("aca-6", "support", "Has anyone — a teacher, friend or senior — been asked for help with this yet?"),
      q("aca-7", "outcome", "What result would you consider good enough to stop worrying?"),
    ],
  },
  {
    id: "timeManagement",
    label: "Time Management",
    keywords: [
      "no time",
      "time management",
      "busy",
      "schedule",
      "overwhelm",
      "too much to do",
      "juggl",
      "balance",
      "deadline",
      "late",
      "always running",
      "manage my time",
    ],
    questions: [
      q("tim-1", "load", "What are the main things currently competing for your time?"),
      q("tim-2", "leak", "Where does your day usually slip away without you noticing?"),
      q("tim-3", "planning", "Do you plan your day in advance, and if so, how?"),
      q("tim-4", "priority", "Which of your commitments actually matters most to you?"),
      q("tim-5", "boundary", "Is there anything you've taken on that you could have said no to?"),
      q("tim-6", "energy", "At what point in the day do you have the most energy?"),
    ],
  },
  {
    id: "friendship",
    label: "Friendship",
    keywords: [
      "friend",
      "best friend",
      "friendship",
      "ignoring me",
      "ignore my messages",
      "left me out",
      "stopped talking",
      "fight with",
      "group chat",
      "distant",
    ],
    questions: [
      q("fri-1", "timeline", "How long has this been going on between you?"),
      q("fri-2", "cause", "Did anything happen shortly before things changed?"),
      q("fri-3", "scope", "Is this happening only with you, or with other people too?"),
      q("fri-4", "baseline", "What was your friendship like before this started?"),
      q("fri-5", "attempts", "Have you brought it up with them directly? How did that go?"),
      q("fri-6", "goal", "What outcome would actually satisfy you here?"),
      q("fri-7", "feeling", "What has this situation been doing to you, honestly?"),
    ],
  },
  {
    id: "social",
    label: "Social Situations",
    keywords: [
      "shy",
      "awkward",
      "social",
      "people",
      "party",
      "talk to",
      "anxious around",
      "conversation",
      "introvert",
      "making friends",
      "left out",
      "group",
    ],
    questions: [
      q("soc-1", "setting", "In which situations does this feel worst — small groups, crowds, or one-to-one?"),
      q("soc-2", "moment", "What exactly goes through your head at the difficult moment?"),
      q("soc-3", "exception", "Is there anyone you feel completely comfortable around? What's different there?"),
      q("soc-4", "history", "Has it always been this way, or did something change?"),
      q("soc-5", "attempts", "What have you tried so far to make it easier?"),
      q("soc-6", "goal", "What would 'better' look like for you in practice?"),
    ],
  },
  {
    id: "family",
    label: "Family Matters",
    keywords: [
      "parent",
      "mom",
      "mum",
      "mother",
      "dad",
      "father",
      "family",
      "brother",
      "sister",
      "sibling",
      "relatives",
      "at home they",
    ],
    questions: [
      q("fam-1", "who", "Who in the family is this mainly about?"),
      q("fam-2", "pattern", "Does this come up in a repeating situation, or was it one incident?"),
      q("fam-3", "position", "What is their side of it, as far as you understand it?"),
      q("fam-4", "attempts", "Have you tried talking about it calmly? What happened?"),
      q("fam-5", "stakes", "How much does this affect your daily life at home?"),
      q("fam-6", "goal", "What would you like to be different, realistically?"),
    ],
  },
  {
    id: "roommate",
    label: "Roommates & Shared Living",
    keywords: [
      "roommate",
      "flatmate",
      "housemate",
      "hostel",
      "my charger",
      "borrow",
      "takes my",
      "without asking",
      "dorm",
      "shared room",
      "messy",
    ],
    questions: [
      q("roo-1", "frequency", "How often does this happen?"),
      q("roo-2", "resolution", "Does the situation get put right afterwards, or is it left as it is?"),
      q("roo-3", "confrontation", "Have you already asked them to stop? What did they say?"),
      q("roo-4", "scope", "Is it only this one thing, or does it extend to other belongings and spaces?"),
      q("roo-5", "impact", "How much does it actually disrupt your day?"),
      q("roo-6", "relationship", "How would you describe your relationship with them otherwise?"),
    ],
  },
  {
    id: "decision",
    label: "Decision Making",
    keywords: [
      "decide",
      "decision",
      "choose",
      "choice",
      "should i",
      "which one",
      "confused between",
      "torn between",
      "dilemma",
      "can't pick",
      "cant pick",
      "options",
    ],
    questions: [
      q("dec-1", "options", "What are the options you're weighing up?"),
      q("dec-2", "criteria", "What matters most to you in making this call?"),
      q("dec-3", "lean", "If you had to answer right now, which way would you lean — and why?"),
      q("dec-4", "fear", "What are you most afraid of getting wrong?"),
      q("dec-5", "deadline", "By when does this actually have to be decided?"),
      q("dec-6", "reversible", "How easy would it be to change course later?"),
      q("dec-7", "advice", "What have other people told you to do?"),
    ],
  },
  {
    id: "college",
    label: "College & Future Plans",
    keywords: [
      "college",
      "university",
      "course",
      "admission",
      "career",
      "major",
      "branch",
      "campus",
      "degree",
      "placement",
      "internship",
      "future",
    ],
    questions: [
      q("col-1", "priorities", "What are your top priorities when comparing your options?"),
      q("col-2", "path", "Which courses or career directions are you considering?"),
      q("col-3", "location", "How much do location and travel matter to you?"),
      q("col-4", "money", "How big a factor are fees and affordability?"),
      q("col-5", "opportunity", "What opportunities are you comparing between them?"),
      q("col-6", "regret", "What would you regret most if you chose wrong?"),
      q("col-7", "influence", "Whose opinion is influencing you the most right now?"),
    ],
  },
  {
    id: "organization",
    label: "Organisation & Losing Things",
    keywords: [
      "lose",
      "losing",
      "lost my",
      "misplace",
      "keys",
      "wallet",
      "forget where",
      "messy",
      "clutter",
      "can't find",
      "cant find",
      "disorganis",
      "disorganiz",
      "tidy",
    ],
    questions: [
      q("org-1", "habit", "Where do you normally put the item when you come in?"),
      q("org-2", "frequency", "How often do you notice it's missing?"),
      q("org-3", "recovery", "Where does it usually turn up in the end?"),
      q("org-4", "system", "Is there a fixed place it is supposed to live?"),
      q("org-5", "spread", "Does this happen with other belongings as well?"),
      q("org-6", "context", "What are you usually doing right before it goes missing?"),
    ],
  },
  {
    id: "motivation",
    label: "Motivation & Drive",
    keywords: [
      "motivat",
      "no energy",
      "burnt out",
      "burnout",
      "give up",
      "pointless",
      "don't feel like",
      "dont feel like",
      "bored",
      "stuck",
      "uninspired",
      "lost interest",
    ],
    questions: [
      q("mot-1", "domain", "Which part of your life has the motivation drained out of?"),
      q("mot-2", "before", "When did it last feel different, and what was happening then?"),
      q("mot-3", "physical", "How have your sleep, food and movement been through this period?"),
      q("mot-4", "meaning", "Does the thing you're avoiding still matter to you?"),
      q("mot-5", "smallwin", "What is the smallest version of it you could still manage on a bad day?"),
      q("mot-6", "support", "Is anyone aware of how you've been feeling about it?"),
    ],
  },
  {
    id: "food",
    label: "Food & Eating",
    keywords: [
      "eat",
      "eating",
      "food",
      "cook",
      "meal",
      "snack",
      "hungry",
      "diet",
      "junk",
      "skip breakfast",
      "canteen",
      "mess food",
      "order out",
    ],
    questions: [
      q("foo-1", "pattern", "What does a typical day of eating look like for you?"),
      q("foo-2", "trigger", "When are you most likely to slip into the habit you're describing?"),
      q("foo-3", "constraint", "Is the limit time, money, cooking skill, or availability?"),
      q("foo-4", "effect", "How does it leave you feeling afterwards?"),
      q("foo-5", "attempts", "What have you already changed or tried to change about it?"),
      q("foo-6", "goal", "What would a good week of eating look like for you?"),
    ],
  },
  {
    id: "money",
    label: "Money",
    keywords: [
      "money",
      "broke",
      "spend",
      "spending",
      "save",
      "saving",
      "budget",
      "expensive",
      "afford",
      "rupees",
      "salary",
      "allowance",
      "debt",
      "loan",
    ],
    questions: [
      q("mon-1", "flow", "Where does most of your money actually go each month?"),
      q("mon-2", "trigger", "What kind of spending do you later regret?"),
      q("mon-3", "tracking", "Do you track what you spend in any way?"),
      q("mon-4", "income", "Is your incoming amount steady or unpredictable?"),
      q("mon-5", "target", "Is there something specific you're trying to afford or avoid?"),
      q("mon-6", "attempts", "What have you already tried to bring it under control?"),
    ],
  },
  {
    id: "technology",
    label: "Technology & Devices",
    keywords: [
      "phone",
      "laptop",
      "computer",
      "wifi",
      "internet",
      "app",
      "screen time",
      "instagram",
      "tiktok",
      "youtube",
      "scrolling",
      "device",
      "software",
      "battery",
      "charger",
      "social media",
    ],
    questions: [
      q("tec-1", "device", "Which device or app is at the centre of this?"),
      q("tec-2", "when", "When during the day does it become a problem?"),
      q("tec-3", "duration", "How long has it been like this?"),
      q("tec-4", "attempts", "What have you already tried — settings, limits, deleting things?"),
      q("tec-5", "impact", "What is it actually getting in the way of?"),
      q("tec-6", "alternative", "What would you rather be doing with that time or attention?"),
    ],
  },
  {
    id: "sleep",
    label: "Sleep",
    keywords: [
      "sleep",
      "insomnia",
      "tired",
      "wake up",
      "waking",
      "late night",
      "can't sleep",
      "cant sleep",
      "oversleep",
      "alarm",
      "nap",
      "exhausted",
    ],
    questions: [
      q("sle-1", "schedule", "What time do you usually get into bed, and what time do you actually fall asleep?"),
      q("sle-2", "prebed", "What are you doing in the hour before bed?"),
      q("sle-3", "quality", "Do you sleep through, or wake during the night?"),
      q("sle-4", "morning", "How do the mornings go as a result?"),
      q("sle-5", "duration", "How long has your sleep been like this?"),
      q("sle-6", "attempts", "What have you tried already to fix it?"),
    ],
  },
  {
    id: "health",
    label: "Wellbeing & Routine",
    keywords: [
      "gym",
      "exercise",
      "workout",
      "fit",
      "weight",
      "health",
      "stress",
      "anxious",
      "anxiety",
      "overthink",
      "headache",
      "posture",
      "running",
    ],
    questions: [
      q("hea-1", "current", "What does your current routine around this look like?"),
      q("hea-2", "onset", "When did you first notice it becoming an issue?"),
      q("hea-3", "pattern", "Are there days when it's noticeably better or worse?"),
      q("hea-4", "obstacle", "What is the single biggest thing standing in your way?"),
      q("hea-5", "attempts", "What have you already tried?"),
      q("hea-6", "goal", "What would you like your week to look like instead?"),
    ],
  },
  {
    id: "habits",
    label: "Habits",
    keywords: [
      "habit",
      "every day i",
      "keep doing",
      "can't stop",
      "cant stop",
      "addicted",
      "routine",
      "streak",
      "quit",
      "bite my",
      "again and again",
    ],
    questions: [
      q("hab-1", "shape", "How exactly does the habit play out, start to finish?"),
      q("hab-2", "cue", "What tends to happen right before it starts?"),
      q("hab-3", "reward", "What do you get out of it in the moment?"),
      q("hab-4", "history", "How long has it been part of your routine?"),
      q("hab-5", "attempts", "What have you tried in order to break or build it?"),
      q("hab-6", "replacement", "What could realistically take its place?"),
    ],
  },
  {
    id: "work",
    label: "Work & Job",
    keywords: [
      "job",
      "boss",
      "manager",
      "office",
      "work",
      "colleague",
      "client",
      "shift",
      "intern",
      "resign",
      "promotion",
      "workplace",
      "team lead",
    ],
    questions: [
      q("wor-1", "situation", "What's the situation at work in a few lines?"),
      q("wor-2", "people", "Who else is involved, and what is their role in it?"),
      q("wor-3", "duration", "How long has it been like this?"),
      q("wor-4", "escalation", "Has it been raised with anyone above you?"),
      q("wor-5", "impact", "How is it affecting your work or your evenings?"),
      q("wor-6", "goal", "What resolution would you accept?"),
    ],
  },
  {
    id: "project",
    label: "Projects & Deadlines",
    keywords: [
      "project",
      "deadline",
      "team",
      "group project",
      "presentation",
      "submission",
      "build",
      "code",
      "bug",
      "not working",
      "teammate",
      "partner isn't",
    ],
    questions: [
      q("prj-1", "scope", "What is the project, and what stage is it at?"),
      q("prj-2", "blocker", "What specifically is blocking progress right now?"),
      q("prj-3", "team", "Who else is responsible, and are they pulling their weight?"),
      q("prj-4", "deadline", "When is it due, and how firm is that date?"),
      q("prj-5", "attempts", "What have you tried in order to unblock it?"),
      q("prj-6", "minimum", "What would the minimum acceptable version look like?"),
    ],
  },
  {
    id: "romance",
    label: "Relationships",
    keywords: [
      "crush",
      "girlfriend",
      "boyfriend",
      "partner",
      "date",
      "dating",
      "relationship",
      "breakup",
      "broke up",
      "ex ",
      "love",
      "likes me",
    ],
    questions: [
      q("rom-1", "state", "Where do things stand between you at the moment?"),
      q("rom-2", "timeline", "How long has the situation been like this?"),
      q("rom-3", "signals", "What have they actually said or done that you're going on?"),
      q("rom-4", "communication", "Has any of this been said out loud between you?"),
      q("rom-5", "wants", "What do you actually want to happen here?"),
      q("rom-6", "fear", "What's stopping you from doing that?"),
    ],
  },
  {
    id: "general",
    label: "General Matter",
    keywords: [],
    questions: [
      q("gen-1", "detail", "Describe how this usually plays out, step by step."),
      q("gen-2", "duration", "How long has this been going on?"),
      q("gen-3", "people", "Is anyone else involved or affected by it?"),
      q("gen-4", "trigger", "What tends to happen right before it becomes a problem?"),
      q("gen-5", "impact", "What is it stopping you from doing?"),
      q("gen-6", "attempts", "What have you already tried about it?"),
      q("gen-7", "goal", "What would count as this being resolved?"),
      q("gen-8", "urgency", "How urgently does this need to be sorted out?"),
    ],
  },
];

/** Adaptive follow-ups triggered by what the user says in an answer. */
const ADAPTIVE: { keywords: string[]; question: Question }[] = [
  {
    keywords: ["phone", "instagram", "reels", "scroll", "tiktok", "youtube", "snapchat"],
    question: q("adp-phone", "adaptive-device", "You mentioned your phone — where is it physically while you're trying to focus?"),
  },
  {
    keywords: ["night", "late", "2am", "midnight", "3am", "insomnia"],
    question: q("adp-night", "adaptive-night", "You mentioned late nights — how does that hour affect your judgement at the time?"),
  },
  {
    keywords: ["nothing", "never tried", "not really", "no idea", "dunno", "don't know", "dont know"],
    question: q("adp-untried", "adaptive-untried", "Nothing tried so far, then — what has stopped you from attempting anything?"),
  },
  {
    keywords: ["stress", "anxious", "anxiety", "panic", "overwhelm", "pressure"],
    question: q("adp-stress", "adaptive-stress", "You mentioned pressure — where do you feel it most, and when does it lift?"),
  },
  {
    keywords: ["friend", "they", "them", "he ", "she ", "roommate", "partner"],
    question: q("adp-other", "adaptive-other", "How do you think the other person would describe this same situation?"),
  },
  {
    keywords: ["money", "cost", "expensive", "afford", "fees"],
    question: q("adp-money", "adaptive-money", "You brought up cost — how much does that constrain what you can do here?"),
  },
  {
    keywords: ["time", "busy", "no time", "schedule"],
    question: q("adp-time", "adaptive-time", "You mentioned time — what would have to be dropped to make room for a fix?"),
  },
  {
    keywords: ["tried", "attempted", "worked for a while", "failed"],
    question: q("adp-tried", "adaptive-tried", "Of the things you've tried, which came closest to working, and why did it stop?"),
  },
];

export type Classification = {
  category: CategoryId;
  label: string;
  confidence: number;
  secondary?: CategoryId;
};

export function classifyProblem(problem: string): Classification {
  const text = ` ${problem.toLowerCase()} `;
  const scores = CATEGORIES.filter((c) => c.keywords.length).map((c) => {
    let score = 0;
    for (const k of c.keywords) if (text.includes(k)) score += k.includes(" ") ? 3 : 2;
    return { id: c.id, label: c.label, score };
  });
  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  if (!top || top.score === 0) {
    return { category: "general", label: "General Matter", confidence: 0.4 };
  }
  return {
    category: top.id,
    label: top.label,
    confidence: Math.min(0.97, 0.55 + top.score * 0.08),
    secondary: scores[1] && scores[1].score > 0 ? scores[1].id : undefined,
  };
}

function byId(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483647;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hash(str: string): number {
  let h = 7;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 2147483647;
  return h;
}

/** Build the initial 4–7 problem-specific questions, all on distinct aspects. */
export function buildQuestions(problem: string, classification: Classification): Question[] {
  const seed = hash(problem);
  const primary = byId(classification.category);
  const secondary = classification.secondary ? byId(classification.secondary) : undefined;
  const general = byId("general");

  const chosen: Question[] = [];
  const aspects = new Set<string>();
  const push = (item: Question) => {
    if (aspects.has(item.aspect) || chosen.some((c) => c.id === item.id)) return;
    aspects.add(item.aspect);
    chosen.push(item);
  };

  const target = 4 + (seed % 3); // 4–6 base questions
  // Keep the first primary question stable (it frames the case), shuffle the rest.
  const primaryPool = [primary.questions[0], ...shuffle(primary.questions.slice(1), seed)];
  primaryPool.forEach(push);
  if (chosen.length < target && secondary) shuffle(secondary.questions, seed + 5).forEach(push);
  if (chosen.length < target) shuffle(general.questions, seed + 11).forEach(push);

  return chosen.slice(0, Math.max(4, Math.min(target, chosen.length)));
}

/**
 * Given an answer, optionally return an extra question worth asking.
 * Never repeats an aspect already covered.
 */
export function adaptiveFollowUp(answer: string, usedAspects: string[]): Question | null {
  const text = ` ${answer.toLowerCase()} `;
  if (text.trim().length < 4) return null;
  for (const entry of ADAPTIVE) {
    if (usedAspects.includes(entry.question.aspect)) continue;
    if (entry.keywords.some((k) => text.includes(k))) return entry.question;
  }
  return null;
}

/** Appeal questions: still relevant, but freshly angled. */
export function buildAppealQuestions(
  classification: Classification,
  usedAspects: string[],
  round: number,
): Question[] {
  const pool = [
    ...byId(classification.category).questions,
    ...byId("general").questions,
  ].filter((item) => !usedAspects.includes(item.aspect));
  const extra: Question[] = [
    q("apl-1", "appeal-ground", "On what grounds do you dispute the court's earlier decision?"),
    q("apl-2", "appeal-omission", "What did you leave out of your original statement that the court should know?"),
    q("apl-3", "appeal-expectation", "What were you expecting the court to tell you to do?"),
  ].filter((item) => !usedAspects.includes(item.aspect));
  const picks = shuffle(pool, round * 97 + 3).slice(0, 1);
  return [...extra.slice(0, 1), ...picks].slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  Verdicts — deliberately, gloriously unrelated                      */
/* ------------------------------------------------------------------ */

export type Verdict = { ruling: string; order: string };

const VERDICTS: Verdict[] = [
  { ruling: "BUY A CABBAGE.", order: "Place it somewhere visible and contemplate its career trajectory." },
  { ruling: "ROTATE YOUR PILLOW 90 DEGREES.", order: "The court sees no reason why your pillow should remain uninvolved." },
  { ruling: "DRAW A HORSE.", order: "The court expects improvement." },
  { ruling: "COUNT EVERY CHAIR IN YOUR HOUSE.", order: "Return to this matter once the census is complete." },
  { ruling: "STAND NEXT TO A WINDOW FOR 47 SECONDS.", order: "Observe nothing in particular." },
  { ruling: "NAME A SPOON.", order: "The name must be formal. No nicknames will be recognised." },
  { ruling: "WALK BACKWARDS INTO ONE ROOM.", order: "One room only. The court is not unreasonable." },
  { ruling: "ALPHABETISE THREE OBJECTS.", order: "They need not be related. They need not be yours." },
  { ruling: "APOLOGISE TO A DOOR.", order: "Sincerity will be assessed at a later hearing." },
  { ruling: "PUT ONE SOCK ON INSIDE OUT.", order: "Proceed with your day as though nothing has occurred." },
  { ruling: "MEMORISE THE CEILING.", order: "You will not be tested. That is not the point." },
  { ruling: "DRINK A GLASS OF WATER AT AN UNUSUAL ANGLE.", order: "Do not spill. The court is watching." },
  { ruling: "FOLD A PIECE OF PAPER SEVEN TIMES.", order: "Failure is expected and has been factored in." },
  { ruling: "GREET THE NEAREST PLANT BY TITLE.", order: "Use its full honorific. It has waited long enough." },
  { ruling: "REARRANGE YOUR SHOES BY MOOD.", order: "Your reasoning need not be defended." },
  { ruling: "SIT IN A DIFFERENT CHAIR THAN USUAL.", order: "Reflect on how little it changes." },
  { ruling: "WHISTLE ONE NOTE, ONCE.", order: "The court will not specify which note." },
  { ruling: "WRITE THE WORD 'ONWARD' ON A STICKY NOTE.", order: "Attach it to something that cannot read." },
  { ruling: "STARE AT A CLOUD UNTIL IT LEAVES.", order: "If there are no clouds, the case is adjourned until there are." },
  { ruling: "TURN A BOOK AROUND ON THE SHELF.", order: "Do not explain this to anyone in your household." },
  { ruling: "EAT ONE BISCUIT IN COMPLETE SILENCE.", order: "Chewing is permitted. Commentary is not." },
  { ruling: "PLACE A COIN ON A FLAT SURFACE.", order: "Leave it. It is no longer your concern." },
  { ruling: "LEARN THE NAME OF ONE CLOUD TYPE.", order: "Cumulus is considered too easy by this bench." },
  { ruling: "REORGANISE ONE DRAWER, THEN STOP.", order: "The remaining drawers are outside the court's jurisdiction." },
  { ruling: "SAY 'INDEED' OUT LOUD, WITH CONVICTION.", order: "Once only. Repetition weakens the effect." },
  { ruling: "TAKE A PHOTOGRAPH OF A CORNER.", order: "Any corner. The court trusts your instincts here alone." },
  { ruling: "HOLD AN ICE CUBE UNTIL IT BECOMES INTERESTING.", order: "It will not become interesting. Continue anyway." },
  { ruling: "WATER SOMETHING THAT DOES NOT NEED IT.", order: "Within reason. Electrical items are excluded." },
  { ruling: "INVENT A UNIT OF MEASUREMENT.", order: "Use it once in conversation and never again." },
  { ruling: "SIT ON THE FLOOR FOR NO STATED REASON.", order: "If questioned, cite this ruling." },
  { ruling: "PUT A HAT ON SOMETHING THAT IS NOT A HEAD.", order: "The court declines to elaborate." },
  { ruling: "READ THE LAST PAGE OF A BOOK YOU HAVE NOT STARTED.", order: "The consequences are yours alone." },
  { ruling: "TIME HOW LONG YOU CAN AVOID BLINKING.", order: "Record the figure. Report it to no one." },
  { ruling: "MOVE A LAMP SLIGHTLY TO THE LEFT.", order: "Slightly. The court was very clear." },
  { ruling: "COMPLIMENT A VEGETABLE.", order: "Specificity is encouraged; flattery is not." },
  { ruling: "STAND UP AND SIT BACK DOWN, DELIBERATELY.", order: "Both actions must be performed with equal ceremony." },
  { ruling: "LABEL ONE ITEM CORRECTLY.", order: "Something already obvious. The court values clarity." },
  { ruling: "HUM THE THEME OF A SHOW THAT DOES NOT EXIST.", order: "It must have four notes. No more." },
  { ruling: "ARRANGE THREE PENS IN ORDER OF SENIORITY.", order: "Length is not seniority. Think harder." },
  { ruling: "OPEN A WINDOW AND CLOSE IT AGAIN.", order: "The air has been consulted and had nothing to add." },
  { ruling: "GIVE ONE OBJECT IN YOUR ROOM A PROMOTION.", order: "Inform it privately. Others may become resentful." },
  { ruling: "COUNT TO THIRTY IN A LANGUAGE YOU DO NOT SPEAK.", order: "Accuracy is not among the court's requirements." },
];

const REASONINGS = [
  "After careful examination of the testimony, the contributing circumstances, and the evidence entered into the record, the court has determined that the recommended intervention represents the most appropriate course of action available at this time.",
  "Having weighed the submissions of the claimant against the established facts of the matter, and finding no procedural irregularity in the proceedings, the court considers the above measure proportionate, timely and final.",
  "The bench has reviewed the full case record, applied the relevant standards of consideration, and satisfied itself that the ordered remedy addresses the matter to the fullest extent the court is prepared to.",
  "Upon consolidation of the case details and a thorough examination of the identified behavioural patterns, the court finds that the intervention set out above is both necessary and sufficient in the circumstances presented.",
  "In light of the answers provided, the court is persuaded that no lesser measure would serve the interests of resolution, and accordingly directs the claimant to comply without delay.",
];

const SARCASM = [
  "We trust this resolves everything.",
  "The court has done its part.",
  "Further complaints may be submitted to absolutely no one.",
  "The court will not be taking questions at this time.",
  "You presented the problem. We provided the solution. What more could you possibly want?",
  "The matter is settled to the court's own satisfaction, which is the only satisfaction on record.",
  "Any dissatisfaction should be directed inward, quietly.",
  "The bench considers this an excellent outcome and will hear nothing else.",
];

export function pickVerdict(exclude: string[] = []): Verdict {
  const pool = VERDICTS.filter((v) => !exclude.includes(v.ruling));
  const source = pool.length ? pool : VERDICTS;
  return source[Math.floor(Math.random() * source.length)];
}

export function pickReasoning(): string {
  return REASONINGS[Math.floor(Math.random() * REASONINGS.length)];
}

export function pickSarcasm(count = 2): string[] {
  const shuffled = [...SARCASM].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const ACKS = [
  "Noted.",
  "Added to the record.",
  "The court acknowledges this information.",
  "Relevant.",
  "Proceed.",
  "Entered into evidence.",
  "The bench is listening.",
];

export function pickAck(): string {
  return ACKS[Math.floor(Math.random() * ACKS.length)];
}

export function generateCaseNumber(): string {
  return `CR-${Math.floor(10000 + Math.random() * 89999)}`;
}

export const EVIDENCE_LABELS = [
  "Submitted Problem",
  "User Testimony",
  "Relevant Circumstances",
  "Behavioural Information",
  "Supporting Statements",
  "Additional Disclosure",
  "Supplementary Record",
  "Appellate Submission",
];
