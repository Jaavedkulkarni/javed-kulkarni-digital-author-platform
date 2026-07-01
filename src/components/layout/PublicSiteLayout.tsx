import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ArrowLeft, ExternalLink } from 'lucide-react';
import { PublicAuthNav } from '../reader/PublicAuthNav';
import { PUBLIC_SITE_LINKS } from '../../lib/siteNavigation';

interface PublicSiteLayoutProps {
  children: ReactNode;
  title?: string;
  /** Show member-area wayfinding on reader pages */
  memberArea?: boolean;
  darkMode?: boolean;
  onDarkModeChange?: (value: boolean) => void;
}

export function PublicSiteLayout({
  children,
  title,
  memberArea = false,
  darkMode: darkModeProp,
  onDarkModeChange,
}: PublicSiteLayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localDark, setLocalDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  const darkMode = darkModeProp ?? localDark;

  useEffect(() => {
    if (darkModeProp !== undefined) return;
    setLocalDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setLocalDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [darkModeProp]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    if (onDarkModeChange) {
      onDarkModeChange(next);
    } else {
      document.documentElement.classList.toggle('dark', next);
      setLocalDark(next);
    }
  };

  const navLinkCls = (active: boolean) =>
    `px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
      active
        ? darkMode
          ? 'text-gold-400 bg-gold-400/10'
          : 'text-navy-700 bg-navy-100'
        : darkMode
          ? 'text-gray-300 hover:text-white hover:bg-navy-800'
          : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
    }`;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-navy-900' : 'bg-white'}`}>
      <header
        className={`sticky top-0 z-40 border-b ${
          darkMode ? 'bg-navy-900/95 border-navy-800 backdrop-blur-md' : 'bg-white/95 border-gray-200 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                ज
              </div>
              <span className={`font-semibold text-lg hidden sm:inline ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                जावेद कुलकर्णी
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {PUBLIC_SITE_LINKS.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navLinkCls(false)}
                  >
                    {item.label}
                    <ExternalLink className="w-3 h-3 inline ml-1 opacity-60" />
                  </a>
                ) : item.path === '/#books' ? (
                  <Link key={item.label} to="/" state={{ scrollTo: 'books' }} className={navLinkCls(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={navLinkCls(location.pathname === item.path)}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <PublicAuthNav darkMode={darkMode} />
              </div>
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-navy-800 text-gold-400' : 'bg-navy-100 text-navy-600'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-gray-300"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className={`lg:hidden border-t px-4 py-3 space-y-1 ${darkMode ? 'border-navy-800' : 'border-gray-200'}`}>
            {PUBLIC_SITE_LINKS.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm ${navLinkCls(false)}`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path === '/#books' ? '/' : item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm ${navLinkCls(location.pathname === item.path)}`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-2 border-t border-navy-800/50">
              <PublicAuthNav darkMode={darkMode} onNavigate={() => setMobileOpen(false)} className="flex-col items-stretch !gap-2" />
            </div>
          </div>
        )}
      </header>

      {memberArea && (
        <div className={`border-b ${darkMode ? 'bg-navy-800/40 border-navy-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3 text-sm">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 font-medium ${
                darkMode ? 'text-gold-400 hover:text-gold-300' : 'text-navy-600 hover:text-navy-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Website
            </Link>
            {title && (
              <>
                <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>/</span>
                <span className={darkMode ? 'text-white' : 'text-navy-800'}>{title}</span>
              </>
            )}
          </div>
        </div>
      )}

      <main className="flex-1">
        {title && !memberArea && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-navy-800'}`}>{title}</h1>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>

      <footer className={`border-t py-8 ${darkMode ? 'bg-navy-900 border-navy-800' : 'bg-navy-800 border-navy-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Javed Kulkarni. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-gold-400 transition-colors">Blog</Link>
            <Link to="/" className="hover:text-gold-400 transition-colors">Books</Link>
            <a
              href="https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400 transition-colors"
            >
              Store
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicSiteLayout;
