import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadBookBySlug } from '../../lib/publicBooks';
import type { Book } from '../../data/books';

export default function SampleReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const [darkMode, setDarkMode] = useState(false);
  const [book, setBook] = useState<Book | undefined>(undefined);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    loadBookBySlug(slug).then((loaded) => {
      if (!cancelled) setBook(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const bg = darkMode ? 'bg-navy-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-100';
  const textPrimary = darkMode ? 'text-white' : 'text-navy-800';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      <div className={`sticky top-0 z-40 border-b backdrop-blur-md ${darkMode ? 'bg-navy-900/95 border-navy-800' : 'bg-white/95 border-gray-200'}`}>
        <div className="section-container">
          <div className="flex items-center justify-between py-4">
            <Link
              to={`/books/${slug}`}
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold-500 ${textSecondary}`}
            >
              <ArrowLeft className="w-4 h-4" />
              {book ? book.title : 'पुस्तकाकडे परत जा'}
            </Link>
            <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${darkMode ? 'bg-gold-500/20 text-gold-400' : 'bg-gold-100 text-gold-700'}`}>
              <BookOpen className="w-3.5 h-3.5" />
              Sample Reader
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center">
          <div className="relative inline-flex items-center justify-center mb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/30 to-navy-400/20 rounded-full blur-3xl w-40 h-40 mx-auto" />
            <div className={`relative w-28 h-28 rounded-full border-2 flex items-center justify-center ${darkMode ? 'bg-navy-800 border-gold-500/40' : 'bg-white border-gold-300 shadow-xl'}`}>
              <div className="relative">
                <BookOpen className="w-12 h-12 text-gold-400" />
                <Clock className="w-5 h-5 text-gold-500 absolute -bottom-1 -right-1" />
              </div>
            </div>
          </div>

          {book && (
            <div className="flex justify-center mb-8">
              <div className={`w-20 rounded-xl overflow-hidden shadow-lg border ${darkMode ? 'border-navy-600' : 'border-gray-200'}`} style={{ aspectRatio: '2 / 3' }}>
                <img src={book.cover} alt={book.title} className="w-full h-full object-contain bg-white p-1" />
              </div>
            </div>
          )}

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${darkMode ? 'bg-navy-800 text-gold-400 border border-gold-500/30' : 'bg-gold-50 text-gold-700 border border-gold-200'}`}>
            <Sparkles className="w-4 h-4" />
            Coming Soon
          </div>

          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${textPrimary}`}>
            Interactive Sample Reader
          </h1>

          <p className={`text-lg leading-relaxed mb-4 ${textSecondary}`}>
            This interactive reader will be available soon.
          </p>

          <p className={`text-base leading-relaxed mb-10 max-w-md mx-auto ${textSecondary}`}>
            {book
              ? `"${book.title}" चे पहिले काही पान लवकरच इथे ऑनलाइन वाचता येतील.`
              : 'पुस्तकाचे पहिले काही पान लवकरच इथे ऑनलाइन वाचता येतील.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            {[
              { emoji: '📖', title: 'Flipbook Reader', desc: 'Real page-turning experience' },
              { emoji: '🔖', title: 'Bookmarks', desc: 'Save your reading position' },
              { emoji: '🌙', title: 'Night Mode', desc: 'Comfortable reading in dark' },
            ].map((f) => (
              <div key={f.title} className={`p-5 rounded-2xl border ${cardBg}`}>
                <div className="text-2xl mb-2">{f.emoji}</div>
                <h3 className={`text-sm font-bold mb-1 ${textPrimary}`}>{f.title}</h3>
                <p className={`text-xs ${textSecondary}`}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/books/${slug}`} className="btn-primary">
              <ArrowLeft className="w-4 h-4" />
              पुस्तकाकडे परत जा
            </Link>
            <Link to="/#books" className="btn-secondary">
              <BookOpen className="w-4 h-4" />
              सर्व पुस्तके पहा
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
