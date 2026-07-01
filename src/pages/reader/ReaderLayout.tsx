import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useReader } from '../../context/ReaderContext';
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  User,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/reader', icon: LayoutDashboard },
  { label: 'My Library', path: '/reader/library', icon: BookOpen },
  { label: 'Wishlist', path: '/reader/wishlist', icon: Heart },
  { label: 'Profile', path: '/reader/profile', icon: User },
  { label: 'Reading History', path: '/reader/history', icon: History },
  { label: 'Settings', path: '/reader/settings', icon: Settings },
];

export function ReaderLayout({ children, title }: { children: ReactNode; title?: string }) {
  const { profile, signOut } = useReader();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-navy-900 border-r border-navy-800 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-5 border-b border-navy-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-bold">ज</div>
            <div>
              <p className="text-white font-bold text-sm">Reader Dashboard</p>
              <p className="text-gold-400 text-xs truncate">{profile?.display_name || 'वाचक'}</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              item.path === '/reader'
                ? location.pathname === '/reader'
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-navy-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-navy-800 px-3 py-4">
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-[#0f1117]/95 backdrop-blur-md border-b border-navy-800 px-4 py-3 flex items-center gap-4">
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-400">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-white font-medium">{title ?? 'Dashboard'}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default ReaderLayout;
