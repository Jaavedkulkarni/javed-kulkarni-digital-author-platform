import SEO from "./seo/SEO";
import StructuredData from "./seo/StructuredData";
import AuthorSchema from "./seo/AuthorSchema";

import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import {
  BookOpen,
  Menu,
  X,
  Moon,
  Sun,
  ExternalLink,
  User,
  PenTool,
  MessageCircle,
  Sparkles,
  Search,
} from 'lucide-react';
import { BlogProvider } from './context/BlogContext';
import { ReaderProvider } from './context/ReaderContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthBootstrapProvider } from './auth/bootstrap';
import { ToastProvider } from './context/ToastContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { AuthRouteEffects } from './components/auth/AuthRouteEffects';
import { AdminProvider } from './context/AdminContext';
import { RoleProvider } from './context/RoleContext';
import { RoleManagementProvider } from './roles/providers';
import { OrganizationModuleProvider } from './organization/providers';
import { PublicAuthNav } from './components/reader/PublicAuthNav';
import {
  getHomepageInitialData,
  loadHomepageBookData,
} from './lib/publicBooks';
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { SiteFooter } from './components/layout/SiteFooter';
import { HomePageContent } from './components/home/HomePageContent';

// Lazy load blog, book and admin pages
const LegalPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.LegalPage })));
const BlogHome = lazy(() => import('./pages/blog/BlogHome'));
const BlogDynamicPage = lazy(() => import('./pages/blog/BlogDynamicPage'));
const SearchPage = lazy(() => import('./pages/blog/SearchPage').then(m => ({ default: m.SearchPage })));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const AuthorApp = lazy(() => import('./pages/author/AuthorApp'));
const PlatformAdminApp = lazy(() => import('./pages/platform-admin/PlatformAdminApp'));
const SuperAdminApp = lazy(() => import('./pages/super/SuperAdminApp'));
const ReaderApp = lazy(() => import('./pages/reader/ReaderApp'));
const AuthApp = lazy(() => import('./auth/AuthApp'));
const BookPage = lazy(() => import('./pages/books/BookPage'));
const BookCategoryPage = lazy(() => import('./pages/books/BookCategoryPage'));
const SampleReaderPage = lazy(() => import('./pages/books/SampleReaderPage'));

// Data — Homepage UI Version 1.0 – Frozen
const AMAZON_AUTHOR_URL = 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C';

const navLinks = ['Home', 'Books', 'Writing', 'Store', 'About', 'Contact'];
const navLabels = ['मुख्यपृष्ठ', 'माझी पुस्तके', 'लेखन', 'स्टोअर', 'माझ्याविषयी', 'संपर्क'];

const SECTION_IDS: Record<string, string> = {
  Home: 'home',
  Books: 'books',
  Writing: 'writing',
  About: 'about',
  Contact: 'contact',
};

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
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = Object.values(SECTION_IDS);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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

    const catalogChannel = supabase
      .channel('public-catalog')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
        loadHomepageBookData().then((data) => {
          if (cancelled) return;
          setHomeBooks(data.books);
          setFeaturedBook(data.featured.book);
          setFeaturedBookHighlights(data.featured.highlights);
          setHomeCategories(data.categories);
        });
      })
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(catalogChannel);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const targetId = SECTION_IDS[id] ?? id.toLowerCase();
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItemClass = (isActive: boolean) =>
    isActive ? 'nav-link-brand-active' : `nav-link-brand ${darkMode ? 'text-gray-300' : 'text-navy-600'}`;

  const isNavActive = (link: string) => {
    if (link === 'Store') return false;
    return SECTION_IDS[link] === activeSection;
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
              {navLinks.map((link, i) =>
                link === 'Store' ? (
                  <a
                    key={link}
                    href={AMAZON_AUTHOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navItemClass(false)}
                  >
                    {navLabels[i]}
                  </a>
                ) : (
                  <button
                    key={link}
                    type="button"
                    onClick={() => scrollToSection(link)}
                    className={navItemClass(isNavActive(link))}
                  >
                    {navLabels[i]}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/blog/search"
                className={`p-2.5 rounded-lg transition-all duration-300 hover:bg-brand hover:text-white ${
                  darkMode ? 'text-gray-300' : 'text-navy-600'
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>
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
              {navLinks.map((link, i) =>
                link === 'Store' ? (
                  <a
                    key={link}
                    href={AMAZON_AUTHOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-brand hover:text-white ${
                      darkMode ? 'text-gray-300' : 'text-navy-600'
                    }`}
                  >
                    {navLabels[i]}
                  </a>
                ) : (
                  <button
                    key={link}
                    type="button"
                    onClick={() => {
                      scrollToSection(link);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-brand hover:text-white ${
                      isNavActive(link)
                        ? 'bg-brand text-white border-b-2 border-gold-400'
                        : darkMode
                          ? 'text-gray-300'
                          : 'text-navy-600'
                    }`}
                  >
                    {navLabels[i]}
                  </button>
                )
              )}
              <Link
                to="/blog/search"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-brand hover:text-white ${
                  darkMode ? 'text-gray-300' : 'text-navy-600'
                }`}
              >
                <Search className="w-4 h-4" />
                Search
              </Link>
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

      <SiteFooter darkMode={darkMode} />
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
      <AuthBootstrapProvider>
      <RoleProvider>
      <RoleManagementProvider>
      <OrganizationModuleProvider>
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

          {/* Author Routes */}
          <Route path="/author/*" element={<AuthorApp />} />

          {/* Platform Admin Operations */}
          <Route path="/platform-admin/*" element={<PlatformAdminApp />} />

          {/* Super Admin Routes */}
          <Route path="/super/*" element={<SuperAdminApp />} />

          {/* Authentication Routes */}
          <Route path="/auth/*" element={<AuthApp />} />

          {/* Reader Routes */}
          <Route path="/reader/*" element={<ReaderApp />} />

          {/* Main Website */}
          <Route path="*" element={<MainWebsite />} />
        </Routes>
      </Suspense>
      <ScrollToTopButton />
      </AuthModalProvider>
      </OrganizationModuleProvider>
      </RoleManagementProvider>
      </RoleProvider>
      </AuthBootstrapProvider>
      </ReaderProvider>
    </BlogProvider>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
