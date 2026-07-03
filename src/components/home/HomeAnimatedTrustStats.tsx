import { BookOpen, Globe, ShoppingCart, Library } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { HomeSectionHeader } from './HomeSectionHeader';

const STATS: { icon: LucideIcon; text: string }[] = [
  { icon: Library, text: '१० प्रकाशित पुस्तके' },
  { icon: ShoppingCart, text: '२६ Amazon विक्री' },
  { icon: BookOpen, text: '४१२ Kindle पृष्ठे वाचली' },
  { icon: Globe, text: '६+ देशांतील वाचक' },
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
              <card.icon className={`w-7 h-7 mb-3 ${darkMode ? 'text-gold-400' : 'text-gold-600'}`} aria-hidden="true" />
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
