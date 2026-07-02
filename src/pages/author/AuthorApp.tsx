import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useRoles } from '../../context/RoleContext';
import { canAccessAuthorDashboard } from '../../lib/permissions';
import { getUnauthorizedRedirect } from '../../lib/routeGuard';
import { RolePlaceholder, RoleShell } from '../../components/dashboard/RoleShell';
import { AUTHOR_SHELL_MENU } from '../../lib/authorPaths';

function AuthorProtected({ children }: { children: React.ReactNode }) {
  const { roles, loading } = useRoles();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!canAccessAuthorDashboard(roles)) {
    return <Navigate to={getUnauthorizedRedirect(location.pathname)} replace />;
  }

  return <>{children}</>;
}

function AuthorShellPage({ pageTitle, heading, description }: { pageTitle: string; heading: string; description: string }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <RoleShell
      title="Author Dashboard"
      subtitle="Author"
      menuItems={AUTHOR_SHELL_MENU}
      pageTitle={pageTitle}
      onLogout={handleLogout}
      logoutRedirect="/"
    >
      <RolePlaceholder heading={heading} description={description} />
    </RoleShell>
  );
}

export function AuthorApp() {
  return (
    <Routes>
      <Route
        index
        element={
          <AuthorProtected>
            <AuthorShellPage
              pageTitle="Dashboard"
              heading="Author Dashboard"
              description="Manage your own books, blog articles, media, and reader statistics from this workspace."
            />
          </AuthorProtected>
        }
      />
      <Route
        path="books"
        element={
          <AuthorProtected>
            <AuthorShellPage
              pageTitle="Books"
              heading="My Books"
              description="Author-scoped book management will be connected in a future sprint."
            />
          </AuthorProtected>
        }
      />
      <Route
        path="articles"
        element={
          <AuthorProtected>
            <AuthorShellPage
              pageTitle="Articles"
              heading="My Articles"
              description="Author-scoped blog article management will be connected in a future sprint."
            />
          </AuthorProtected>
        }
      />
      <Route
        path="media"
        element={
          <AuthorProtected>
            <AuthorShellPage
              pageTitle="Media"
              heading="My Media"
              description="Author-scoped media library access will be connected in a future sprint."
            />
          </AuthorProtected>
        }
      />
      <Route
        path="profile"
        element={
          <AuthorProtected>
            <AuthorShellPage
              pageTitle="Profile"
              heading="Author Profile"
              description="Manage your author profile details from this section in a future sprint."
            />
          </AuthorProtected>
        }
      />
      <Route path="*" element={<Navigate to="/author" replace />} />
    </Routes>
  );
}

export default AuthorApp;
