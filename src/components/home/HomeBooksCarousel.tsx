import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import type { Book } from '../../data/books';

interface HomeBooksCarouselProps {
  books: Book[];
  darkMode: boolean;
}

const BOOK_BADGE =
  'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-navy-800 text-white border border-gold-400';

export function HomeBooksCarousel({ books, darkMode }: HomeBooksCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(track.clientWidth * 0.85, 280);
    track.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Previous books"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-11 h-11 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 ${
          darkMode
            ? 'bg-navy-800 text-gold-400 border border-gold-400/50 hover:bg-navy-700'
            : 'bg-white text-navy-800 border border-gold-300 hover:bg-navy-50'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Next books"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-11 h-11 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 ${
          darkMode
            ? 'bg-navy-800 text-gold-400 border border-gold-400/50 hover:bg-navy-700'
            : 'bg-white text-navy-800 border border-gold-300 hover:bg-navy-50'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-1 sm:px-14 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {books.map((book) => (
          <article
            key={book.id}
            className={`group flex-shrink-0 w-[260px] sm:w-[280px] snap-start flex flex-col rounded-[22px] overflow-hidden transition-all duration-500 ease-out transform hover:-translate-y-2 ${
              darkMode
                ? 'bg-navy-800 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_24px_60px_rgba(218,165,32,0.18)] border border-navy-700/50'
                : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(26,46,93,0.18)] border border-gray-100'
            }`}
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
              <div className="absolute top-[22px] left-[22px] right-[22px] flex flex-wrap gap-2">
                <span className={BOOK_BADGE}>{book.category}</span>
                <span className={BOOK_BADGE}>{book.language}</span>
              </div>
            </div>
            <div className="flex flex-col flex-1 p-5 pt-4">
              <h3
                className={`font-bold text-base leading-snug mb-2 line-clamp-2 ${
                  darkMode ? 'text-white group-hover:text-gold-400' : 'text-navy-800 group-hover:text-navy-600'
                }`}
              >
                {book.title}
              </h3>
              <p className={`text-sm leading-relaxed line-clamp-3 mb-5 flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {book.description}
              </p>
              <div className="flex flex-col gap-2.5 mt-auto">
                <Link
                  to={`/books/${book.slug}`}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${
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
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 hover:from-gold-500 hover:to-gold-600"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Amazon वर
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex sm:hidden justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Previous books"
          className={`w-10 h-10 flex items-center justify-center rounded-full border ${
            darkMode ? 'border-gold-400/50 text-gold-400 bg-navy-800' : 'border-gold-300 text-navy-800 bg-white'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Next books"
          className={`w-10 h-10 flex items-center justify-center rounded-full border ${
            darkMode ? 'border-gold-400/50 text-gold-400 bg-navy-800' : 'border-gold-300 text-navy-800 bg-white'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default HomeBooksCarousel;
