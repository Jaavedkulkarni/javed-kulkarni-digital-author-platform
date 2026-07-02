import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useRoles } from '../../context/RoleContext';
import { canAccessSuperAdminDashboard } from '../../lib/permissions';
import { getUnauthorizedRedirect } from '../../lib/routeGuard';
import { RolePlaceholder, RoleShell } from '../../components/dashboard/RoleShell';
import { SUPER_ADMIN_SHELL_MENU } from '../../lib/superAdminPaths';

function SuperAdminProtected({ children }: { children: React.ReactNode }) {
  const { roles, loading } = useRoles();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!canAccessSuperAdminDashboard(roles)) {
    return <Navigate to={getUnauthorizedRedirect(location.pathname)} replace />;
  }

  return <>{children}</>;
}

function SuperAdminShellPage({
  pageTitle,
  heading,
  description,
}: {
  pageTitle: string;
  heading: string;
  description: string;
}) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <RoleShell
      title="Super Admin"
      subtitle="Super Admin Dashboard"
      menuItems={SUPER_ADMIN_SHELL_MENU}
      pageTitle={pageTitle}
      onLogout={handleLogout}
      logoutRedirect="/admin/login"
    >
      <RolePlaceholder heading={heading} description={description} />
    </RoleShell>
  );
}

const SUPER_PAGES = [
  { path: 'website', pageTitle: 'Website', heading: 'Website Management', description: 'Global website configuration and homepage controls live here.' },
  { path: 'authors', pageTitle: 'Authors', heading: 'Authors', description: 'Invite and manage author accounts from this section.' },
  { path: 'admins', pageTitle: 'Admins', heading: 'Admins', description: 'Invite and manage admin accounts from this section.' },
  { path: 'readers', pageTitle: 'Readers', heading: 'Readers', description: 'View and manage reader accounts across the platform.' },
  { path: 'books', pageTitle: 'Books', heading: 'Books', description: 'Global book management for the entire platform.' },
  { path: 'articles', pageTitle: 'Articles', heading: 'Articles', description: 'Global blog and article management for the entire platform.' },
  { path: 'products', pageTitle: 'Products', heading: 'Products', description: 'Product catalog and commerce foundation controls.' },
  { path: 'media', pageTitle: 'Media', heading: 'Media', description: 'Global media library management.' },
  { path: 'newsletter', pageTitle: 'Newsletter', heading: 'Newsletter', description: 'Newsletter and subscriber management.' },
  { path: 'settings', pageTitle: 'Settings', heading: 'Settings', description: 'System-wide settings and platform configuration.' },
  { path: 'analytics', pageTitle: 'Analytics', heading: 'Analytics', description: 'Platform analytics and reporting.' },
] as const;

export function SuperAdminApp() {
  return (
    <Routes>
      <Route
        index
        element={
          <SuperAdminProtected>
            <SuperAdminShellPage
              pageTitle="Dashboard"
              heading="Super Admin Dashboard"
              description="Full system control for website, users, content, products, newsletter, settings, analytics, and roles."
            />
          </SuperAdminProtected>
        }
      />
      {SUPER_PAGES.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={
            <SuperAdminProtected>
              <SuperAdminShellPage
                pageTitle={page.pageTitle}
                heading={page.heading}
                description={page.description}
              />
            </SuperAdminProtected>
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/super" replace />} />
    </Routes>
  );
}

export default SuperAdminApp;
