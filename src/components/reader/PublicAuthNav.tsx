import { Link } from 'react-router-dom';
import { useReader } from '../../context/ReaderContext';
import { LogOut, User, BookOpen, Heart } from 'lucide-react';

interface PublicAuthNavProps {
  darkMode?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function PublicAuthNav({ darkMode = false, className = '', onNavigate }: PublicAuthNavProps) {
  const { isReaderAuthenticated, signOut, profile, loading } = useReader();

  const linkCls = darkMode
    ? 'text-gray-300 hover:text-white hover:bg-navy-800'
    : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50';

  const btnCls = `px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${linkCls}`;

  if (loading) {
    return <div className={`h-9 w-24 rounded-lg bg-navy-700/30 animate-pulse ${className}`} />;
  }

  if (isReaderAuthenticated) {
    return (
      <div className={`flex items-center gap-1 flex-wrap ${className}`}>
        <Link to="/reader/profile" onClick={onNavigate} className={`${btnCls} inline-flex items-center gap-1.5`}>
          <User className="w-4 h-4" />
          {profile?.display_name || 'Profile'}
        </Link>
        <Link to="/reader/library" onClick={onNavigate} className={`${btnCls} inline-flex items-center gap-1.5`}>
          <BookOpen className="w-4 h-4" />
          My Library
        </Link>
        <Link to="/reader/wishlist" onClick={onNavigate} className={`${btnCls} inline-flex items-center gap-1.5`}>
          <Heart className="w-4 h-4" />
          Wishlist
        </Link>
        <button
          type="button"
          onClick={() => { signOut(); onNavigate?.(); }}
          className={`${btnCls} inline-flex items-center gap-1.5`}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Link to="/reader/sign-in" onClick={onNavigate} className={btnCls}>
        Sign In
      </Link>
      <Link
        to="/reader/sign-up"
        onClick={onNavigate}
        className="px-3 py-2 rounded-lg font-medium text-sm bg-gold-500 text-navy-900 hover:bg-gold-400 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}

export default PublicAuthNav;
