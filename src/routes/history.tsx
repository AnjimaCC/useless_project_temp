import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CaseFileIcon, Particles, ScalesIcon } from "@/components/courtroom/visuals";
import { clearCases, loadCases, type CaseFile } from "@/lib/courtroom/storage";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Case History — The Courtroom" },
      {
        name: "description",
        content: "Every case heard by The Courtroom on this device, with verdicts and appeals.",
      },
      { property: "og:title", content: "Case History — The Courtroom" },
      { property: "og:description", content: "The complete archive of your hearings and verdicts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [open, setOpen] = useState<CaseFile | null>(null);

  useEffect(() => setCases(loadCases()), []);

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <Particles />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2">
          <ScalesIcon className="h-6 w-6 text-gold" />
          <span className="label-caps text-gold-soft">The Courtroom</span>
        </Link>
        <Link
          to="/"
          className="label-caps rounded-full border border-gold/30 px-4 py-2 text-gold-soft hover:bg-gold/10"
        >
          File a New Case
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pt-6">
        <h1 className="text-4xl font-semibold tracking-wide text-cream sm:text-5xl">CASE HISTORY</h1>
        <p className="mt-2 text-muted-foreground">
          The complete archive of hearings on this device — {cases.length} case
          {cases.length === 1 ? "" : "s"} on record.
        </p>
        <div className="rule-gold my-7" />

        {cases.length === 0 ? (
          <div className="panel p-12 text-center">
            <CaseFileIcon className="mx-auto h-16 w-16 text-gold/60" />
            <p className="font-display mt-5 text-2xl text-cream italic">
              The docket is empty.
            </p>
            <p className="mt-2 text-muted-foreground">No cases have been filed on this device yet.</p>
            <Link
              to="/"
              className="hover-lift label-caps mt-7 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Present Your Case
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <button
                  key={c.caseNumber}
                  onClick={() => setOpen(c)}
                  className="panel hover-lift animate-rise p-5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="label-caps text-gold-soft">CASE #{c.caseNumber}</span>
                    <span className="label-caps rounded-full border border-seal/60 px-2 py-0.5 text-seal">
                      {c.status}
                    </span>
                  </div>
                  <div className="rule-gold my-4" />
                  <p className="label-caps text-muted-foreground/70">Case Subject</p>
                  <p className="mt-1 line-clamp-2 text-cream">{c.problem}</p>
                  <p className="label-caps mt-4 text-muted-foreground/70">Verdict</p>
                  <p className="text-gold-gradient mt-1 line-clamp-2 font-semibold">
                    {c.appeals.length ? c.appeals[c.appeals.length - 1].verdict.ruling : c.verdict.ruling}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(c.date).toLocaleString()}
                    {c.appeals.length ? ` · ${c.appeals.length} appeal(s)` : ""}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                clearCases();
                setCases([]);
              }}
              className="label-caps mt-8 rounded-xl border border-destructive/40 px-5 py-3 text-destructive hover:bg-destructive/10"
            >
              Purge the Archive
            </button>
          </>
        )}
      </section>

      {open ? <CaseDetail file={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function CaseDetail({ file, onClose }: { file: CaseFile; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="panel panel-gold animate-rise my-8 w-full max-w-2xl p-6 sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-caps text-gold-soft">CASE #{file.caseNumber}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(file.date).toLocaleString()} · {file.categoryLabel}
            </p>
          </div>
          <button onClick={onClose} className="label-caps text-muted-foreground hover:text-cream">
            Close
          </button>
        </div>

        <div className="rule-gold my-5" />
        <p className="label-caps text-gold-soft">Case Subject</p>
        <p className="font-display mt-2 text-xl text-cream italic">“{file.problem}”</p>

        <div className="rule-gold my-5" />
        <p className="label-caps text-gold-soft">Record of Proceedings</p>
        <ol className="mt-3 space-y-3">
          {file.qa.map((item, i) => (
            <li key={i} className="rounded-lg border border-gold/15 bg-background/40 p-3">
              <p className="text-sm text-cream">
                Q{i + 1}. {item.question}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
            </li>
          ))}
        </ol>

        <div className="rule-gold my-5" />
        <p className="label-caps text-gold-soft">Original Verdict</p>
        <p className="text-gold-gradient mt-2 text-2xl font-bold">{file.verdict.ruling}</p>
        <p className="mt-1 text-sm text-cream/80 italic">“{file.verdict.order}”</p>
        <p className="mt-3 text-sm text-muted-foreground">{file.reasoning}</p>

        {file.appeals.map((a) => (
          <div key={a.round} className="mt-6 rounded-xl border border-gold/20 bg-background/40 p-4">
            <p className="label-caps text-gold-soft">Appeal {a.round}</p>
            <ol className="mt-2 space-y-2">
              {a.qa.map((item, i) => (
                <li key={i} className="text-sm">
                  <span className="text-cream">{item.question}</span>
                  <span className="block text-muted-foreground">{item.answer}</span>
                </li>
              ))}
            </ol>
            <p className="text-gold-gradient mt-3 text-xl font-bold">{a.verdict.ruling}</p>
            <p className="mt-1 text-sm text-cream/80 italic">“{a.verdict.order}”</p>
          </div>
        ))}

        <div className="rule-gold my-6" />
        <div className="flex justify-center">
          <div className="animate-stamp rounded-lg border-4 border-seal px-6 py-2">
            <p className="text-xl font-bold tracking-[0.3em] text-seal">CASE CLOSED</p>
          </div>
        </div>
      </div>
    </div>
  );
}
