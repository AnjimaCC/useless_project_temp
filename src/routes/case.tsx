import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CaseFileIcon,
  GavelIcon,
  Particles,
  ScalesIcon,
  SealIcon,
} from "@/components/courtroom/visuals";
import {
  EVIDENCE_LABELS,
  adaptiveFollowUp,
  buildAppealQuestions,
  buildQuestions,
  classifyProblem,
  generateCaseNumber,
  pickAck,
  pickReasoning,
  pickSarcasm,
  pickVerdict,
  type Classification,
  type Question,
  type Verdict,
} from "@/lib/courtroom/engine";
import {
  getDraft,
  pastVerdictRulings,
  saveCase,
  type AppealRecord,
  type CaseFile,
  type QA,
} from "@/lib/courtroom/storage";

export const Route = createFileRoute("/case")({
  head: () => ({
    meta: [
      { title: "Hearing in Session — The Courtroom" },
      {
        name: "description",
        content:
          "Your case is before the bench. Answer the court's questions and await the final verdict.",
      },
      { property: "og:title", content: "Hearing in Session — The Courtroom" },
      { property: "og:description", content: "The court is examining your case." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CasePage,
});

type Stage = "intake" | "questions" | "analysis" | "verdict" | "appeal-intro";

const ANALYSIS_STEPS = [
  "CASE DETAILS CONSOLIDATED",
  "CONTRIBUTING FACTORS IDENTIFIED",
  "RESPONSES REVIEWED",
  "PATTERNS EXAMINED",
  "POTENTIAL INTERVENTIONS CONSIDERED",
  "FINAL RECOMMENDATION PREPARED",
];

function CasePage() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState<string | null>(null);
  const [caseNumber] = useState(() => generateCaseNumber());
  const [classification, setClassification] = useState<Classification | null>(null);

  const [stage, setStage] = useState<Stage>("intake");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [ack, setAck] = useState<string | null>(null);

  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [sarcasm, setSarcasm] = useState<string[]>([]);
  const [appeals, setAppeals] = useState<AppealRecord[]>([]);
  const [appealRound, setAppealRound] = useState(0);
  const [baseQA, setBaseQA] = useState<QA[]>([]);
  const savedRef = useRef<CaseFile | null>(null);

  useEffect(() => {
    const p = getDraft();
    if (!p) {
      navigate({ to: "/" });
      return;
    }
    const c = classifyProblem(p);
    setProblem(p);
    setClassification(c);
    setQuestions(buildQuestions(p, c));
  }, [navigate]);

  const currentQA: QA[] = useMemo(
    () =>
      questions.slice(0, answers.length).map((qn, i) => ({
        question: qn.text,
        answer: answers[i] ?? "",
        aspect: qn.aspect,
      })),
    [questions, answers],
  );

  const usedAspects = questions.map((qn) => qn.aspect);

  if (!problem || !classification) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ScalesIcon className="animate-swing h-16 w-16 text-gold" />
      </div>
    );
  }

  const submitAnswer = () => {
    if (draftAnswer.trim().length < 1) return;
    const nextAnswers = [...answers.slice(0, index), draftAnswer.trim()];
    setAnswers(nextAnswers);
    setAck(pickAck());
    window.setTimeout(() => setAck(null), 1400);

    let nextQuestions = questions;
    // Adaptive: let the answer shape what the court asks next.
    if (questions.length < 7 && index >= 1) {
      const follow = adaptiveFollowUp(draftAnswer, usedAspects);
      if (follow) {
        nextQuestions = [...questions.slice(0, index + 1), follow, ...questions.slice(index + 1)];
        setQuestions(nextQuestions);
      }
    }

    setDraftAnswer("");
    if (index + 1 >= nextQuestions.length) {
      startAnalysis(
        nextQuestions.map((qn, i) => ({
          question: qn.text,
          answer: nextAnswers[i] ?? "",
          aspect: qn.aspect,
        })),
      );
    } else {
      setIndex(index + 1);
    }
  };

  const goBack = () => {
    if (index === 0) return;
    setIndex(index - 1);
    setDraftAnswer(answers[index - 1] ?? "");
  };

  const startAnalysis = (qa: QA[]) => {
    if (appealRound === 0) setBaseQA(qa);
    setStage("analysis");
    window.setTimeout(() => deliverVerdict(qa), ANALYSIS_STEPS.length * 900 + 900);
  };

  const deliverVerdict = (qa: QA[]) => {
    const exclude = [
      ...pastVerdictRulings(),
      ...(verdict ? [verdict.ruling] : []),
      ...appeals.map((a) => a.verdict.ruling),
    ];
    const v = pickVerdict(exclude);
    const r = pickReasoning();
    const s = pickSarcasm(3);

    if (appealRound === 0) {
      setVerdict(v);
      setReasoning(r);
      setSarcasm(s);
      const file: CaseFile = {
        caseNumber,
        problem,
        categoryLabel: classification.label,
        qa,
        verdict: v,
        reasoning: r,
        sarcasm: s,
        appeals: [],
        date: new Date().toISOString(),
        status: "CLOSED",
      };
      savedRef.current = file;
      saveCase(file);
    } else {
      const record: AppealRecord = {
        round: appealRound,
        qa,
        verdict: v,
        reasoning: r,
        date: new Date().toISOString(),
      };
      const nextAppeals = [...appeals, record];
      setAppeals(nextAppeals);
      setVerdict(v);
      setReasoning(r);
      setSarcasm(s);
      if (savedRef.current) {
        const file: CaseFile = { ...savedRef.current, appeals: nextAppeals };
        savedRef.current = file;
        saveCase(file);
      }
    }
    setStage("verdict");
  };

  const startAppeal = () => {
    const round = appealRound + 1;
    setAppealRound(round);
    const allAspects = [
      ...baseQA.map((x) => x.aspect),
      ...appeals.flatMap((a) => a.qa.map((x) => x.aspect)),
    ];
    setQuestions(buildAppealQuestions(classification, allAspects, round));
    setAnswers([]);
    setIndex(0);
    setDraftAnswer("");
    setStage("appeal-intro");
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <Particles />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2">
          <ScalesIcon className="h-6 w-6 text-gold" />
          <span className="label-caps text-gold-soft">The Courtroom</span>
        </Link>
        <span className="label-caps rounded-full border border-gold/30 px-3 py-1.5 text-gold-soft">
          CASE #{caseNumber}
        </span>
      </header>

      {stage === "intake" && (
        <Intake
          caseNumber={caseNumber}
          problem={problem}
          category={classification.label}
          onProceed={() => setStage("questions")}
        />
      )}

      {stage === "appeal-intro" && (
        <AppealIntro caseNumber={caseNumber} round={appealRound} onProceed={() => setStage("questions")} />
      )}

      {stage === "questions" && questions.length > 0 && (
        <div className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-[1fr_320px]">
          <QuestionCard
            caseNumber={caseNumber}
            question={questions[index]}
            index={index}
            total={questions.length}
            value={draftAnswer}
            setValue={setDraftAnswer}
            onBack={goBack}
            onSubmit={submitAnswer}
            ack={ack}
            appealRound={appealRound}
          />
          <CaseRecord problem={problem} qa={currentQA} appeals={appeals} />
        </div>
      )}

      {stage === "analysis" && <Analysis />}

      {stage === "verdict" && verdict && (
        <VerdictView
          caseNumber={caseNumber}
          verdict={verdict}
          reasoning={reasoning}
          sarcasm={sarcasm}
          appealRound={appealRound}
          onAppeal={startAppeal}
        />
      )}
    </div>
  );
}

/* ------------------------------- stages -------------------------------- */

function Intake({
  caseNumber,
  problem,
  category,
  onProceed,
}: {
  caseNumber: string;
  problem: string;
  category: string;
  onProceed: () => void;
}) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 pt-6">
      <div className="panel panel-gold animate-rise p-7 text-center sm:p-10">
        <SealIcon className="animate-seal mx-auto h-20 w-20 text-gold" />
        <p className="label-caps mt-5 text-gold-soft">Case #{caseNumber}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-wide text-cream">CASE RECEIVED</h1>
        <p className="mt-2 text-muted-foreground">Your case has been officially submitted.</p>
        <div className="rule-gold my-7" />
        <p className="label-caps text-gold-soft">Case Subject</p>
        <p className="font-display mt-3 text-2xl leading-snug text-cream italic">“{problem}”</p>
        <p className="label-caps mt-4 inline-block rounded-full border border-gold/25 px-3 py-1 text-muted-foreground">
          Filed under: {category}
        </p>
        <div className="rule-gold my-7" />
        <p className="label-caps text-gold-soft">Initial Assessment</p>
        <p className="mt-3 text-muted-foreground">
          Before reaching a conclusion, the court must understand the circumstances.
        </p>
        <button
          onClick={onProceed}
          className="hover-lift mt-8 w-full rounded-xl bg-primary px-6 py-4 font-semibold tracking-[0.15em] text-primary-foreground uppercase"
        >
          Begin Questioning
        </button>
      </div>
    </section>
  );
}

function AppealIntro({
  caseNumber,
  round,
  onProceed,
}: {
  caseNumber: string;
  round: number;
  onProceed: () => void;
}) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 pt-6">
      <div className="panel panel-gold animate-rise p-8 text-center sm:p-10">
        <GavelIcon className="animate-gavel mx-auto h-16 w-16 text-gold" />
        <p className="label-caps mt-5 text-gold-soft">
          Case #{caseNumber} · Appeal {round}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-wide text-cream">APPEAL ACCEPTED</h1>
        <p className="mt-3 text-muted-foreground">The original verdict is currently under review.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The bench requires a small amount of further information before reconsidering.
        </p>
        <button
          onClick={onProceed}
          className="hover-lift mt-8 w-full rounded-xl bg-primary px-6 py-4 font-semibold tracking-[0.15em] text-primary-foreground uppercase"
        >
          Continue Appeal
        </button>
      </div>
    </section>
  );
}

function QuestionCard({
  caseNumber,
  question,
  index,
  total,
  value,
  setValue,
  onBack,
  onSubmit,
  ack,
  appealRound,
}: {
  caseNumber: string;
  question: Question;
  index: number;
  total: number;
  value: string;
  setValue: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  ack: string | null;
  appealRound: number;
}) {
  const pct = Math.round(((index + (value ? 0.5 : 0)) / total) * 100);
  return (
    <div className="panel animate-rise p-6 sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-caps text-gold-soft">CASE #{caseNumber}</span>
        <span className="label-caps text-muted-foreground">
          {appealRound > 0 ? `Appeal ${appealRound} · ` : ""}Question {index + 1} of {total}
        </span>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-input">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${Math.max(6, pct)}%` }}
        />
      </div>

      <div key={question.id} className="animate-rise mt-8">
        <h2 className="font-display text-3xl leading-snug text-cream sm:text-4xl">{question.text}</h2>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          placeholder="Answer for the record…"
          className="mt-6 w-full resize-none rounded-xl border border-gold/25 bg-input/60 p-4 text-base text-cream placeholder:text-muted-foreground/70 focus:border-gold/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
        />
      </div>

      {ack ? <p className="animate-rise mt-3 text-sm text-gold-soft italic">{ack}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onBack}
          disabled={index === 0}
          className="label-caps rounded-xl border border-gold/30 px-6 py-3 text-cream transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="hover-lift label-caps flex-1 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-45"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}

function CaseRecord({
  problem,
  qa,
  appeals,
}: {
  problem: string;
  qa: QA[];
  appeals: AppealRecord[];
}) {
  const items = [
    { label: EVIDENCE_LABELS[0], body: problem },
    ...qa.map((item, i) => ({
      label: EVIDENCE_LABELS[(i + 1) % EVIDENCE_LABELS.length],
      body: item.answer,
    })),
    ...appeals.map((a, i) => ({
      label: `Appeal ${a.round} Submission`,
      body: a.qa.map((x) => x.answer).join(" · ") || "—",
      key: `ap${i}`,
    })),
  ];

  return (
    <aside className="panel h-fit p-5 lg:sticky lg:top-6">
      <div className="flex items-center gap-2">
        <CaseFileIcon className="h-6 w-6 text-gold" />
        <h3 className="label-caps text-gold-soft">Case Record</h3>
      </div>
      <div className="rule-gold my-4" />
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="animate-rise rounded-lg border border-gold/15 bg-background/40 p-3">
            <p className="label-caps text-gold/80">
              Evidence {String(i + 1).padStart(2, "0")} — {item.label}
            </p>
            <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{item.body}</p>
          </li>
        ))}
        <li className="rounded-lg border border-dashed border-gold/20 p-3">
          <p className="label-caps text-muted-foreground/70">Awaiting further evidence…</p>
        </li>
      </ol>
    </aside>
  );
}

function Analysis() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = window.setInterval(
      () => setStep((s) => (s < ANALYSIS_STEPS.length ? s + 1 : s)),
      900,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 pt-8">
      <div className="panel panel-gold animate-rise p-8 sm:p-12">
        <div className="relative mx-auto h-32 w-32">
          <SealIcon className="animate-seal absolute inset-0 h-32 w-32 text-gold/40" />
          <ScalesIcon className="animate-swing absolute inset-0 m-auto h-20 w-20 text-gold" />
        </div>
        <h2 className="mt-8 text-center text-3xl font-semibold tracking-wide text-cream">
          THE COURT IS DELIBERATING
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Evidence is being cross-referenced. Please remain seated.
        </p>

        <div className="relative mt-8 overflow-hidden rounded-xl border border-gold/20 bg-background/40 p-5">
          <div className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
          <ul className="relative space-y-3">
            {ANALYSIS_STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] ${
                    i < step
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-gold/30 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span
                  className={`label-caps transition-colors ${
                    i < step ? "text-cream" : "text-muted-foreground/50"
                  }`}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground italic">
          {step >= ANALYSIS_STEPS.length
            ? "After careful consideration…"
            : "Reviewing the record of proceedings…"}
        </p>
      </div>
    </section>
  );
}

function VerdictView({
  caseNumber,
  verdict,
  reasoning,
  sarcasm,
  appealRound,
  onAppeal,
}: {
  caseNumber: string;
  verdict: Verdict;
  reasoning: string;
  sarcasm: string[];
  appealRound: number;
  onAppeal: () => void;
}) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setPhase(0);
    const t1 = window.setTimeout(() => setPhase(1), 1500);
    const t2 = window.setTimeout(() => setPhase(2), 3200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [verdict.ruling]);

  if (phase < 2) {
    return (
      <section className="relative z-10 mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-5 text-center">
        <div className="animate-rise" key={phase}>
          <GavelIcon className="animate-gavel mx-auto h-20 w-20 text-gold" />
          <h2 className="font-display mt-8 text-3xl text-cream italic sm:text-4xl">
            {phase === 0 ? "After careful consideration…" : "The court has reached a decision."}
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 pt-4">
      <div className="panel panel-gold animate-rise relative overflow-hidden p-7 sm:p-10">
        <div className="pointer-events-none absolute -top-16 -right-16 opacity-10">
          <SealIcon className="h-64 w-64 text-gold" />
        </div>

        <p className="label-caps relative text-gold-soft">
          Case #{caseNumber}
          {appealRound > 0 ? ` · Appeal ${appealRound}` : ""}
        </p>
        <h1 className="relative mt-3 text-4xl font-semibold tracking-wide text-cream">
          ⚖️ FINAL VERDICT
        </h1>
        <div className="rule-gold my-6" />

        <p className="text-gold-gradient relative text-3xl leading-tight font-bold sm:text-5xl">
          {verdict.ruling}
        </p>

        <div className="relative mt-6 rounded-xl border border-gold/25 bg-background/40 p-5">
          <p className="label-caps text-gold-soft">Court Order</p>
          <p className="font-display mt-2 text-xl text-cream italic">“{verdict.order}”</p>
        </div>

        <div className="relative mt-8">
          <p className="label-caps text-gold-soft">Court's Reasoning</p>
          <p className="mt-3 leading-relaxed text-muted-foreground">{reasoning}</p>
          <ul className="mt-4 space-y-1.5">
            {sarcasm.map((s) => (
              <li key={s} className="text-sm text-cream/80 italic">
                — {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rule-gold my-8" />

        <div className="relative flex flex-col items-center gap-4">
          <div className="animate-stamp rounded-lg border-4 border-seal px-8 py-3">
            <p className="text-2xl font-bold tracking-[0.3em] text-seal">CASE CLOSED</p>
          </div>
          <p className="label-caps text-muted-foreground">Case Status: Closed</p>
          <GavelIcon className="animate-gavel h-12 w-12 text-gold/70" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button
          onClick={onAppeal}
          className="hover-lift label-caps rounded-xl border border-gold/35 px-5 py-4 text-cream hover:bg-gold/10"
        >
          Appeal the Verdict
        </button>
        <Link
          to="/"
          className="hover-lift label-caps rounded-xl bg-primary px-5 py-4 text-center font-semibold text-primary-foreground"
        >
          File a New Case
        </Link>
        <Link
          to="/history"
          className="hover-lift label-caps rounded-xl border border-gold/35 px-5 py-4 text-center text-cream hover:bg-gold/10"
        >
          View Case History
        </Link>
      </div>
    </section>
  );
}
