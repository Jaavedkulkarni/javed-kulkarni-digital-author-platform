import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from "../../seo/SEO";
import BookSchema from "../../seo/BookSchema";
import BreadcrumbSchema from "../../seo/BreadcrumbSchema";
import {
  ArrowLeft,
  BookOpen,
  Globe,
  Tag,
  User,
  ShoppingBag,
  Share2,
  Facebook,
  Linkedin,
  Copy,
  Check,
  ChevronRight,
  Lock,
  List,
  MessageSquareQuote,
  Sparkles,
  BookMarked,
  Instagram,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBookBySlug, getRelatedBooks, INSTAGRAM_AUTHOR_URL } from '../../data/books';

export default function BookPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const book = getBookBySlug(slug ?? '');

  if (!book) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-6 ${darkMode ? 'bg-navy-900' : 'bg-gray-50'}`}>
        <BookOpen className="w-16 h-16 text-gold-400" />
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-navy-800'}`}>
          पुस्तक आढळले नाही
        </h1>
        <Link to="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          मुख्यपृष्ठावर परत जा
        </Link>
      </div>
    );
  }

  const relatedBooks = getRelatedBooks(book.relatedSlugs);
  const pageUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bg = darkMode ? 'bg-navy-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-100';
  const textPrimary = darkMode ? 'text-white' : 'text-navy-800';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const divider = darkMode ? 'border-navy-700' : 'border-gray-200';

  return (
      <>
    <SEO
      title={`${book.title} | जावेद कुलकर्णी`}
      description={book.description}
      keywords={`${book.title}, ${book.category}, Marathi Book, जावेद कुलकर्णी`}
      image={book.cover}
      url={`https://javedkulkarni.com/books/${book.slug}`}
    />

<BookSchema
  title={book.title}
  description={book.description}
  image={book.cover}
  url={`https://javedkulkarni.com/books/${book.slug}`}
  isbn={book.isbn}
  language={book.language}
  amazonUrl={book.amazonUrl}
/>
<BreadcrumbSchema
  items={[
    {
      name: "मुख्यपृष्ठ",
      url: "https://javedkulkarni.com",
    },
    {
      name: "पुस्तके",
      url: "https://javedkulkarni.com/#books",
    },
    {
      name: book.title,
      url: `https://javedkulkarni.com/books/${book.slug}`,
    },
  ]}
/>
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* Top bar */}
      <div className={`sticky top-0 z-40 border-b ${darkMode ? 'bg-navy-900/95 border-navy-800' : 'bg-white/95 border-gray-200'} backdrop-blur-md`}>
        <div className="section-container">
          <div className="flex items-center gap-2 py-4 text-sm">
            <Link to="/" className={`hover:text-gold-500 transition-colors ${textSecondary}`}>
              मुख्यपृष्ठ
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => { window.location.href = '/#books'; }}
              className={`hover:text-gold-500 transition-colors ${textSecondary}`}
            >
              ग्रंथालय
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className={`font-medium ${textPrimary} truncate max-w-[200px]`}>{book.title}</span>
          </div>
        </div>
      </div>

      <div className="section-container py-12 lg:py-16">
        {/* Hero — cover + metadata */}
        <div className="grid lg:grid-cols-[340px_1fr] gap-12 lg:gap-16 mb-14">
          {/* Cover */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative group w-full max-w-[280px] lg:max-w-full mx-auto">
              <div className="absolute -inset-3 bg-gradient-to-br from-gold-400/30 to-navy-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl border ${darkMode ? 'border-navy-700' : 'border-gray-200'}`} style={{ aspectRatio: '2 / 3' }}>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-contain bg-white p-4"
                />
              </div>
            </div>

            {/* Buy on Amazon */}
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[280px] lg:max-w-full mx-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <ShoppingBag className="w-5 h-5" />
              Buy on Amazon
            </a>

            {/* Premium Read Sample section */}
            <div className={`w-full max-w-[280px] lg:max-w-full mx-auto rounded-2xl overflow-hidden border ${darkMode ? 'border-gold-500/30 bg-navy-800' : 'border-gold-300 bg-gold-50'}`}>
              <div className={`px-5 py-3 border-b ${darkMode ? 'border-gold-500/20 bg-gold-500/10' : 'border-gold-200 bg-gold-100'}`}>
                <p className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-gold-400' : 'text-gold-700'}`}>
                  <BookOpen className="w-4 h-4" />
                  📖 Read Sample
                </p>
              </div>
              <div className="p-5">
                <p className={`text-sm mb-4 ${textSecondary}`}>
                  Read the first pages online.
                </p>
                <Link
                  to={`/sample/${book.slug}`}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] ${
                    darkMode
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40 hover:bg-gold-500/30'
                      : 'bg-gold-500 text-white hover:bg-gold-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  🔒 Open Sample Reader
                </Link>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-8">
            {/* Category + language badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${darkMode ? 'bg-navy-700 text-gold-400 border border-navy-600' : 'bg-navy-100 text-navy-700 border border-navy-200'}`}>
                <Tag className="w-3.5 h-3.5" />
                {book.category}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${darkMode ? 'bg-navy-700 text-blue-400 border border-navy-600' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                <Globe className="w-3.5 h-3.5" />
                {book.language}
              </span>
            </div>

            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 ${textPrimary}`}>
                {book.title}
              </h1>
              <p className={`flex items-center gap-2 text-base ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
                <User className="w-4 h-4" />
                {book.author}
              </p>
            </div>

            {/* ISBN */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono ${darkMode ? 'bg-navy-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              <BookMarked className="w-3.5 h-3.5" />
              <span className="font-semibold not-italic">ISBN:</span> {book.isbn}
            </div>

            {/* Divider */}
            <hr className={`border-t ${divider}`} />

            {/* Description */}
            <div>
              <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${textPrimary}`}>
                <BookOpen className="w-5 h-5 text-gold-500" />
                पुस्तकाविषयी
              </h2>
              <p className={`text-base leading-relaxed ${textSecondary}`}>{book.description}</p>
            </div>

            {/* Why Read */}
            <div className={`p-6 rounded-2xl border-l-4 border-gold-500 ${darkMode ? 'bg-navy-800' : 'bg-gold-50'}`}>
              <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${textPrimary}`}>
                <Sparkles className="w-5 h-5 text-gold-500" />
                हे पुस्तक का वाचावे?
              </h2>
              <p className={`text-base leading-relaxed ${textSecondary}`}>{book.whyRead}</p>
            </div>

            {/* Social Share */}
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${textSecondary}`}>
                <Share2 className="w-4 h-4" />
                शेअर करा
              </h3>
              <div className="flex gap-2 flex-wrap">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${darkMode ? 'bg-blue-900/40 text-blue-400 hover:bg-blue-900/60' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href={`https://x.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(book.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${darkMode ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(book.title + ' ' + pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${darkMode ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${darkMode ? 'bg-navy-700 text-gray-300 hover:bg-navy-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Instagram Follow */}
              <div className={`mt-5 flex items-center justify-between gap-4 px-5 py-4 rounded-xl border ${
                darkMode ? 'bg-navy-800 border-navy-700' : 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 via-fuchsia-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary}`}>
                      Follow the Author on Instagram
                    </p>
                    <p className={`text-xs ${textSecondary}`}>@authorjavedkulkarni</p>
                  </div>
                </div>
                <a
                  href={INSTAGRAM_AUTHOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-rose-500 via-fuchsia-500 to-orange-400 hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  Follow
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Lower sections — Author's Note + TOC */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14">
          {/* Author's Note */}
          <div className={`p-8 rounded-2xl border ${cardBg}`}>
            <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <MessageSquareQuote className="w-5 h-5 text-gold-500" />
              लेखकाचे मनोगत
            </h2>
            <blockquote className={`text-base leading-relaxed italic border-l-4 border-gold-400 pl-5 ${textSecondary}`}>
              "{book.authorsNote}"
            </blockquote>
            <p className={`mt-4 text-sm font-medium ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
              — {book.author}
            </p>
          </div>

          {/* Table of Contents */}
          <div className={`p-8 rounded-2xl border ${cardBg}`}>
            <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <List className="w-5 h-5 text-gold-500" />
              अनुक्रमणिका
            </h2>
            <ol className="space-y-3">
              {book.tableOfContents.map((item, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 text-sm ${textSecondary}`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${darkMode ? 'bg-navy-700 text-gold-400' : 'bg-gold-100 text-gold-700'}`}>
                    {i + 1}
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ol>
            <p className={`mt-5 text-xs italic ${darkMode ? 'text-navy-500' : 'text-gray-400'}`}>
              * अनुक्रमणिका अद्यतन होऊ शकते
            </p>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="mb-14">
            <h2 className={`text-2xl font-bold mb-8 ${textPrimary}`}>
              संबंधित पुस्तके
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/books/${rel.slug}`}
                  className={`group flex gap-5 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardBg}`}
                >
                  <div className={`flex-shrink-0 w-20 rounded-xl overflow-hidden border ${darkMode ? 'border-navy-600' : 'border-gray-200'}`} style={{ aspectRatio: '2 / 3' }}>
                    <img src={rel.cover} alt={rel.title} className="w-full h-full object-contain bg-white p-1" />
                  </div>
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <span className={`text-xs font-semibold ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
                        {rel.category}
                      </span>
                      <h3 className={`text-sm font-bold mt-1 leading-snug line-clamp-2 ${textPrimary} group-hover:text-gold-500 transition-colors`}>
                        {rel.title}
                      </h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium mt-2 ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
                      अधिक वाचा
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Library */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-opacity-20 ${divider}`}>
          <button
            onClick={() => navigate('/#books')}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${darkMode ? 'bg-navy-800 text-white hover:bg-navy-700 border border-navy-700' : 'bg-white text-navy-700 hover:bg-navy-50 border border-gray-200 shadow-sm'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            ग्रंथालयात परत जा
          </button>
          <a
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <ShoppingBag className="w-4 h-4" />
            Amazon वर खरेदी करा
          </a>
        </div>
      </div>
    </div>
     </>
  );
}
