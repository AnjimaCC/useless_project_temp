import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BenchIcon,
  CaseFileIcon,
  GavelIcon,
  Particles,
  ScalesIcon,
  SealIcon,
} from "@/components/courtroom/visuals";
import { setDraft } from "@/lib/courtroom/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Courtroom — A Fair Hearing. An Unfair Solution." },
      {
        name: "description",
        content:
          "Submit any everyday problem to The Courtroom. The court hears your case, examines the evidence and delivers an official final verdict.",
      },
      { property: "og:title", content: "The Courtroom — A Fair Hearing. An Unfair Solution." },
      {
        property: "og:description",
        content: "Your problem. Our jurisdiction. Every problem deserves a hearing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [problem, setProblem] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const present = () => {
    if (problem.trim().length < 8) {
      setError("The court requires a fuller statement before a hearing can begin.");
      return;
    }
    setDraft(problem.trim());
    navigate({ to: "/case" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Particles />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <ScalesIcon className="animate-swing h-8 w-8 text-gold" />
          <span className="label-caps text-gold-soft">Est. This Semester</span>
        </div>
        <Link
          to="/history"
          className="label-caps rounded-full border border-gold/30 px-4 py-2 text-gold-soft transition-colors hover:bg-gold/10"
        >
          Case History
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pt-8 pb-4 text-center">
        <div className="animate-rise mx-auto mb-6 flex justify-center">
          <SealIcon className="animate-seal h-24 w-24 text-gold" />
        </div>
        <h1 className="animate-rise text-5xl leading-tight font-semibold tracking-wide sm:text-7xl">
          <span className="text-gold-gradient">⚖️ THE COURTROOM</span>
        </h1>
        <div className="rule-gold mx-auto my-7 w-56" />
        <p className="animate-rise font-display text-2xl text-cream italic sm:text-3xl">
          “A Fair Hearing. An Unfair Solution.”
        </p>
        <p className="mt-4 text-lg text-muted-foreground">Your problem. Our jurisdiction.</p>
        <p className="label-caps mt-2 text-gold-soft/80">Every problem deserves a hearing</p>
      </section>

      {/* Input */}
      <section className="relative z-10 mx-auto mt-10 max-w-3xl px-5">
        <div className="panel panel-gold animate-rise relative overflow-hidden p-6 sm:p-9">
          <div className="pointer-events-none absolute -top-10 -right-10 opacity-[0.07]">
            <BenchIcon className="h-56 w-56 text-gold" />
          </div>
          <h2 className="relative text-2xl font-semibold tracking-wide text-cream sm:text-3xl">
            WHAT SEEMS TO BE THE PROBLEM?
          </h2>
          <p className="relative mt-2 text-sm text-muted-foreground">
            State the matter plainly. The court will examine it before reaching any conclusion.
          </p>
          <textarea
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              setError("");
            }}
            rows={5}
            placeholder="Tell the court what's going on…"
            className="relative mt-5 w-full resize-none rounded-xl border border-gold/25 bg-input/60 p-4 text-base text-cream placeholder:text-muted-foreground/70 focus:border-gold/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
          />
          {error ? <p className="relative mt-2 text-sm text-destructive">{error}</p> : null}
          <button
            onClick={present}
            className="hover-lift relative mt-5 w-full rounded-xl bg-primary px-6 py-4 text-base font-semibold tracking-[0.15em] text-primary-foreground uppercase"
          >
            Present Your Case ⚖️
          </button>
          <p className="relative mt-3 text-center text-xs text-muted-foreground">
            All submissions are heard in confidence and stored only on this device.
          </p>
        </div>
      </section>

      {/* Procedure */}
      <section className="relative z-10 mx-auto mt-16 grid max-w-5xl gap-5 px-5 sm:grid-cols-3">
        {[
          {
            icon: <CaseFileIcon className="h-9 w-9 text-gold" />,
            title: "Case Filed",
            body: "Your statement is registered and issued an official case number.",
          },
          {
            icon: <ScalesIcon className="h-9 w-9 text-gold" />,
            title: "Evidence Heard",
            body: "The bench asks questions specific to your circumstances and records every answer.",
          },
          {
            icon: <GavelIcon className="animate-gavel h-9 w-9 text-gold" />,
            title: "Verdict Delivered",
            body: "A final, binding decision is issued. Appeals are permitted.",
          },
        ].map((c) => (
          <article key={c.title} className="panel hover-lift p-6">
            <div className="mb-4">{c.icon}</div>
            <h3 className="text-xl font-semibold text-cream">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </article>
        ))}
      </section>

      <section className="relative z-10 mx-auto mt-14 max-w-3xl px-5 pb-20 text-center">
        <div className="rule-gold mx-auto mb-6 w-40" />
        <p className="font-display text-xl text-cream/90 italic">
          “No matter is too small for the bench. No matter is too large for the bench. The bench is
          not particularly concerned with size.”
        </p>
        <p className="label-caps mt-4 text-gold-soft/70">— Standing Orders, Section 1</p>
      </section>

      <footer className="relative z-10 border-t border-gold/15 py-6 text-center">
        <p className="label-caps text-muted-foreground">The Courtroom · All hearings final</p>
      </footer>
    </div>
  );
}
