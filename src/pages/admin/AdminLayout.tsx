import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  LayoutDashboard,
  BookOpen,
  Library,
  FolderOpen,
  Tags,
  Image,
  Mail,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'articles', label: 'लेख', icon: BookOpen },
  { id: 'books', label: 'पुस्तके', icon: Library },
  { id: 'categories', label: 'श्रेणी', icon: FolderOpen },
  { id: 'tags', label: 'Tags', icon: Tags },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'subscribers', label: 'Newsletter', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { currentView, setCurrentView, sidebarOpen, toggleSidebar, logout, isAuthenticated } = useAdmin();

  if (!isAuthenticated) return <>{children}</>;

  const activeLabel = menuItems.find((item) => item.id === currentView)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-navy-900 border-r border-navy-800 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-navy-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-lg flex-shrink-0">
            ज
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-none">जावेद कुलकर्णी</p>
            <p className="text-gold-400 text-xs mt-0.5">Blog CMS</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden ml-auto p-1 rounded text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
            Main
          </p>
          {menuItems.slice(0, 3).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={
                currentView === item.id ||
                (item.id === 'articles' && (currentView === 'create' || currentView === 'edit')) ||
                (item.id === 'books' && (currentView === 'book-create' || currentView === 'book-edit'))
              }
              onClick={() => setCurrentView(item.id as any)}
            />
          ))}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3 mt-5">
            Content
          </p>
          {menuItems.slice(3, 7).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={currentView === item.id}
              onClick={() => setCurrentView(item.id as any)}
            />
          ))}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3 mt-5">
            Settings
          </p>
          {menuItems.slice(7).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={currentView === item.id}
              onClick={() => setCurrentView(item.id as any)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-navy-800 px-3 py-4 space-y-1">
          <Link
            to="/blog"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Blog
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-white hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[#0f1117]/95 backdrop-blur-md border-b border-navy-800 px-4 sm:px-6 py-3 flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-gray-500 hidden sm:inline">Admin</span>
            <ChevronRight className="w-4 h-4 text-gray-600 hidden sm:block flex-shrink-0" />
            <span className="text-white font-medium truncate">{title ?? activeLabel}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setCurrentView('create' as any)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              नवीन लेख
            </button>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-sm font-bold flex-shrink-0">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  item,
  active,
  onClick,
}: {
  item: { id: string; label: string; icon: React.ElementType };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
          : 'text-gray-400 hover:text-white hover:bg-navy-800'
      }`}
    >
      <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-gold-400' : ''}`} />
      {item.label}
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />}
    </button>
  );
}

export default AdminLayout;
