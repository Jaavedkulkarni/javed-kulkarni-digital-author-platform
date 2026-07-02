import { useEffect, useRef, useState } from 'react';

const STATS = [
  { emoji: '📚', target: 8, suffix: '+', label: 'Published Books' },
  { emoji: '✍️', target: 100, suffix: '+', label: 'Articles' },
  { emoji: '🛒', value: 'Amazon', label: 'Published Author' },
  { emoji: '❤️', value: 'Growing', label: 'Reader Community' },
];

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const totalFrames = 40;
    const timer = window.setInterval(() => {
      frame += 1;
      setValue(Math.min(target, Math.round((target * frame) / totalFrames)));
      if (frame >= totalFrames) window.clearInterval(timer);
    }, 30);
    return () => window.clearInterval(timer);
  }, [target, active]);

  return value;
}

interface HomeAnimatedTrustStatsProps {
  darkMode: boolean;
}

export function HomeAnimatedTrustStats({ darkMode }: HomeAnimatedTrustStatsProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const books = useCountUp(8, active);
  const articles = useCountUp(100, active);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const displayValues = [`${books}+`, `${articles}+`, 'Amazon', 'Growing'];

  return (
    <section
      ref={ref}
      aria-label="Trust statistics"
      className={`py-16 lg:py-20 ${darkMode ? 'bg-navy-800/30' : 'bg-gray-50'}`}
    >
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {STATS.map((card, i) => (
            <article
              key={card.label}
              className={`flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border transition-all ${
                darkMode ? 'bg-navy-800 border-gold-500/20' : 'bg-white border-gold-400/30 shadow-sm'
              }`}
            >
              <span className="text-2xl mb-2" aria-hidden="true">{card.emoji}</span>
              <p className={`text-xl sm:text-2xl font-bold mb-1 tabular-nums ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                {displayValues[i]}
              </p>
              <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{card.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeAnimatedTrustStats;
