import { Link } from 'react-router-dom';
import {
  BookOpen,
  BookHeart,
  Baby,
  ExternalLink,
  Ghost,
  Lightbulb,
  MessageCircle,
  MonitorSmartphone,
  PenTool,
} from 'lucide-react';
import type { Book } from '../../data/books';
import { FeaturedBookHero } from './FeaturedBookHero';
import { HomeBlogPanel } from './HomeBlogPanel';
import { HomeBooksCarousel } from './HomeBooksCarousel';
import { HomeReaderClubSection } from './HomeReaderClubSection';
import { HomeWhyReadersLove } from './HomeWhyReadersLove';
import { HomeAnimatedTrustStats } from './HomeAnimatedTrustStats';
import { HomeSectionHeader } from './HomeSectionHeader';

const AMAZON_AUTHOR_URL = 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C';

const writingCategoryCards = [
  { icon: Baby, text: 'पालकत्व' },
  { icon: PenTool, text: 'शिक्षण' },
  { icon: Lightbulb, text: 'आत्मविकास' },
  { icon: MonitorSmartphone, text: 'डिजिटल जीवन' },
  { icon: BookHeart, text: 'कथा' },
  { icon: Ghost, text: 'भयकथा' },
];

const WORLD_COUNTRY_FLAGS = ['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇸🇬', '🇦🇪'];

const categoryUiBySlug: Record<string, { icon: typeof Lightbulb; color: string }> = {
  atmvikas: { icon: Lightbulb, color: 'from-amber-500 to-orange-500' },
  parenting: { icon: Baby, color: 'from-pink-500 to-rose-500' },
  'digital-life': { icon: MonitorSmartphone, color: 'from-cyan-500 to-blue-500' },
  katha: { icon: BookOpen, color: 'from-violet-500 to-purple-500' },
  horror: { icon: Ghost, color: 'from-slate-600 to-gray-800' },
  humour: { icon: MessageCircle, color: 'from-green-500 to-emerald-500' },
};

export interface HomeCategory {
  slug: string;
  name: string;
  count: number;
  previewTitles: string[];
}

interface HomePageContentProps {
  darkMode: boolean;
  featuredBook: Book;
  featuredBookHighlights: string[];
  homeBooks: Book[];
  homeCategories: HomeCategory[];
}

export function HomePageContent({
  darkMode,
  featuredBook,
  featuredBookHighlights,
  homeBooks,
  homeCategories,
}: HomePageContentProps) {
  return (
    <>
      <FeaturedBookHero
        book={featuredBook}
        highlights={featuredBookHighlights}
        darkMode={darkMode}
        books={homeBooks.slice(0, 3)}
      />

      <section id="about" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <HomeSectionHeader titleMr="माझ्याविषयी" subtitle="About Me" darkMode={darkMode} />
            <div className={`p-6 sm:p-10 rounded-2xl ${darkMode ? 'bg-navy-800 border border-navy-700' : 'bg-white shadow-lg border border-gray-100'}`}>
              <div className="space-y-5 text-base sm:text-lg leading-relaxed">
                {[
                  'मी जावेद कुलकर्णी.',
                  'लेखन ही माझ्यासाठी केवळ अभिव्यक्ती नसून माणसांच्या मनाशी जोडणारी एक यात्रा आहे.',
                  'नातेसंबंध, पालकत्व, आत्मविकास, डिजिटल युगातील आव्हाने, सामाजिक वास्तव आणि कल्पनारम्य विश्व या विविध विषयांवर मी सातत्याने लेखन करत आहे.',
                  'माझ्या प्रत्येक पुस्तकामागे एक विचार, एक अनुभव आणि वाचकांच्या आयुष्यात सकारात्मक बदल घडवण्याची प्रामाणिक इच्छा आहे.',
                  'शब्दांच्या माध्यमातून विचारांची दारे उघडण्याचा आणि वाचकांना स्वतःकडे नव्याने पाहण्याचा हा माझा प्रयत्न आहे.',
                ].map((text, i) => (
                  <p key={i} className={i === 0 ? `font-semibold text-lg ${darkMode ? 'text-gold-400' : 'text-navy-700'}` : darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="audience" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="section-container">
          <HomeSectionHeader titleMr="लेखन श्रेणी" subtitle="Writing Categories" darkMode={darkMode} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
            {writingCategoryCards.map((card) => (
              <div
                key={card.text}
                className={`group p-5 sm:p-6 rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] ${
                  darkMode
                    ? 'bg-navy-800 hover:bg-navy-700 border border-navy-700'
                    : 'bg-gray-50 hover:bg-white shadow-lg hover:shadow-xl border border-transparent'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-transform group-hover:scale-110 ${
                    darkMode ? 'bg-gold-400/20 text-gold-400' : 'bg-gold-100 text-gold-600'
                  }`}
                >
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  {card.text}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeWhyReadersLove darkMode={darkMode} />

      <section id="categories" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="section-container">
          <HomeSectionHeader titleMr="पुस्तक श्रेणी" subtitle="Book Categories" darkMode={darkMode} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {homeCategories.map((cat, i) => {
              const ui = categoryUiBySlug[cat.slug];
              if (!ui) return null;
              return (
                <Link
                  key={i}
                  to={`/books/category/${cat.slug}`}
                  className={`group flex flex-col p-5 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 ${
                    darkMode
                      ? 'bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-gold-500/40'
                      : 'bg-gray-50 hover:bg-white shadow hover:shadow-xl border border-transparent hover:border-gold-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ui.color} flex items-center justify-center mb-3 shadow-md transition-transform group-hover:scale-110 flex-shrink-0`}>
                    <ui.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white group-hover:text-gold-400' : 'text-navy-800'} transition-colors`}>
                    {cat.name}
                  </h3>
                  <p className={`text-xs mb-2 ${darkMode ? 'text-gold-500' : 'text-gold-600'} font-medium`}>
                    {cat.count} {cat.count === 1 ? 'पुस्तक' : 'पुस्तके'}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="books" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
        <div className="section-container">
          <HomeSectionHeader titleMr="माझी पुस्तके" subtitle="My Books" darkMode={darkMode} />
          <HomeBooksCarousel books={homeBooks} darkMode={darkMode} />
        </div>
      </section>

      <HomeBlogPanel darkMode={darkMode} variant="latest" limit={4} />

      <HomeReaderClubSection />

      <HomeAnimatedTrustStats darkMode={darkMode} />

      <section className="py-20 lg:py-28 pb-24 lg:pb-28 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 relative overflow-hidden">
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 mb-2">
              जगभरातील वाचकांसाठी उपलब्ध
            </h2>
            <p className="text-navy-800/90 text-base sm:text-lg mb-8">
              Available Worldwide on Amazon Kindle &amp; Paperback
            </p>

            <div className="mb-8">
              <span className="text-7xl sm:text-8xl leading-none" role="img" aria-label="India">
                🇮🇳
              </span>
              <p className="text-navy-900 font-semibold mt-3 text-lg">India</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
              {WORLD_COUNTRY_FLAGS.map((flag) => (
                <span
                  key={flag}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-navy-900/15 border border-navy-900/20 text-2xl"
                  role="img"
                  aria-hidden="true"
                >
                  {flag}
                </span>
              ))}
            </div>

            <p className="text-navy-800/80 text-sm sm:text-base mb-8">Paperback • Kindle • Worldwide Delivery</p>
            <a
              href={AMAZON_AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-gold-400 font-semibold rounded-lg hover:bg-navy-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <ExternalLink className="w-5 h-5" />
              Amazon Author Page
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePageContent;
