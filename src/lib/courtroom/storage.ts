import type { Verdict } from "./engine";

export type QA = { question: string; answer: string; aspect: string };

export type AppealRecord = {
  round: number;
  qa: QA[];
  verdict: Verdict;
  reasoning: string;
  date: string;
};

export type CaseFile = {
  caseNumber: string;
  problem: string;
  categoryLabel: string;
  qa: QA[];
  verdict: Verdict;
  reasoning: string;
  sarcasm: string[];
  appeals: AppealRecord[];
  date: string;
  status: "CLOSED";
};

const KEY = "courtroom_cases_v1";
const DRAFT = "courtroom_draft_v1";

export function loadCases(): CaseFile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CaseFile[]) : [];
  } catch {
    return [];
  }
}

export function saveCase(file: CaseFile) {
  if (typeof window === "undefined") return;
  const all = loadCases().filter((c) => c.caseNumber !== file.caseNumber);
  all.unshift(file);
  window.localStorage.setItem(KEY, JSON.stringify(all.slice(0, 60)));
}

export function clearCases() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function setDraft(problem: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(DRAFT, problem);
}

export function getDraft(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(DRAFT);
}

export function pastVerdictRulings(): string[] {
  return loadCases().flatMap((c) => [c.verdict.ruling, ...c.appeals.map((a) => a.verdict.ruling)]);
}
