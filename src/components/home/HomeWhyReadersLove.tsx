import { BookOpen, Globe, Heart, Lightbulb, PenLine, ShoppingCart } from 'lucide-react';
import { HomeSectionHeader } from './HomeSectionHeader';

const HIGHLIGHTS = [
  { icon: PenLine, text: 'सोपी भाषा' },
  { icon: Heart, text: 'मनाला भिडणारे विषय' },
  { icon: Lightbulb, text: 'विचारांना चालना' },
  { icon: BookOpen, text: 'वास्तवाशी जोडलेले' },
];

interface HomeWhyReadersLoveProps {
  darkMode: boolean;
}

export function HomeWhyReadersLove({ darkMode }: HomeWhyReadersLoveProps) {
  return (
    <section className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
      <div className="section-container">
        <HomeSectionHeader titleMr="पुस्तकांची वैशिष्ट्ये" subtitle="Book Highlights" darkMode={darkMode} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {HIGHLIGHTS.map((item) => (
            <article
              key={item.text}
              className={`group p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                darkMode
                  ? 'bg-navy-800 border-gold-500/20 hover:border-gold-500/40'
                  : 'bg-white border-gold-200/60 hover:border-gold-300 shadow-sm'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-3 ${darkMode ? 'text-gold-400' : 'text-gold-600'}`} />
              <h3 className={`font-semibold text-base sm:text-lg ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                {item.text}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeWhyReadersLove;
