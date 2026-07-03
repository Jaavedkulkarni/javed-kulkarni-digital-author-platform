import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ExternalLink } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PublicAuthNav } from '../reader/PublicAuthNav';
import { MemberNav } from './MemberNav';
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
    `relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-navy-800 hover:text-white ${
      active
        ? 'bg-navy-800 text-white after:absolute after:bottom-0.5 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-gold-400'
        : darkMode
          ? 'text-gray-300'
          : 'text-navy-600'
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
              <PublicAuthNav darkMode={darkMode} onNavigate={() => setMobileOpen(false)} className="flex-col items-stretch !gap-2" />
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

      <footer className={`border-t py-8 ${darkMode ? 'bg-navy-900 border-navy-800' : 'bg-navy-800 border-navy-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-gold-400">Home</Link></li>
                <li><Link to="/#books" className="hover:text-gold-400">Books</Link></li>
                <li><Link to="/blog" className="hover:text-gold-400">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-gold-400">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-gold-400">Terms &amp; Conditions</Link></li>
                <li><Link to="/refund" className="hover:text-gold-400">Refund Policy</Link></li>
                <li><Link to="/shipping" className="hover:text-gold-400">Shipping Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-gold-400">Cookie Policy</Link></li>
                <li><Link to="/#contact" className="hover:text-gold-400">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Javed Kulkarni. All Rights Reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
              <Link to="/blog" className="hover:text-gold-400 transition-colors">Blog</Link>
              <a href="https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">Store</a>
              <Link to="/admin/login" className="text-gray-600 hover:text-gold-400 transition-colors text-xs">
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicSiteLayout;
