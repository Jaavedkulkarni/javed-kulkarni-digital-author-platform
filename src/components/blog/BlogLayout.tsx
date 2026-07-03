import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { useTheme } from '../../context/ThemeContext';
import { PublicAuthNav } from '../reader/PublicAuthNav';
import { Moon, Sun, Menu, X, Search, BookOpen, ExternalLink } from 'lucide-react';

interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  const { categories } = useBlog();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();

  const navItems = [
    { label: 'Blog होम', path: '/blog' },
    ...categories.slice(0, 5).map((cat) => ({
      label: cat.name,
      path: `/blog/${cat.slug}`,
    })),
  ];

  const isBlogActive = location.pathname === '/blog' || location.pathname.startsWith('/blog/');

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-navy-900' : 'bg-white'}`}>
      {/* Blog Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        darkMode ? 'bg-navy-900/95 backdrop-blur-md border-b border-navy-800' : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                ज
              </div>
              <div>
                <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  जावेद कुलकर्णी
                </span>
                <span className={`block text-xs ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
                  ब्लॉग
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  !isBlogActive
                    ? darkMode
                      ? 'text-gold-400 bg-gold-400/10'
                      : 'text-navy-600 bg-navy-100'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                      : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                }`}
              >
                Website
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    location.pathname === item.path
                      ? darkMode
                        ? 'text-gold-400 bg-gold-400/10'
                        : 'text-navy-700 bg-navy-100'
                      : darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                        : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <PublicAuthNav darkMode={darkMode} />
              </div>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'bg-navy-800 text-gray-300 hover:bg-navy-700 hover:text-white'
                    : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

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

        {/* Search Bar */}
        {searchOpen && (
          <div className={`border-t ${darkMode ? 'border-navy-800' : 'border-gray-200'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="लेख शोधा..."
                  className={`flex-1 px-4 py-3 rounded-lg ${
                    darkMode
                      ? 'bg-navy-800 border-navy-700 text-white placeholder-gray-400 focus:border-gold-400'
                      : 'bg-gray-50 border-gray-200 text-navy-800 placeholder-gray-400 focus:border-navy-500'
                  } border focus:outline-none focus:ring-2 focus:ring-gold-400/20`}
                />
                <Link
                  to={`/blog?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchOpen(false)}
                  className="btn-primary"
                >
                  शोधा
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t ${darkMode ? 'border-navy-800 bg-navy-900' : 'border-gray-200 bg-white'}`}>
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-navy-800'
                      : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className={`pt-3 border-t ${darkMode ? 'border-navy-800' : 'border-gray-200'}`}>
                <PublicAuthNav darkMode={darkMode} onNavigate={() => setMobileMenuOpen(false)} className="flex-col items-stretch !gap-2 px-2" />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Blog Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-navy-900 border-t border-navy-800' : 'bg-navy-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">श्रेणी</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/blog/${cat.slug}`}
                      className="text-gray-400 hover:text-gold-400 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors">
                    Website होम
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-gold-400 transition-colors">
                    ब्लॉग होम
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1"
                  >
                    Amazon Author Page
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                <a href="mailto:jaavedkulkarni@gmail.com" className="hover:text-gold-400 transition-colors">
                  jaavedkulkarni@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Javed Kulkarni. All Rights Reserved.
            </p>
            <Link to="/admin/login" className="text-gray-600 hover:text-gold-400 transition-colors text-xs">
              Admin Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
