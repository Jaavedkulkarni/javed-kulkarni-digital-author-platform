export function HomeReaderClubIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0" aria-hidden="true">
      <div className="absolute -inset-4 bg-gold-400/10 rounded-[2rem] blur-2xl" />
      <svg viewBox="0 0 320 320" className="relative w-full h-auto drop-shadow-2xl" fill="none">
        <rect x="24" y="40" width="272" height="240" rx="28" className="fill-navy-800/80 stroke-gold-400/40" strokeWidth="2" />
        <circle cx="160" cy="118" r="52" className="fill-gold-400/15 stroke-gold-400/50" strokeWidth="2" />
        <circle cx="160" cy="108" r="22" className="fill-gold-400/30" />
        <path
          d="M118 152c12-18 32-28 42-28s30 10 42 28"
          className="stroke-gold-400/60"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="72" y="188" width="176" height="18" rx="9" className="fill-gold-400/25" />
        <rect x="88" y="218" width="144" height="14" rx="7" className="fill-white/10" />
        <rect x="104" y="244" width="112" height="12" rx="6" className="fill-white/10" />
        <path
          d="M248 92l18 10v36l-18 10V92z"
          className="fill-gold-500/80 stroke-gold-300"
          strokeWidth="1.5"
        />
        <path d="M72 92L54 102v36l18 10V92z" className="fill-gold-500/60 stroke-gold-300" strokeWidth="1.5" />
        <circle cx="248" cy="248" r="28" className="fill-gold-400 stroke-navy-900" strokeWidth="3" />
        <path
          d="M238 248l7 7 15-16"
          className="stroke-navy-900"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default HomeReaderClubIllustration;
