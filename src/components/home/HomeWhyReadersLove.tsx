import { CheckCircle2 } from 'lucide-react';
import { HomeSectionHeader } from './HomeSectionHeader';

const REASONS = [
  'Practical',
  'Easy Marathi',
  'Real Stories',
  'Modern Topics',
  'Parenting',
  'Relationships',
  'Digital Life',
  'Self Growth',
];

interface HomeWhyReadersLoveProps {
  darkMode: boolean;
}

export function HomeWhyReadersLove({ darkMode }: HomeWhyReadersLoveProps) {
  return (
    <section className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
      <div className="section-container">
        <HomeSectionHeader
          titleMr="वाचकांना ही पुस्तके का आवडतात?"
          subtitle="Why Readers Love These Books"
          darkMode={darkMode}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {REASONS.map((reason) => (
            <article
              key={reason}
              className={`group p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                darkMode
                  ? 'bg-navy-800 border-gold-500/20 hover:border-gold-500/40 hover:shadow-[0_20px_50px_rgba(218,165,32,0.12)]'
                  : 'bg-white border-gold-200/60 hover:shadow-xl hover:border-gold-300'
              }`}
            >
              <CheckCircle2 className={`w-6 h-6 mb-3 ${darkMode ? 'text-gold-400' : 'text-gold-600'}`} />
              <h3 className={`font-semibold text-base sm:text-lg ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                {reason}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeWhyReadersLove;
