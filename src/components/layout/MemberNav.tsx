import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MEMBER_AREA_NAV_ITEMS } from '../../lib/siteNavigation';

interface MemberNavProps {
  darkMode?: boolean;
}

export function MemberNav({ darkMode = false }: MemberNavProps) {
  const location = useLocation();

  const linkCls = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
      active
        ? darkMode
          ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
          : 'bg-navy-100 text-navy-700 border border-navy-200'
        : darkMode
          ? 'text-gray-300 hover:text-white hover:bg-navy-800'
          : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
    }`;

  return (
    <nav
      className={`border-b ${darkMode ? 'bg-navy-900/80 border-navy-800' : 'bg-white border-gray-200'}`}
      aria-label="Member navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <Link to="/" className={linkCls(false)}>
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </Link>
          <span className={`mx-1 ${darkMode ? 'text-navy-700' : 'text-gray-300'}`}>|</span>
          {MEMBER_AREA_NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.id} to={item.path!} className={linkCls(active)}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default MemberNav;
