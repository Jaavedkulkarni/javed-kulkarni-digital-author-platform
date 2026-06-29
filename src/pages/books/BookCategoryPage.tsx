import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, ArrowLeft } from 'lucide-react';
import { books } from '../../data/books';

const categoryMap: Record<string, { label: string; categories: string[] }> = {
  atmvikas: { label: 'आत्मविकास', categories: ['आत्मविकास', 'Self Development'] },
  parenting: { label: 'पालकत्व', categories: ['पालकत्व'] },
  'digital-life': { label: 'डिजिटल जीवन', categories: ['डिजिटल जीवन', 'Technology'] },
  katha: { label: 'कथा', categories: ['कथा'] },
  horror: { label: 'भयकथा', categories: ['भयकथा'] },
  humour: { label: 'विनोदी लेखन', categories: ['विनोदी लेखन'] },
};

export default function BookCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() =>
      setDarkMode(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const meta = slug ? categoryMap[slug] : null;
  const filteredBooks = meta
    ? books.filter((b) => meta.categories.includes(b.category))
    : [];

  if (!meta) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-6 ${darkMode ? 'bg-navy-900' : 'bg-gray-50'}`}>
        <BookOpen className="w-16 h-16 text-gold-400" />
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-navy-800'}`}>
          श्रेणी आढळली नाही
        </h1>
        <Link to="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          मुख्यपृष्ठावर परत जा
        </Link>
      </div>
    );
  }

  const bg = darkMode ? 'bg-navy-900' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-navy-800';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = darkMode
    ? 'bg-navy-800 border-navy-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_24px_60px_rgba(218,165,32,0.18)]'
    : 'bg-white border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(26,46,93,0.18)]';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* Top bar */}
      <div className={`sticky top-0 z-40 border-b ${darkMode ? 'bg-navy-900/95 border-navy-800' : 'bg-white/95 border-gray-200'} backdrop-blur-md`}>
        <div className="section-container">
          <div className="flex items-center gap-2 py-4 text-sm">
            <Link to="/" className={`hover:text-gold-500 transition-colors ${textSecondary}`}>
              मुख्यपृष्ठ
            </Link>
            <span className={textSecondary}>/</span>
            <button
              onClick={() => navigate('/#categories')}
              className={`hover:text-gold-500 transition-colors ${textSecondary}`}
            >
              पुस्तक श्रेणी
            </button>
            <span className={textSecondary}>/</span>
            <span className={`font-medium ${textPrimary}`}>{meta.label}</span>
          </div>
        </div>
      </div>

      <div className="section-container py-12 lg:py-16">
        <div className="mb-10">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${textPrimary}`}>{meta.label}</h1>
          <p className={`text-base ${textSecondary}`}>
            {filteredBooks.length} {filteredBooks.length === 1 ? 'पुस्तक' : 'पुस्तके'}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-4" />
        </div>

        {filteredBooks.length === 0 ? (
          <div className={`text-center py-20 ${textSecondary}`}>
            या श्रेणीत अद्याप कोणते पुस्तक नाही.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-7">
            {filteredBooks.map((book, i) => (
              <article
                key={book.id}
                className={`group flex flex-col rounded-[22px] overflow-hidden transition-all duration-500 ease-out transform hover:-translate-y-2 border ${cardBg}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative bg-white p-[18px]">
                  <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '2 / 3' }}>
                    <img
                      src={book.cover}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className={`absolute top-[26px] left-[26px] px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                    darkMode
                      ? 'bg-navy-900/70 text-gold-400 border border-gold-500/30'
                      : 'bg-navy-700 text-white border border-gold-400/50 shadow-sm'
                  }`}>
                    {book.category}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-5 pt-4">
                  <h3 className={`font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors duration-300 ${
                    darkMode ? 'text-white group-hover:text-gold-400' : 'text-navy-800 group-hover:text-navy-600'
                  }`}>
                    {book.title}
                  </h3>
                  <p className={`text-sm leading-relaxed line-clamp-3 mb-5 flex-1 ${textSecondary}`}>
                    {book.description}
                  </p>
                  <div className="flex flex-col gap-2.5 mt-auto">
                    <Link
                      to={`/books/${book.slug}`}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        darkMode ? 'bg-navy-700 text-white hover:bg-navy-600' : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      अधिक वाचा
                    </Link>
                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Amazon वर
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12">
          <button
            onClick={() => navigate('/#categories')}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${
              darkMode ? 'bg-navy-800 text-white hover:bg-navy-700 border border-navy-700' : 'bg-white text-navy-700 hover:bg-navy-50 border border-gray-200 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            सर्व श्रेणी पहा
          </button>
        </div>
      </div>
    </div>
  );
}
