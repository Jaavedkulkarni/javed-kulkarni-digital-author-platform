import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ExternalLink, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PublicAuthNav } from '../reader/PublicAuthNav';
import { MemberNav } from './MemberNav';
import { SiteFooter } from './SiteFooter';
import { PUBLIC_SITE_LINKS } from '../../lib/siteNavigation';

interface PublicSiteLayoutProps {
  children: ReactNode;
  title?: string;
  /** Show member-area navigation bar */
  memberArea?: boolean;
}

export function PublicSiteLayout({ children, title, memberArea = false }: PublicSiteLayoutProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkCls = (active: boolean) =>
    active ? 'nav-link-brand-active' : `nav-link-brand ${darkMode ? 'text-gray-300' : 'text-navy-600'}`;

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

            {!memberArea && (
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
                  ) : (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={navLinkCls(
                        item.path.startsWith('/#') ? false : location.pathname === item.path
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            )}

            <div className="flex items-center gap-2">
              <Link
                to="/blog/search"
                className={`p-2 rounded-lg transition-all duration-300 hover:bg-brand hover:text-white ${
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
                type="button"
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-navy-800 text-gold-400' : 'bg-navy-100 text-navy-600'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {!memberArea && (
                <button
                  type="button"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 rounded-lg bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-gray-300"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {!memberArea && mobileOpen && (
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
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm ${navLinkCls(
                    item.path.startsWith('/#') ? false : location.pathname === item.path
                  )}`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-2 border-t border-navy-800/50">
              <Link
                to="/blog/search"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${navLinkCls(false)}`}
              >
                <Search className="w-4 h-4" />
                Search
              </Link>
              <PublicAuthNav darkMode={darkMode} onNavigate={() => setMobileOpen(false)} className="flex-col items-stretch !gap-2 mt-2" />
            </div>
          </div>
        )}
      </header>

      {memberArea && <MemberNav darkMode={darkMode} />}

      {title && memberArea && (
        <div className={`border-b ${darkMode ? 'bg-navy-800/40 border-navy-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-navy-800'}`}>{title}</h1>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>

      <SiteFooter darkMode={darkMode} />
    </div>
  );
}

export default PublicSiteLayout;
