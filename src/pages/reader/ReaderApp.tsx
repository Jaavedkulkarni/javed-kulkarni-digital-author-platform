import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useReader } from '../../context/ReaderContext';
import { useRoles } from '../../context/RoleContext';
import { storeReaderProtectedReturn, isLoggingOut } from '../../lib/authRedirect';
import { useAuthModal } from '../../context/AuthModalContext';
import { PublicSiteLayout } from '../../components/layout/PublicSiteLayout';
import { ReaderSignIn } from './ReaderSignIn';
import { ReaderSignUp } from './ReaderSignUp';
import { ReaderForgotPassword } from './ReaderForgotPassword';
import { ReaderResetPassword } from './ReaderResetPassword';
import { ReaderVerifyEmail } from './ReaderVerifyEmail';
import {
  ReaderDashboardHome,
  ReaderLibraryPage,
  ReaderWishlistPage,
  ReaderProfilePage,
  ReaderHistoryPage,
  ReaderSettingsPage,
  ReaderMembershipPage,
  ReaderOrdersPage,
} from './ReaderDashboardPages';
import { ShieldAlert } from 'lucide-react';
import {
  canAccessAdminDashboard,
  canAccessAuthorDashboard,
  canAccessReaderDashboard,
  canAccessSuperAdminDashboard,
} from '../../lib/permissions';
import { getStaffDashboardPath } from '../../lib/roleRedirect';

function ReaderProtected({ children }: { children: React.ReactNode }) {
  const { isReaderAuthenticated, loading, user } = useReader();
  const { roles, loading: rolesLoading } = useRoles();
  const { openMembersLogin } = useAuthModal();
  const location = useLocation();

  useEffect(() => {
    if (loading || rolesLoading || isReaderAuthenticated) return;
    if (isLoggingOut()) return;
    storeReaderProtectedReturn(location.pathname, location.search);
    openMembersLogin();
  }, [loading, rolesLoading, isReaderAuthenticated, location.pathname, location.search, openMembersLogin]);

  if (loading || rolesLoading) {
    return (
      <PublicSiteLayout memberArea>
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </PublicSiteLayout>
    );
  }

  if (
    user &&
    !isReaderAuthenticated &&
    (canAccessSuperAdminDashboard(roles) || canAccessAdminDashboard(roles) || canAccessAuthorDashboard(roles)) &&
    !canAccessReaderDashboard(roles)
  ) {
    const staffPath = getStaffDashboardPath(roles);
    return (
      <PublicSiteLayout title="Staff Account" memberArea>
        <div className="max-w-md mx-auto bg-navy-800 border border-navy-700 rounded-xl p-8 text-center">
          <ShieldAlert className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Staff Account</h1>
          <p className="text-gray-400 text-sm mb-6">
            You are signed in with a staff account. Please use your role dashboard instead of the reader member area.
          </p>
          <Link to={staffPath} className="inline-block px-4 py-2 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400">
            Go to Dashboard
          </Link>
        </div>
      </PublicSiteLayout>
    );
  }

  if (!isReaderAuthenticated) {
    return (
      <PublicSiteLayout title="Sign in required" memberArea>
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-gray-400 text-sm mb-4">Please sign in to access this page.</p>
          <button
            type="button"
            onClick={() => openMembersLogin()}
            className="px-4 py-2 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400"
          >
            Members Login
          </button>
        </div>
      </PublicSiteLayout>
    );
  }

  return <>{children}</>;
}

export function ReaderApp() {
  return (
    <Routes>
      <Route path="sign-in" element={<ReaderSignIn />} />
      <Route path="sign-up" element={<ReaderSignUp />} />
      <Route path="forgot-password" element={<ReaderForgotPassword />} />
      <Route path="reset-password" element={<ReaderResetPassword />} />
      <Route path="verify-email" element={<ReaderVerifyEmail />} />
      <Route
        index
        element={
          <ReaderProtected>
            <ReaderDashboardHome />
          </ReaderProtected>
        }
      />
      <Route path="library" element={<ReaderProtected><ReaderLibraryPage /></ReaderProtected>} />
      <Route path="wishlist" element={<ReaderProtected><ReaderWishlistPage /></ReaderProtected>} />
      <Route path="orders" element={<ReaderProtected><ReaderOrdersPage /></ReaderProtected>} />
      <Route path="profile" element={<ReaderProtected><ReaderProfilePage /></ReaderProtected>} />
      <Route path="history" element={<ReaderProtected><ReaderHistoryPage /></ReaderProtected>} />
      <Route path="settings" element={<ReaderProtected><ReaderSettingsPage /></ReaderProtected>} />
      <Route path="membership" element={<ReaderProtected><ReaderMembershipPage /></ReaderProtected>} />
      <Route path="*" element={<Navigate to="/reader/library" replace />} />
    </Routes>
  );
}

export default ReaderApp;
