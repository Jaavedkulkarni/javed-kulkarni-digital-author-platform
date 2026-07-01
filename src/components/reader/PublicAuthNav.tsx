import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReader } from '../../context/ReaderContext';
import { storeReaderReturnTo } from '../../lib/authRedirect';
import {
  LogOut,
  User,
  BookOpen,
  Heart,
  History,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface PublicAuthNavProps {
  darkMode?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function PublicAuthNav({ darkMode = false, className = '', onNavigate }: PublicAuthNavProps) {
  const { isReaderAuthenticated, signOut, profile, loading } = useReader();
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

  const goToSignIn = () => {
    storeReaderReturnTo();
    onNavigate?.();
  };

  const goToSignUp = () => {
    storeReaderReturnTo();
    onNavigate?.();
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    onNavigate?.();
  };

  const menuLinkCls = `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
    darkMode ? 'text-gray-300 hover:bg-navy-800 hover:text-white' : 'text-navy-700 hover:bg-navy-50'
  }`;

  if (loading) {
    return <div className={`h-9 w-24 rounded-lg bg-navy-700/30 animate-pulse ${className}`} />;
  }

  if (isReaderAuthenticated) {
    const displayName = profile?.display_name || 'Reader';
    const initials = displayName.charAt(0).toUpperCase();

    return (
      <div className={`relative ${className}`} ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`${btnCls} inline-flex items-center gap-2 max-w-[180px]`}
        >
          {profile?.avatar ? (
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
            <Link to="/reader/library" onClick={() => { setOpen(false); onNavigate?.(); }} className={menuLinkCls}>
              <BookOpen className="w-4 h-4" /> My Library
            </Link>
            <Link to="/reader/wishlist" onClick={() => { setOpen(false); onNavigate?.(); }} className={menuLinkCls}>
              <Heart className="w-4 h-4" /> Wishlist
            </Link>
            <Link to="/reader/profile" onClick={() => { setOpen(false); onNavigate?.(); }} className={menuLinkCls}>
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link to="/reader/history" onClick={() => { setOpen(false); onNavigate?.(); }} className={menuLinkCls}>
              <History className="w-4 h-4" /> Reading History
            </Link>
            <Link to="/reader/settings" onClick={() => { setOpen(false); onNavigate?.(); }} className={menuLinkCls}>
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <div className={`my-1 border-t ${darkMode ? 'border-navy-700' : 'border-gray-200'}`} />
            <button type="button" onClick={handleLogout} className={`${menuLinkCls} w-full text-left text-red-400`}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Link to="/reader/sign-in" onClick={goToSignIn} className={btnCls}>
        Sign In
      </Link>
      <Link
        to="/reader/sign-up"
        onClick={goToSignUp}
        className="px-3 py-2 rounded-lg font-medium text-sm bg-gold-500 text-navy-900 hover:bg-gold-400 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}

export default PublicAuthNav;
