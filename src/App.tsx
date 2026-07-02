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
  Heart,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Award,
  Instagram,
  Facebook,
} from 'lucide-react';
import { BlogProvider } from './context/BlogContext';
import { ReaderProvider } from './context/ReaderContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { AuthRouteEffects } from './components/auth/AuthRouteEffects';
import { AdminProvider } from './context/AdminContext';
import { PublicAuthNav } from './components/reader/PublicAuthNav';
import {
  getHomepageInitialData,
  loadHomepageBookData,
} from './lib/publicBooks';
import { HomePageContent } from './components/home/HomePageContent';

// Lazy load blog, book and admin pages
const LegalPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.LegalPage })));
const BlogHome = lazy(() => import('./pages/blog/BlogHome'));
const BlogDynamicPage = lazy(() => import('./pages/blog/BlogDynamicPage'));
const SearchPage = lazy(() => import('./pages/blog/SearchPage').then(m => ({ default: m.SearchPage })));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const ReaderApp = lazy(() => import('./pages/reader/ReaderApp'));
const BookPage = lazy(() => import('./pages/books/BookPage'));
const BookCategoryPage = lazy(() => import('./pages/books/BookCategoryPage'));
const SampleReaderPage = lazy(() => import('./pages/books/SampleReaderPage'));

// Data
const AMAZON_AUTHOR_URL = 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C';
const INSTAGRAM_URL = 'https://instagram.com/authorjavedkulkarni';
const FACEBOOK_URL = 'https://facebook.com/authorjavedkulkarni';

const navLinks = ['Home', 'About', 'Books', 'Categories', 'Blog', 'Amazon', 'Contact'];
const navLabels = ['मुख्यपृष्ठ', 'माझ्याविषयी', 'पुस्तके', 'पुस्तक श्रेणी', 'ब्लॉग', 'Amazon', 'संपर्क'];

const homepageInitialData = getHomepageInitialData();

function MainWebsite() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [homeBooks, setHomeBooks] = useState(homepageInitialData.books);
  const [featuredBook, setFeaturedBook] = useState(homepageInitialData.featured.book);
  const [featuredBookHighlights, setFeaturedBookHighlights] = useState(
    homepageInitialData.featured.highlights
  );
  const [homeCategories, setHomeCategories] = useState(homepageInitialData.categories);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadHomepageBookData().then((data) => {
      if (cancelled) return;

      setHomeBooks(data.books);
      setFeaturedBook(data.featured.book);
      setFeaturedBookHighlights(data.featured.highlights);
      setHomeCategories(data.categories);
    });

    return () => {
      cancelled = true;
    };
  }, []);

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
              <div className="hidden lg:block">
                <PublicAuthNav darkMode={darkMode} />
              </div>
              <button
                onClick={toggleDarkMode}
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
              <div className="pt-3 border-t border-navy-200 dark:border-navy-800">
                <PublicAuthNav darkMode={darkMode} onNavigate={() => setMobileMenuOpen(false)} className="flex-col items-stretch !gap-2" />
              </div>
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

      <HomePageContent
        darkMode={darkMode}
        featuredBook={featuredBook}
        featuredBookHighlights={featuredBookHighlights}
        homeBooks={homeBooks}
        homeCategories={homeCategories}
      />

      {/* Footer */}
      <footer
        id="contact"
        className={`py-16 ${
          darkMode ? 'bg-navy-900 border-t border-navy-800' : 'bg-navy-800'
        }`}
      >
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-12">
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
                {homeCategories.map((cat, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollToSection('Categories')}
                      className="text-gray-400 hover:text-gold-400 transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className="text-gray-400 hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-gold-400 transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link to="/refund" className="text-gray-400 hover:text-gold-400 transition-colors">Refund Policy</Link></li>
                <li><Link to="/shipping" className="text-gray-400 hover:text-gold-400 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-gold-400 transition-colors">Cookie Policy</Link></li>
                <li><a href="#contact" className="text-gray-400 hover:text-gold-400 transition-colors">Contact</a></li>
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
    <ThemeProvider>
    <ToastProvider>
    <BlogProvider>
      <ReaderProvider>
      <AuthModalProvider>
      <AuthRouteEffects />
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

          {/* Legal Pages */}
          <Route path="/privacy" element={<LegalPage page="privacy" />} />
          <Route path="/terms" element={<LegalPage page="terms" />} />
          <Route path="/refund" element={<LegalPage page="refund" />} />
          <Route path="/shipping" element={<LegalPage page="shipping" />} />
          <Route path="/cookies" element={<LegalPage page="cookies" />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminProvider>
                <AdminPage />
              </AdminProvider>
            }
          />

          {/* Reader Routes */}
          <Route path="/reader/*" element={<ReaderApp />} />

          {/* Main Website */}
          <Route path="*" element={<MainWebsite />} />
        </Routes>
      </Suspense>
      </AuthModalProvider>
      </ReaderProvider>
    </BlogProvider>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
