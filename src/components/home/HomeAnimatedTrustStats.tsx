import { HomeSectionHeader } from './HomeSectionHeader';

const STATS = [
  { emoji: '📚', text: '१० प्रकाशित पुस्तके' },
  { emoji: '🛒', text: '२६ Amazon विक्री' },
  { emoji: '📖', text: '४१२ Kindle पृष्ठे वाचली' },
  { emoji: '🌍', text: '६+ देशांतील वाचक' },
];

interface HomeAnimatedTrustStatsProps {
  darkMode: boolean;
}

export function HomeAnimatedTrustStats({ darkMode }: HomeAnimatedTrustStatsProps) {
  return (
    <section
      aria-label="Achievements and milestones"
      className={`py-16 lg:py-20 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}
    >
      <div className="section-container">
        <HomeSectionHeader
          titleMr="आजवरचा प्रवास"
          subtitle="Achievements & Milestones"
          darkMode={darkMode}
          className="mb-8 lg:mb-10"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {STATS.map((card) => (
            <article
              key={card.text}
              className={`flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border transition-all ${
                darkMode ? 'bg-navy-800 border-gold-500/20' : 'bg-gray-50 border-gold-400/30 shadow-sm'
              }`}
            >
              <span className="text-2xl mb-2" aria-hidden="true">
                {card.emoji}
              </span>
              <p className={`text-sm sm:text-base font-bold leading-snug ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeAnimatedTrustStats;
