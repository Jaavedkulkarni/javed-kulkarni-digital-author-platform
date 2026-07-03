import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, BookOpen } from 'lucide-react';
import type { Book } from '../../data/books';
import { HomeSectionHeader } from './HomeSectionHeader';

interface FeaturedBookHeroProps {
  book: Book;
  highlights: string[];
  darkMode: boolean;
  books?: Book[];
}

const AUTOPLAY_MS = 5500;

export function FeaturedBookHero({ book, highlights, darkMode, books = [] }: FeaturedBookHeroProps) {
  const slides = books.length > 0 ? books : [book];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<number | null>(null);
  const current = slides[index] ?? book;
  const hasCarousel = slides.length > 1;

  const goTo = (next: number) => setIndex((next + slides.length) % slides.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const pauseAutoplay = () => {
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), AUTOPLAY_MS * 2);
  };

  useEffect(() => {
    if (!hasCarousel || paused) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [hasCarousel, paused, slides.length]);

  useEffect(() => () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  }, []);

  return (
    <section
      aria-labelledby="featured-book-heading"
      className={`relative overflow-hidden ${darkMode ? 'bg-navy-900' : 'bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900'}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={pauseAutoplay}
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold-400 via-transparent to-transparent pointer-events-none" />
      <div className="section-container relative py-16 lg:py-24">
        <HomeSectionHeader
          titleMr="या महिन्याचे वैशिष्ट्यपूर्ण पुस्तक"
          subtitle="Featured Book of the Month"
          darkMode
          className="mb-10 lg:mb-12 [&>h2]:!text-white [&>p]:!text-gray-400"
        />
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 text-white">
            <h2 id="featured-book-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {current.title}
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-xl">{current.whyRead}</p>
            <ul className="space-y-2 mb-8">
              {highlights.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-gray-200">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 text-xs flex items-center justify-center">✓</span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link to={`/sample/${current.slug}`} className="btn-primary justify-center">
                <BookOpen className="w-5 h-5" />
                Read Sample
              </Link>
              <a href={current.amazonUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary justify-center !bg-white !text-navy-900 hover:!bg-gray-100">
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </a>
              <Link
                to="/reader/wishlist"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors font-semibold text-sm"
              >
                <Heart className="w-5 h-5" />
                Wishlist
              </Link>
            </div>
            {hasCarousel && (
              <div className="flex items-center gap-3 mt-8">
                <button type="button" onClick={() => { pauseAutoplay(); prev(); }} className="p-2 rounded-lg border border-white/20 hover:bg-white/10" aria-label="Previous featured book">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { pauseAutoplay(); goTo(i); }}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${i === index ? 'bg-gold-400' : 'bg-white/30'}`}
                      aria-label={`Featured book ${i + 1}`}
                    />
                  ))}
                </div>
                <button type="button" onClick={() => { pauseAutoplay(); next(); }} className="p-2 rounded-lg border border-white/20 hover:bg-white/10" aria-label="Next featured book">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div className="absolute -inset-6 bg-gold-400/20 rounded-[2rem] blur-2xl" />
              <div className="relative bg-white rounded-[1.5rem] p-5 shadow-2xl border border-gold-400/40">
                <div className="aspect-[2/3] rounded-xl overflow-hidden">
                  <img src={current.cover} alt={current.title} className="w-full h-full object-contain transition-opacity duration-500" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedBookHero;
