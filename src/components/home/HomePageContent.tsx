import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  BookHeart,
  ExternalLink,
  Ghost,
  Globe,
  Heart,
  Lightbulb,
  MessageCircle,
  MonitorSmartphone,
  PenTool,
  ShoppingBag,
  Users,
  Baby,
} from 'lucide-react';
import type { Book } from '../../data/books';
import { FeaturedBookHero } from './FeaturedBookHero';
import { HomeBlogPanel } from './HomeBlogPanel';
import { HomeReaderClubSection } from './HomeReaderClubSection';

const AMAZON_AUTHOR_URL = 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C';

const readerCards = [
  { icon: Users, text: 'पालकांसाठी', desc: 'पालकत्वावरील अंतर्दृष्टी' },
  { icon: PenTool, text: 'विद्यार्थ्यांसाठी', desc: 'शैक्षणिक मार्गदर्शन' },
  { icon: Lightbulb, text: 'आत्मविकास शोधणाऱ्यांसाठी', desc: 'व्यक्तिगत विकास' },
  { icon: MonitorSmartphone, text: 'डिजिटल युग समजून घेऊ इच्छिणाऱ्यांसाठी', desc: 'तंत्रज्ञान आणि जीवन' },
  { icon: BookHeart, text: 'कथा आणि कादंबरी प्रेमींसाठी', desc: 'साहित्यिक सफर' },
  { icon: Ghost, text: 'भयकथा व कल्पनारम्य साहित्य वाचकांसाठी', desc: 'रोमांचक कथा' },
];

const categoryUiBySlug: Record<string, { icon: typeof Lightbulb; color: string }> = {
  atmvikas: { icon: Lightbulb, color: 'from-amber-500 to-orange-500' },
  parenting: { icon: Baby, color: 'from-pink-500 to-rose-500' },
  'digital-life': { icon: MonitorSmartphone, color: 'from-cyan-500 to-blue-500' },
  katha: { icon: BookOpen, color: 'from-violet-500 to-purple-500' },
  horror: { icon: Ghost, color: 'from-slate-600 to-gray-800' },
  humour: { icon: MessageCircle, color: 'from-green-500 to-emerald-500' },
};

const blogCategories = [
  { icon: Heart, name: 'नातेसंबंध', color: 'bg-rose-500' },
  { icon: Users, name: 'पालकत्व', color: 'bg-pink-500' },
  { icon: MonitorSmartphone, name: 'डिजिटल जीवन', color: 'bg-blue-500' },
  { icon: Lightbulb, name: 'आत्मविकास', color: 'bg-amber-500' },
  { icon: Globe, name: 'समाज आणि वास्तव', color: 'bg-teal-500' },
];

const readerTrustCards = [
  { emoji: '📚', value: '8+', label: 'Published Books' },
  { emoji: '✍️', value: '100+', label: 'Articles' },
  { emoji: '🛒', value: 'Amazon', label: 'Published Author' },
  { emoji: '❤️', value: 'Growing', label: 'Reader Community' },
];

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

      <section aria-label="Trust statistics" className={`py-12 ${darkMode ? 'bg-navy-800/30' : 'bg-gray-50'}`}>
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {readerTrustCards.map((card) => (
              <article
                key={card.label}
                className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-navy-800 border-gold-500/20' : 'bg-white border-gold-400/30 shadow-sm'
                }`}
              >
                <span className="text-2xl mb-2" aria-hidden="true">{card.emoji}</span>
                <p className={`text-xl sm:text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-navy-800'}`}>{card.value}</p>
                <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{card.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className={`inline-block text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
              पुस्तक श्रेणी
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full" />
          </div>
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
                  {cat.previewTitles.length > 0 && (
                    <ul className={`space-y-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {cat.previewTitles.map((title, j) => (
                        <li key={j} className="text-xs leading-snug line-clamp-1 flex items-start gap-1">
                          <span className="flex-shrink-0 mt-0.5">•</span>
                          <span className="line-clamp-1">{title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="books" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-900' : 'bg-gray-50'}`}>
        <div className="section-container">
          <div className="text-center mb-14">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${darkMode ? 'bg-navy-800 text-gold-400' : 'bg-navy-100 text-navy-600'}`}>
              <BookOpen className="w-4 h-4" />
              प्रकाशित पुस्तके
            </span>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>माझी पुस्तके</h2>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              विचार, अनुभव आणि शब्दांची सफर — प्रत्येक पुस्तक एक नवा आयाम.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full mt-6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-7">
            {homeBooks.map((book) => (
              <article
                key={book.id}
                className={`group flex flex-col rounded-[22px] overflow-hidden transition-all duration-500 ease-out transform hover:-translate-y-2 ${
                  darkMode
                    ? 'bg-navy-800 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_24px_60px_rgba(218,165,32,0.18)] border border-navy-700/50'
                    : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(26,46,93,0.18)] border border-gray-100'
                }`}
              >
                <div className="relative bg-white p-[18px]">
                  <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '2 / 3' }}>
                    <img src={book.cover} alt={book.title} loading="lazy" className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                  </div>
                  <span className={`absolute top-[26px] left-[26px] px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${darkMode ? 'bg-navy-900/70 text-gold-400 border border-gold-500/30' : 'bg-navy-700 text-white border border-gold-400/50 shadow-sm'}`}>
                    {book.category}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-5 pt-4">
                  <h3 className={`font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors duration-300 ${darkMode ? 'text-white group-hover:text-gold-400' : 'text-navy-800 group-hover:text-navy-600'}`}>
                    {book.title}
                  </h3>
                  <p className={`text-sm leading-relaxed line-clamp-3 mb-5 flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{book.description}</p>
                  <div className="flex flex-col gap-2.5 mt-auto">
                    <Link to={`/books/${book.slug}`} className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${darkMode ? 'bg-navy-700 text-white hover:bg-navy-600' : 'bg-navy-100 text-navy-700 hover:bg-navy-200'}`}>
                      <BookOpen className="w-4 h-4" />
                      अधिक वाचा
                    </Link>
                    <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-sm hover:shadow-md">
                      <ShoppingBag className="w-4 h-4" />
                      Amazon वर
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-14">
            <a href={AMAZON_AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <BookOpen className="w-5 h-5" />
              सर्व पुस्तके पहा
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="audience" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className={`inline-block text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>माझं लेखन कोणासाठी?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {readerCards.map((card, i) => (
              <div key={i} className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${darkMode ? 'bg-navy-800 hover:bg-navy-700 border border-navy-700' : 'bg-white hover:bg-gradient-to-br hover:from-gold-50 hover:to-white shadow-lg hover:shadow-xl'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${darkMode ? 'bg-gold-400/20 text-gold-400' : 'bg-gold-100 text-gold-600'}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-navy-800'}`}>{card.text}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>माझ्याविषयी</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mb-8" />
              <div className={`p-6 sm:p-8 rounded-2xl ${darkMode ? 'bg-navy-800 border border-navy-700' : 'bg-gray-50 border border-gray-100'}`}>
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
            <div className="space-y-6">
              <HomeBlogPanel darkMode={darkMode} variant="latest" compact limit={4} />
              <HomeBlogPanel darkMode={darkMode} variant="trending" compact limit={4} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 relative overflow-hidden">
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy-900 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gold-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 mb-6">Amazon वर माझी सर्व पुस्तके</h2>
            <p className="text-navy-800/80 text-lg mb-8">माझी सर्व प्रकाशित पुस्तके Amazon Author Page वर उपलब्ध आहेत.</p>
            <a href={AMAZON_AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-gold-400 font-semibold rounded-lg hover:bg-navy-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <ExternalLink className="w-5 h-5" />
              Amazon Author Page
            </a>
          </div>
        </div>
      </section>

      <section id="blog-link" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className={`inline-block text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>Latest Articles</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {blogCategories.map((cat, i) => (
              <Link key={i} to="/blog" className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${darkMode ? 'bg-navy-800 hover:bg-navy-700 border border-navy-700' : 'bg-white shadow-lg hover:shadow-xl'}`}>
                <div className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-navy-800'}`}>{cat.name}</h3>
                <span className="flex items-center gap-2 text-gold-500 text-sm hover:text-gold-600 transition-colors">
                  Explore
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeReaderClubSection darkMode={darkMode} />
    </>
  );
}

export default HomePageContent;
