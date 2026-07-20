import { useState, useRef, useEffect } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useReader } from '../../context/ReaderContext';

import { useBootstrap } from '../../auth/bootstrap/hooks';

import { useRoles as useOrgRoles } from '../../organization/hooks/useRoles';

import { usePublicAuthFlow } from '../../auth/public/hooks/usePublicAuthFlow';

import { useToast } from '../../context/ToastContext';

import { consumeLastPublicPage, isPublicPath, markLoggingOut, clearLoggingOut } from '../../lib/authRedirect';

import {

  buildNavigationContext,

  buildPublicAuthenticatedMenuItems,

  getNavDisplayName,

  type SiteNavItem,

} from '../../lib/siteNavigation';

import { flattenNavItems } from '../../lib/navRendering';

import { ChevronDown } from 'lucide-react';



interface PublicAuthNavProps {

  darkMode?: boolean;

  className?: string;

  onNavigate?: () => void;

}



export function PublicAuthNav({ darkMode = false, className = '', onNavigate }: PublicAuthNavProps) {

  const { signOut, profile: readerProfile } = useReader();

  const {

    user: bootstrapUser,

    profile: bootstrapProfile,

    assignedRoles,

    isReady: bootstrapReady,

    loading: bootstrapLoading,

  } = useBootstrap();

  const {

    roles,

    loading: rolesLoading,

    profile: roleProfile,

    assignments,

    roleContext,

  } = useOrgRoles();

  const { handleMembersLogin, handleBecomeAuthor, handleRegisterPublisher } = usePublicAuthFlow();

  const { showToast } = useToast();

  const location = useLocation();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);



  const authUser = bootstrapUser;

  const displayRoles = bootstrapReady && assignedRoles.length > 0 ? assignedRoles : roles;

  const profile = bootstrapProfile ?? readerProfile ?? roleProfile;



  const linkCls = darkMode ? 'text-gray-300' : 'text-navy-600';



  const btnCls = `px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:bg-brand hover:text-white ${linkCls}`;



  const secondaryBtnCls = `px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 border ${

    darkMode

      ? 'border-navy-600 text-gray-300 hover:bg-navy-800 hover:text-white'

      : 'border-navy-200 text-navy-600 hover:bg-navy-50'

  }`;



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

    markLoggingOut();

    const onPublicPage = isPublicPath(location.pathname);

    const destination = onPublicPage ? null : consumeLastPublicPage('/');



    if (!onPublicPage && destination) {

      navigate(destination, { replace: true });

    }



    await signOut();

    clearLoggingOut();

    showToast('✓ Successfully Logged Out');

    onNavigate?.();

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



  if (authUser && (!bootstrapReady || bootstrapLoading || rolesLoading)) {

    return <div className={`h-9 w-24 rounded-lg bg-navy-700/30 animate-pulse ${className}`} />;

  }



  const menuItems = authUser

    ? flattenNavItems(

        buildPublicAuthenticatedMenuItems(

          buildNavigationContext({

            systemRoles: displayRoles,

            assignments,

            authRoles: roleContext?.authRoles,

          })

        )

      )

    : [];



  if (authUser && bootstrapReady) {

    const displayName = getNavDisplayName(

      displayRoles,

      profile?.full_name ?? profile?.display_name,

      authUser.email,

    );

    const initials = displayName.charAt(0).toUpperCase();



    return (

      <div className={`relative ${className}`} ref={menuRef}>

        <button

          type="button"

          onClick={() => setOpen(!open)}

          className={`${btnCls} inline-flex items-center gap-2 max-w-[200px]`}

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

            {menuItems.map(renderMenuItem)}

          </div>

        )}

      </div>

    );

  }

const SHOW_PUBLIC_AUTH = false;



  if (!SHOW_PUBLIC_AUTH) {
  return null;
}

return (

    <div className={`flex flex-wrap items-center gap-2 ${className}`}>

      <button

        type="button"

        onClick={() => { handleMembersLogin(); onNavigate?.(); }}

        className="px-4 py-2 rounded-lg font-medium text-sm btn-primary"

      >

        Members Login

      </button>

      <button

        type="button"

        onClick={() => { handleBecomeAuthor(); onNavigate?.(); }}

        className={secondaryBtnCls}

      >

        Become an Author

      </button>

      <button

        type="button"

        onClick={() => { handleRegisterPublisher(); onNavigate?.(); }}

        className={secondaryBtnCls}

      >

        Register as Publisher

      </button>

    </div>

  );

}



export default PublicAuthNav;

