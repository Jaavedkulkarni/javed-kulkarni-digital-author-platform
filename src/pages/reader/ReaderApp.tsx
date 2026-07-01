import { Navigate, Route, Routes } from 'react-router-dom';
import { useReader } from '../../context/ReaderContext';
import { isAdminUser } from '../../lib/authRoles';
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
} from './ReaderDashboardPages';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

function ReaderProtected({ children }: { children: React.ReactNode }) {
  const { isReaderAuthenticated, loading, user } = useReader();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user && isAdminUser(user) && !isReaderAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-navy-800 border border-navy-700 rounded-xl p-8 text-center">
          <ShieldAlert className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Admin Account</h1>
          <p className="text-gray-400 text-sm mb-6">
            You are signed in with an admin account. Please use the admin CMS instead of the reader dashboard.
          </p>
          <Link to="/admin" className="inline-block px-4 py-2 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400">
            Go to Admin CMS
          </Link>
        </div>
      </div>
    );
  }

  if (!isReaderAuthenticated) {
    return <Navigate to="/reader/sign-in" replace state={{ from: window.location.pathname }} />;
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
      <Route path="profile" element={<ReaderProtected><ReaderProfilePage /></ReaderProtected>} />
      <Route path="history" element={<ReaderProtected><ReaderHistoryPage /></ReaderProtected>} />
      <Route path="settings" element={<ReaderProtected><ReaderSettingsPage /></ReaderProtected>} />
      <Route path="*" element={<Navigate to="/reader" replace />} />
    </Routes>
  );
}

export default ReaderApp;
