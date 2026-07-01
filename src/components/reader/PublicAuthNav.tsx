import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useReader } from '../../context/ReaderContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { consumeLastPublicPage, isPublicPath } from '../../lib/authRedirect';
import {
  getAuthenticatedMenuItems,
  resolveNavRole,
  type SiteNavItem,
} from '../../lib/siteNavigation';
import { ChevronDown } from 'lucide-react';

interface PublicAuthNavProps {
  darkMode?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function PublicAuthNav({ darkMode = false, className = '', onNavigate }: PublicAuthNavProps) {
  const { isReaderAuthenticated, signOut, profile, loading, user } = useReader();
  const { openAuthModal } = useAuthModal();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const linkCls = darkMode
    ? 'text-gray-300 hover:text-white hover:bg-navy-800'
    : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50';

  const btnCls = `px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${linkCls}`;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    const onPublicPage = isPublicPath(location.pathname);
    const destination = onPublicPage ? null : consumeLastPublicPage('/');
    await signOut();
    onNavigate?.();
    if (destination && location.pathname !== destination.split('?')[0]) {
      navigate(destination, { replace: true });
    }
  };

  const menuLinkCls = `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
    darkMode ? 'text-gray-300 hover:bg-navy-800 hover:text-white' : 'text-navy-700 hover:bg-navy-50'
  }`;

  const renderMenuItem = (item: SiteNavItem) => {
    if (item.action === 'logout') {
      return (
        <button key={item.id} type="button" onClick={handleLogout} className={`${menuLinkCls} w-full text-left text-red-400`}>
          <item.icon className="w-4 h-4" /> {item.label}
        </button>
      );
    }
    if (!item.path) return null;
    return (
      <Link
        key={item.id}
        to={item.path}
        onClick={() => { setOpen(false); onNavigate?.(); }}
        className={menuLinkCls}
      >
        <item.icon className="w-4 h-4" /> {item.label}
      </Link>
    );
  };

  if (loading) {
    return <div className={`h-9 w-24 rounded-lg bg-navy-700/30 animate-pulse ${className}`} />;
  }

  const navRole = resolveNavRole(user, isReaderAuthenticated);
  const menuItems = getAuthenticatedMenuItems(navRole);

  if (navRole !== 'guest') {
    const displayName =
      navRole === 'reader'
        ? profile?.display_name || 'Reader'
        : navRole === 'admin'
          ? 'Admin'
          : 'Account';
    const initials = displayName.charAt(0).toUpperCase();

    return (
      <div className={`relative ${className}`} ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`${btnCls} inline-flex items-center gap-2 max-w-[180px]`}
        >
          {profile?.avatar && navRole === 'reader' ? (
            <img src={profile.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <span className="w-7 h-7 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold flex items-center justify-center">
              {initials}
            </span>
          )}
          <span className="truncate">{displayName}</span>
          <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div
            className={`absolute right-0 mt-2 w-52 rounded-xl border shadow-xl z-50 py-1.5 ${
              darkMode ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-200'
            }`}
          >
            {menuItems.map(renderMenuItem)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button type="button" onClick={() => { openAuthModal('sign-in'); onNavigate?.(); }} className={btnCls}>
        Sign In
      </button>
      <button
        type="button"
        onClick={() => { openAuthModal('sign-up'); onNavigate?.(); }}
        className="px-3 py-2 rounded-lg font-medium text-sm bg-gold-500 text-navy-900 hover:bg-gold-400 transition-colors"
      >
        Sign Up
      </button>
    </div>
  );
}

export default PublicAuthNav;
