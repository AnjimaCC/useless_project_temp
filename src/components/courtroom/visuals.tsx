/** Vector courtroom visuals — drawn with currentColor so they inherit design tokens. */

export function ScalesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <path d="M60 14v82" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 30h72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="14" r="5" fill="currentColor" />
      <path d="M38 96h44" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 96c0-8 4-12 10-12s10 4 10 12" stroke="currentColor" strokeWidth="3" />
      <path d="M24 30 12 58h24L24 30Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M96 30 84 58h24L96 30Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 30v6M96 30v6" stroke="currentColor" strokeWidth="2" />
      <path d="M12 58a12 12 0 0 0 24 0M84 58a12 12 0 0 0 24 0" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export function GavelIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <rect
        x="20"
        y="24"
        width="42"
        height="24"
        rx="6"
        transform="rotate(-35 20 24)"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M46 44 84 82" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <rect x="72" y="86" width="34" height="10" rx="5" stroke="currentColor" strokeWidth="3" />
      <path d="M16 96h40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function SealIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      <circle cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="2" />
      <path
        d="M60 42v34M46 50h28M50 76h20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="60"
          y1="10"
          x2="60"
          y2="16"
          stroke="currentColor"
          strokeWidth="2"
          transform={`rotate(${i * 15} 60 60)`}
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

export function CaseFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <path
        d="M22 34a6 6 0 0 1 6-6h22l8 10h34a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V34Z"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M36 60h48M36 72h34M36 84h22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function BenchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 100" className={className} fill="none" aria-hidden="true">
      <path d="M10 88h140" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 88V52h104v36" stroke="currentColor" strokeWidth="3" />
      <path d="M40 62h80M40 74h80" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <path d="M60 52V34h40v18" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="80" cy="20" r="8" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export function Particles() {
  const dots = [
    { l: "8%", t: "18%", d: "0s", s: 5 },
    { l: "22%", t: "72%", d: "1.4s", s: 3 },
    { l: "41%", t: "12%", d: "2.6s", s: 4 },
    { l: "67%", t: "62%", d: "0.8s", s: 3 },
    { l: "83%", t: "26%", d: "3.4s", s: 6 },
    { l: "92%", t: "78%", d: "2s", s: 4 },
    { l: "55%", t: "88%", d: "4.2s", s: 3 },
    { l: "15%", t: "45%", d: "3s", s: 4 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="animate-float absolute rounded-full bg-gold/30 blur-[1px]"
          style={{
            left: d.l,
            top: d.t,
            width: d.s,
            height: d.s,
            animationDelay: d.d,
          }}
        />
      ))}
    </div>
  );
}
