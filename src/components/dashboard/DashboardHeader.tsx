import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Menu, Moon, Search, Sun, User } from 'lucide-react';
import { useReader } from '../../context/ReaderContext';

const SEARCH_PLACEHOLDER = 'Search books, authors, articles...';

interface DashboardHeaderProps {
  darkMode: boolean;
  pageTitle: string;
  onToggleDarkMode: () => void;
  onOpenSidebar: () => void;
}

export function DashboardHeader({
  darkMode,
  pageTitle,
  onToggleDarkMode,
  onOpenSidebar,
}: DashboardHeaderProps) {
  const { profile, user } = useReader();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Reader';

  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileOpen]);

  const headerSurface = darkMode
    ? 'bg-[#0f1117]/95 border-navy-800'
    : 'bg-white/95 border-gray-200';
  const controlButton = darkMode
    ? 'text-gray-300 hover:bg-navy-800 hover:text-white'
    : 'text-navy-600 hover:bg-gray-100 hover:text-navy-800';

  const showPageTitle = pageTitle.trim().length > 0;

  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur-md ${headerSurface}`}
    >
      <div className="flex items-center gap-3 px-4 py-2 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          className={`rounded-lg p-2 lg:hidden focus:outline-none focus:ring-2 focus:ring-gold-400/50 ${controlButton}`}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          to="/reader"
          className="flex flex-shrink-0 items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          aria-label="Dashboard home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-bold text-navy-900">
            ज
          </div>
          <span className={`hidden font-semibold sm:inline ${darkMode ? 'text-white' : 'text-navy-800'}`}>
            AuthorOS
          </span>
        </Link>

        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <label htmlFor="dashboard-global-search" className="sr-only">
            Global search
          </label>
          <div className="relative">
            <Search
              className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
              aria-hidden="true"
            />
            <input
              id="dashboard-global-search"
              type="search"
              placeholder={SEARCH_PLACEHOLDER}
              disabled
              aria-disabled="true"
              className={`w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 ${
                darkMode
                  ? 'cursor-not-allowed border-navy-700 bg-navy-800/60 text-gray-400 placeholder:text-gray-500'
                  : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500 placeholder:text-gray-400'
              }`}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            disabled
            aria-label="Notifications"
            aria-disabled="true"
            className={`rounded-lg p-2 opacity-60 focus:outline-none focus:ring-2 focus:ring-gold-400/50 ${controlButton}`}
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className={`rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gold-400/50 ${controlButton}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold-400/50 sm:px-3 ${controlButton}`}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label="User profile menu"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  darkMode ? 'bg-navy-800 text-gold-400' : 'bg-navy-100 text-navy-700'
                }`}
              >
                <User className="h-4 w-4" />
              </span>
              <span className={`hidden max-w-[8rem] truncate text-sm font-medium sm:inline ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                {displayName}
              </span>
              <ChevronDown className={`hidden h-4 w-4 sm:block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className={`absolute right-0 mt-2 w-48 rounded-lg border py-1 shadow-lg ${
                  darkMode ? 'border-navy-700 bg-navy-800' : 'border-gray-200 bg-white'
                }`}
              >
                <p className={`px-4 py-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {user?.email}
                </p>
                {['Profile', 'Settings', 'Sign out'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    disabled
                    className={`block w-full px-4 py-2 text-left text-sm opacity-70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold-400/50 ${
                      darkMode ? 'text-gray-300' : 'text-navy-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`border-t px-4 py-1.5 sm:px-6 md:hidden ${darkMode ? 'border-navy-800' : 'border-gray-100'}`}>
        <label htmlFor="dashboard-global-search-mobile" className="sr-only">
          Global search
        </label>
        <div className="relative">
          <Search
            className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}
            aria-hidden="true"
          />
          <input
            id="dashboard-global-search-mobile"
            type="search"
            placeholder={SEARCH_PLACEHOLDER}
            disabled
            aria-disabled="true"
            className={`w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 ${
              darkMode
                ? 'cursor-not-allowed border-navy-700 bg-navy-800/60 text-gray-400'
                : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500'
            }`}
          />
        </div>
      </div>

      {showPageTitle ? (
        <div className={`px-4 pb-2 pt-0.5 sm:px-6 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
          <h1 className="truncate text-lg font-semibold">{pageTitle}</h1>
        </div>
      ) : null}
    </header>
  );
}

export default DashboardHeader;
