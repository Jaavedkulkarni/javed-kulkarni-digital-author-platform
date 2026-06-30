import SEO from "./seo/SEO";
import StructuredData from "./seo/StructuredData";
import AuthorSchema from "./seo/AuthorSchema";

import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  BookOpen,
  Menu,
  X,
  Moon,
  Sun,
  Mail,
  ExternalLink,
  User,
  PenTool,
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  MonitorSmartphone,
  Baby,
  BookHeart,
  Ghost,
  Lightbulb,
  Send,
  ArrowRight,
  ShoppingBag,
  Award,
  Globe,
  Quote,
  Instagram,
  Facebook,
} from 'lucide-react';
import { BlogProvider } from './context/BlogContext';
import { AdminProvider } from './context/AdminContext';
import { books } from './data/books';

// Lazy load blog, book and admin pages
const BlogHome = lazy(() => import('./pages/blog/BlogHome'));
const BlogDynamicPage = lazy(() => import('./pages/blog/BlogDynamicPage'));
const SearchPage = lazy(() => import('./pages/blog/SearchPage').then(m => ({ default: m.SearchPage })));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const BookPage = lazy(() => import('./pages/books/BookPage'));
const BookCategoryPage = lazy(() => import('./pages/books/BookCategoryPage'));
const SampleReaderPage = lazy(() => import('./pages/books/SampleReaderPage'));

// Data
const AMAZON_AUTHOR_URL = 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C';
const INSTAGRAM_URL = 'https://instagram.com/authorjavedkulkarni';
const FACEBOOK_URL = 'https://facebook.com/authorjavedkulkarni';

const readerCards = [
  { icon: Users, text: 'पालकांसाठी', desc: 'पालकत्वावरील अंतर्दृष्टी' },
  { icon: PenTool, text: 'विद्यार्थ्यांसाठी', desc: 'शैक्षणिक मार्गदर्शन' },
  { icon: Lightbulb, text: 'आत्मविकास शोधणाऱ्यांसाठी', desc: 'व्यक्तिगत विकास' },
  { icon: MonitorSmartphone, text: 'डिजिटल युग समजून घेऊ इच्छिणाऱ्यांसाठी', desc: 'तंत्रज्ञान आणि जीवन' },
  { icon: BookHeart, text: 'कथा आणि कादंबरी प्रेमींसाठी', desc: 'साहित्यिक सफर' },
  { icon: Ghost, text: 'भयकथा व कल्पनारम्य साहित्य वाचकांसाठी', desc: 'रोमांचक कथा' },
];

const categories = [
  { icon: Lightbulb, name: 'आत्मविकास', count: 3, color: 'from-amber-500 to-orange-500', slug: 'atmvikas' },
  { icon: Baby, name: 'पालकत्व', count: 1, color: 'from-pink-500 to-rose-500', slug: 'parenting' },
  { icon: MonitorSmartphone, name: 'डिजिटल जीवन', count: 4, color: 'from-cyan-500 to-blue-500', slug: 'digital-life' },
  { icon: BookOpen, name: 'कथा', count: 2, color: 'from-violet-500 to-purple-500', slug: 'katha' },
  { icon: Ghost, name: 'भयकथा', count: 1, color: 'from-slate-600 to-gray-800', slug: 'horror' },
  { icon: MessageCircle, name: 'विनोदी लेखन', count: 1, color: 'from-green-500 to-emerald-500', slug: 'humour' },
];

const blogCategories = [
  { icon: Heart, name: 'नातेसंबंध', color: 'bg-rose-500' },
  { icon: Users, name: 'पालकत्व', color: 'bg-pink-500' },
  { icon: MonitorSmartphone, name: 'डिजिटल जीवन', color: 'bg-blue-500' },
  { icon: Lightbulb, name: 'आत्मविकास', color: 'bg-amber-500' },
  { icon: Globe, name: 'समाज आणि वास्तव', color: 'bg-teal-500' },
];

const navLinks = ['Home', 'About', 'Books', 'Categories', 'Blog', 'Amazon', 'Contact'];
const navLabels = ['मुख्यपृष्ठ', 'माझ्याविषयी', 'पुस्तके', 'पुस्तक श्रेणी', 'ब्लॉग', 'Amazon', 'संपर्क'];

function MainWebsite() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToSection = (id: string) => {
    if (id === 'blog') return;
    const element = document.getElementById(id.toLowerCase());
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
    <SEO
      title="जावेद कुलकर्णी | मराठी लेखक | Amazon Published Author"
      description="मराठी लेखक जावेद कुलकर्णी यांच्या अधिकृत वेबसाइटवर पुस्तके, ब्लॉग, कथा, पालकत्व, आत्मविकास आणि डिजिटल जीवनावरील लेख वाचा."
      keywords="जावेद कुलकर्णी, Marathi Author, Marathi Books, Amazon Author, Marathi Blog"
      />

    <StructuredData />
    <AuthorSchema />

     <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-navy-900' : 'bg-white'}`}>
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? darkMode
              ? 'bg-navy-900/95 backdrop-blur-md shadow-lg'
              : 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                ज
              </div>
              <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                जावेद कुलकर्णी
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, i) => (
                link === 'Blog' ? (
                  <Link
                    key={link}
                    to="/blog"
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                        : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                    }`}
                  >
                    {navLabels[i]}
                  </Link>
                ) : link === 'Amazon' ? (
                  <a
                    key={link}
                    href={AMAZON_AUTHOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                        : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                    }`}
                  >
                    {navLabels[i]}
                  </a>
                ) : (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                        : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                    }`}
                  >
                    {navLabels[i]}
                  </button>
                )
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'bg-navy-800 text-gold-400 hover:bg-navy-700'
                    : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg bg-navy-100 text-navy-600 hover:bg-navy-200 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-900">
            <div className="section-container py-4 space-y-2">
              {navLinks.map((link, i) => (
                link === 'Blog' ? (
                  <Link
                    key={link}
                    to="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                        : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                    }`}
                  >
                    {navLabels[i]}
                  </Link>
                ) : link === 'Amazon' ? (
                  <a
                    key={link}
                    href={AMAZON_AUTHOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                        : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                    }`}
                  >
                    {navLabels[i]}
                  </a>
                ) : (
                  <button
                    key={link}
                    onClick={() => {
                      scrollToSection(link);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                        : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                    }`}
                  >
                    {navLabels[i]}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 text-gold-700 text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span>Amazon Published Author</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
                <span className={`block ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  जावेद कुलकर्णी
                </span>
              </h1>

              <p className="text-lg sm:text-xl mb-6 animate-slide-up animation-delay-100">
                <span className="inline-flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                  <span className={`font-medium ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
                    मराठी लेखक
                  </span>
                  <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>|</span>
                  <span className={`font-medium ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
                    ब्लॉगर
                  </span>
                  <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>|</span>
                  <span className={`font-medium ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
                    कथाकार
                  </span>
                </span>
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8 animate-slide-up animation-delay-200">
                {[
                  { icon: User, text: 'Author' },
                  { icon: PenTool, text: 'Blogger' },
                  { icon: MessageCircle, text: 'Storyteller' },
                  { icon: Award, text: 'Amazon Published' },
                ].map((badge) => (
                  <span
                    key={badge.text}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                      darkMode
                        ? 'bg-navy-800 text-gray-300 border border-navy-700'
                        : 'bg-navy-50 text-navy-700 border border-navy-200'
                    }`}
                  >
                    <badge.icon className="w-3.5 h-3.5 text-green-500" />
                    {badge.text}
                  </span>
                ))}
              </div>

              {/* Hero Description */}
              <p
                className={`text-base leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up animation-delay-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                लेखन ही माझ्यासाठी केवळ अभिव्यक्ती नाही, तर माणसांच्या मनाशी जोडणारी एक जिवंत यात्रा आहे.
                <br />
                <br />
                नातेसंबंध, पालकत्व, डिजिटल युग, आत्मविकास, सामाजिक वास्तव आणि कल्पनारम्य साहित्य
                या विषयांवर आधारित माझ्या पुस्तकांच्या विश्वात आपले स्वागत.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-scale-in animation-delay-400">
                <button onClick={() => scrollToSection('books')} className="btn-primary">
                  <BookOpen className="w-5 h-5" />
                  माझी पुस्तके
                </button>
                <a
                  href="https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <ExternalLink className="w-5 h-5" />
                  Amazon Author Page
                </a>
              </div>
            </div>

          {/* Right Content - Author Photo */}
          <div className="order-1 lg:order-2 flex justify-center animate-slide-in-right">
            <div className="relative">

              {/* Decorative background */}
              <div className="absolute -inset-4 bg-gradient-to-br from-gold-400/20 via-navy-400/20 to-gold-600/20 rounded-3xl blur-2xl animate-float" />

              {/* Photo */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-400/50 bg-navy-800">

            <img
              src="/images/author.webp"
              alt="मराठी लेखक जावेद कुलकर्णी यांचा फोटो"
              width={500}
              height={500}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
              draggable={false}
            />

              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 px-4 py-2 rounded-lg shadow-lg font-semibold text-sm">
                8+ Published Books
              </div>
                </div> 
                </div> 
            </div>
          </div>
      </section>

      {/* Tagline Section */}
      <section className="py-16 bg-gradient-to-r from-navy-500 via-navy-600 to-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />
        <div className="section-container relative">
          <div className="text-center">
            <Quote className="w-12 h-12 mx-auto text-gold-400/50 mb-4" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-white leading-relaxed">
              "जिथे शब्द नाही, तर हृदय बोलतं."
            </h2>
            <p className="mt-4 text-gold-200 text-lg">— जावेद कुलकर्णी</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className={`inline-block text-3xl sm:text-4xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-navy-800'
                }`}
              >
                माझ्याविषयी
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full" />
            </div>

            <div
              className={`p-8 sm:p-12 rounded-2xl ${
                darkMode ? 'bg-navy-800' : 'bg-white'
              } shadow-xl border ${darkMode ? 'border-navy-700' : 'border-gray-100'}`}
            >
              <div className="space-y-6 text-lg leading-relaxed">
                {[
                  'मी जावेद कुलकर्णी.',
                  'लेखन ही माझ्यासाठी केवळ अभिव्यक्ती नसून माणसांच्या मनाशी जोडणारी एक यात्रा आहे.',
                  'नातेसंबंध, पालकत्व, आत्मविकास, डिजिटल युगातील आव्हाने, सामाजिक वास्तव आणि कल्पनारम्य विश्व या विविध विषयांवर मी सातत्याने लेखन करत आहे.',
                  'माझ्या प्रत्येक पुस्तकामागे एक विचार, एक अनुभव आणि वाचकांच्या आयुष्यात सकारात्मक बदल घडवण्याची प्रामाणिक इच्छा आहे.',
                  'शब्दांच्या माध्यमातून विचारांची दारे उघडण्याचा आणि वाचकांना स्वतःकडे नव्याने पाहण्याचा हा माझा प्रयत्न आहे.',
                ].map((text, i) => (
                  <p
                    key={i}
                    className={`animate-slide-up ${
                      i === 0
                        ? `font-semibold text-xl ${darkMode ? 'text-gold-400' : 'text-navy-700'}`
                        : darkMode
                          ? 'text-gray-300'
                          : 'text-gray-700'
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      
      </section>

      {/* Featured Books Section */}
      <section id="books" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-900' : 'bg-gray-50'}`}>
        <div className="section-container">
          <div className="text-center mb-14">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
              darkMode ? 'bg-navy-800 text-gold-400' : 'bg-navy-100 text-navy-600'
            }`}>
              <BookOpen className="w-4 h-4" />
              प्रकाशित पुस्तके
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-navy-800'
              }`}
            >
              माझी पुस्तके
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              विचार, अनुभव आणि शब्दांची सफर — प्रत्येक पुस्तक एक नवा आयाम.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full mt-6" />
          </div>

          {/* Premium Books Grid — 5 / 3 / 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-7">
            {books.map((book, i) => (
              <article
                key={book.id}
                className={`group flex flex-col rounded-[22px] overflow-hidden transition-all duration-500 ease-out transform hover:-translate-y-2 ${
                  darkMode
                    ? 'bg-navy-800 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_24px_60px_rgba(218,165,32,0.18)] border border-navy-700/50'
                    : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(26,46,93,0.18)] border border-gray-100'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Book Cover — object-contain, 2/3, white bg, 18px padding */}
                <div className="relative bg-white p-[18px]">
                  <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '2 / 3' }}>
                  <img
                    src={book.cover}
                    alt={book.title}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  </div>
                  {/* Category Badge */}
                  <span
                    className={`absolute top-[26px] left-[26px] px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      darkMode
                        ? 'bg-navy-900/70 text-gold-400 border border-gold-500/30'
                        : 'bg-navy-700 text-white border border-gold-400/50 shadow-sm'
                    }`}
                  >
                    {book.category}
                  </span>
                </div>

                {/* Book Info */}
                <div className="flex flex-col flex-1 p-5 pt-4">
                  <h3
                    className={`font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors duration-300 ${
                      darkMode ? 'text-white group-hover:text-gold-400' : 'text-navy-800 group-hover:text-navy-600'
                    }`}
                  >
                    {book.title}
                  </h3>
                  <p className={`text-sm leading-relaxed line-clamp-3 mb-5 flex-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {book.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2.5 mt-auto">
                    <Link
                      to={`/books/${book.slug}`}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        darkMode
                          ? 'bg-navy-700 text-white hover:bg-navy-600'
                          : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
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

          {/* View All Button */}
          <div className="text-center mt-14">
            <a
              href={AMAZON_AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <BookOpen className="w-5 h-5" />
              सर्व पुस्तके पहा
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Reader Journey Section */}
      <section
        className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}
        id="categories"
      >
        <div className="section-container">
          <div className="text-center mb-12">
            <h2
              className={`inline-block text-3xl sm:text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-navy-800'
              }`}
            >
              माझं लेखन कोणासाठी?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {readerCards.map((card, i) => (
              <div
                key={i}
                className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  darkMode
                    ? 'bg-navy-800 hover:bg-navy-700'
                    : 'bg-white hover:bg-gradient-to-br hover:from-gold-50 hover:to-white shadow-lg hover:shadow-xl'
                } ${darkMode ? 'border border-navy-700' : ''}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    darkMode ? 'bg-gold-400/20 text-gold-400' : 'bg-gold-100 text-gold-600'
                  }`}
                >
                  <card.icon className="w-6 h-6" />
                </div>
                <h3
                  className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-navy-800'}`}
                >
                  {card.text}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Categories Section */}
      <section className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2
              className={`inline-block text-3xl sm:text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-navy-800'
              }`}
            >
              पुस्तक श्रेणी
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const catBooks = books.filter((b) => {
                const catNames: Record<string, string[]> = {
                  'आत्मविकास': ['आत्मविकास', 'Self Development'],
                  'पालकत्व': ['पालकत्व'],
                  'डिजिटल जीवन': ['डिजिटल जीवन', 'Technology'],
                  'कथा': ['कथा'],
                  'भयकथा': ['भयकथा'],
                  'विनोदी लेखन': ['विनोदी लेखन'],
                };
                return (catNames[cat.name] ?? [cat.name]).includes(b.category);
              });
              const preview = catBooks.slice(0, 2).map((b) => b.title);
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
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-md transition-transform group-hover:scale-110 flex-shrink-0`}
                  >
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white group-hover:text-gold-400' : 'text-navy-800'} transition-colors`}
                  >
                    {cat.name}
                  </h3>
                  <p
                    className={`text-xs mb-2 ${darkMode ? 'text-gold-500' : 'text-gold-600'} font-medium`}
                  >
                    {cat.count} {cat.count === 1 ? 'पुस्तक' : 'पुस्तके'}
                  </p>
                  {preview.length > 0 && (
                    <ul className={`space-y-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {preview.map((title, j) => (
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

      {/* Amazon Author Section */}
      <section className="py-20 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIi8+PC9zdmc+')] opacity-50" />
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy-900 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gold-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 mb-6">
              Amazon वर माझी सर्व पुस्तके
            </h2>
            <p className="text-navy-800/80 text-lg mb-8">
              माझी सर्व प्रकाशित पुस्तके Amazon Author Page वर उपलब्ध आहेत.
            </p>
            <a
              href="https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C"
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

      {/* Featured Quote Section */}
      <section
        className={`py-24 lg:py-32 ${darkMode ? 'bg-navy-900' : 'bg-white'} relative overflow-hidden`}
      >
        <div className="section-container relative">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-16 h-16 mx-auto text-gold-400/30 mb-8" />
            <blockquote
              className={`text-2xl sm:text-3xl lg:text-4xl font-display leading-relaxed ${
                darkMode ? 'text-white' : 'text-navy-800'
              }`}
            >
              "शब्द हे केवळ अक्षरांचे समूह नसतात,
              <br />
              ते माणसांच्या मनापर्यंत पोहोचणारे पूल असतात."
            </blockquote>
            <cite className="block mt-8 text-lg text-gold-500">— जावेद कुलकर्णी</cite>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog-link" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2
              className={`inline-block text-3xl sm:text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-navy-800'
              }`}
            >
              ताजे लेख
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {blogCategories.map((cat, i) => (
              <Link
                key={i}
                to="/blog"
                className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  darkMode
                    ? 'bg-navy-800 hover:bg-navy-700'
                    : 'bg-white shadow-lg hover:shadow-xl'
                } ${darkMode ? 'border border-navy-700' : ''}`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                >
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3
                  className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-navy-800'}`}
                >
                  {cat.name}
                </h3>
                <span className="flex items-center gap-2 text-gold-500 text-sm hover:text-gold-600 transition-colors">
                  Explore
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2
              className={`inline-block text-3xl sm:text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-navy-800'
              }`}
            >
              संपर्क
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div
              className={`p-8 rounded-2xl ${
                darkMode ? 'bg-navy-800' : 'bg-gray-50'
              } ${darkMode ? 'border border-navy-700' : ''}`}
            >
 <form className="space-y-6" autoComplete="on">
  <div>
    <label
      htmlFor="name"
      className={`block text-sm font-medium mb-2 ${
        darkMode ? "text-gray-300" : "text-navy-700"
      }`}
    >
      नाव
    </label>

    <input
      type="text"
      id="name"
      name="name"
      autoComplete="name"
      className={`w-full px-4 py-3 rounded-lg transition-colors ${
        darkMode
          ? "bg-navy-700 border-navy-600 text-white placeholder-gray-400 focus:border-gold-400"
          : "bg-white border-gray-300 text-navy-800 placeholder-gray-400 focus:border-navy-500"
      } border focus:outline-none focus:ring-2 focus:ring-gold-400/20`}
      placeholder="तुमचे नाव"
      required
    />
  </div>

  <div>
    <label
      htmlFor="email"
      className={`block text-sm font-medium mb-2 ${
        darkMode ? "text-gray-300" : "text-navy-700"
      }`}
    >
      ईमेल
    </label>

    <input
      type="email"
      id="email"
      name="email"
      autoComplete="email"
      className={`w-full px-4 py-3 rounded-lg transition-colors ${
        darkMode
          ? "bg-navy-700 border-navy-600 text-white placeholder-gray-400 focus:border-gold-400"
          : "bg-white border-gray-300 text-navy-800 placeholder-gray-400 focus:border-navy-500"
      } border focus:outline-none focus:ring-2 focus:ring-gold-400/20`}
      placeholder="तुमचा ईमेल"
      required
    />
  </div>

  <div>
    <label
      htmlFor="message"
      className={`block text-sm font-medium mb-2 ${
        darkMode ? "text-gray-300" : "text-navy-700"
      }`}
    >
      संदेश
    </label>

    <textarea
      id="message"
      name="message"
      autoComplete="off"
      rows={5}
      className={`w-full px-4 py-3 rounded-lg transition-colors resize-none ${
        darkMode
          ? "bg-navy-700 border-navy-600 text-white placeholder-gray-400 focus:border-gold-400"
          : "bg-white border-gray-300 text-navy-800 placeholder-gray-400 focus:border-navy-500"
      } border focus:outline-none focus:ring-2 focus:ring-gold-400/20`}
      placeholder="तुमचा संदेश..."
      required
    />
  </div>

  <button type="submit" className="btn-primary w-full">
    <Send className="w-5 h-5" />
    संदेश पाठवा
  </button>
</form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div
                className={`p-8 rounded-2xl ${
                  darkMode ? 'bg-navy-800' : 'bg-gradient-to-br from-navy-500 to-navy-700'
                } ${darkMode ? 'border border-navy-700' : ''}`}
              >
                <h3
                  className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-white'}`}
                >
                  संपर्क माहिती
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">ईमेल</p>
                      <a
                        href="mailto:jaavedkulkarni@gmail.com"
                        className="text-white font-medium hover:text-gold-400 transition-colors"
                      >
                        jaavedkulkarni@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Amazon Author Page</p>
                      <a
                        href="https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-medium hover:text-gold-400 transition-colors"
                      >
                        Amazon वर पाहा
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div
                className={`p-8 rounded-2xl ${
                  darkMode ? 'bg-navy-800 border border-navy-700' : 'bg-white shadow-lg'
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-navy-800'}`}
                >
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {navLinks.slice(0, -1).map((link, i) => (
                    link === 'Blog' ? (
                      <Link
                        key={link}
                        to="/blog"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-navy-700'
                            : 'text-navy-600 hover:text-navy-800 hover:bg-gray-100'
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                        {navLabels[i]}
                      </Link>
                    ) : link === 'Amazon' ? (
                      <a
                        key={link}
                        href={AMAZON_AUTHOR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-navy-700'
                            : 'text-navy-600 hover:text-navy-800 hover:bg-gray-100'
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                        {navLabels[i]}
                      </a>
                    ) : (
                      <button
                        key={link}
                        onClick={() => scrollToSection(link)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-navy-700'
                            : 'text-navy-600 hover:text-navy-800 hover:bg-gray-100'
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                        {navLabels[i]}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-16 ${
          darkMode ? 'bg-navy-900 border-t border-navy-800' : 'bg-navy-800'
        }`}
      >
        <div className="section-container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-xl shadow-lg">
                  ज
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xl">जावेद कुलकर्णी</h3>
                  <p className="text-gold-400 text-sm">मराठी लेखक | ब्लॉगर | कथाकार</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                जिथे शब्द नाही, तर हृदय बोलतं. नातेसंबंध, पालकत्व, डिजिटल जीवन आणि आत्मविकासावर
                आधारित पुस्तके.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:jaavedkulkarni@gmail.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  jaavedkulkarni@gmail.com
                </a>
                <a
                  href={AMAZON_AUTHOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Amazon Author Page
                </a>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <p className="text-white font-semibold text-sm mb-3">Follow Javed Kulkarni</p>
                <div className="flex items-center gap-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-gold-400 transition-colors"
                  >
                    ब्लॉग
                  </Link>
                </li>
                {navLinks.slice(0, -1).map((link, i) => (
                  <li key={link}>
                    {link === 'Amazon' ? (
                      <a
                        href={AMAZON_AUTHOR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gold-400 transition-colors"
                      >
                        {navLabels[i]}
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link)}
                        className="text-gray-400 hover:text-gold-400 transition-colors"
                      >
                        {navLabels[i]}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-semibold mb-4">पुस्तक श्रेणी</h4>
              <ul className="space-y-3">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollToSection('books')}
                      className="text-gray-400 hover:text-gold-400 transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-navy-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Javed Kulkarni. All Rights Reserved.
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                Crafted with <Heart className="w-4 h-4 text-red-500" /> for Marathi Literature
              </p>
            </div>
          </div>
        </div>
  </footer>
</div>
</>
);
}

function App() {
  return (
    <BlogProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-navy-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogHome />} />
          <Route path="/blog/search" element={<SearchPage />} />
          <Route path="/blog/:slug" element={<BlogDynamicPage />} />

          {/* Book Library Routes */}
          <Route path="/books/category/:slug" element={<BookCategoryPage />} />
          <Route path="/books/:slug" element={<BookPage />} />
          <Route path="/sample/:slug" element={<SampleReaderPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminProvider>
                <AdminPage />
              </AdminProvider>
            }
          />

          {/* Main Website */}
          <Route path="*" element={<MainWebsite />} />
        </Routes>
      </Suspense>
    </BlogProvider>
  );
}

export default App;
