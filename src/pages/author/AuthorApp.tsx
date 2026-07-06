import { FormEvent, useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useRoles } from '../../context/RoleContext';
import { useWorkspace } from '../../organization/hooks/useWorkspace';
import { canAccessAuthorDashboard } from '../../lib/permissions';
import { getUnauthorizedRedirect } from '../../lib/routeGuard';
import { RolePlaceholder, RoleShell } from '../../components/dashboard/RoleShell';
import { AUTHOR_SHELL_MENU } from '../../lib/authorPaths';
import { AuthorQueryProvider } from '../../author/providers/AuthorQueryProvider';
import { useAuthorDashboard } from '../../author/hooks/useAuthorDashboard';
import { useAuthorBooks } from '../../author/hooks/useAuthorBooks';
import { useAuthorContext } from '../../author/hooks/useAuthorContext';
import { useAuthorRealtime } from '../../author/hooks/useAuthorRealtime';
import { DashboardOverviewCards } from '../../author/components/dashboard/DashboardOverviewCards';
import { BookListPanel } from '../../author/components/books/BookListPanel';

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

function AuthorShellPage({ pageTitle, children }: { pageTitle: string; children: React.ReactNode }) {
  const { navigation } = useWorkspace();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const workspaceItems = navigation
    .filter((item) => item.isAvailable && item.workspace !== 'author')
    .map((item) => ({
      id: `workspace-${item.workspace}`,
      label: item.label,
      path: item.path,
      icon: LayoutDashboard,
    }));

  const menuItems = [...AUTHOR_SHELL_MENU, ...workspaceItems];

  return (
    <RoleShell
      title="Author Dashboard"
      subtitle="Author"
      menuItems={menuItems}
      pageTitle={pageTitle}
      onLogout={handleLogout}
      logoutRedirect="/"
    >
      {children}
    </RoleShell>
  );
}

function AuthorDashboardPage() {
  useAuthorRealtime();
  const { overview, isLoading } = useAuthorDashboard();
  return <DashboardOverviewCards overview={overview} isLoading={isLoading} />;
}

function AuthorBooksPage() {
  useAuthorRealtime();
  const { authorId, isLoading: contextLoading } = useAuthorContext();
  const { books, isLoading, createBook, submitForReview, isCreating, isSubmitting } = useAuthorBooks();
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Enter a book title.');
      return;
    }
    try {
      await createBook({ title: trimmed, primaryLanguage: 'mr' });
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create book.');
    }
  };

  if (contextLoading) {
    return <p className="text-sm text-gray-400">Loading author workspace...</p>;
  }

  if (!authorId) {
    return (
      <p className="text-sm text-gray-400">
        Author profile not linked yet. Complete reader onboarding to create your author profile.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
        <div>
          <label htmlFor="book-title" className="block text-xs text-gray-400 mb-1">
            New book title
          </label>
          <input
            id="book-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white"
            placeholder="Enter title"
          />
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="px-4 py-2 rounded-lg bg-gold-500 text-navy-900 text-sm font-semibold hover:bg-gold-400 disabled:opacity-50"
        >
          {isCreating ? 'Saving...' : 'Save Draft'}
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <BookListPanel
        books={books}
        isLoading={isLoading}
        onSubmitForReview={(bookId) => void submitForReview(bookId)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function AuthorShellPagePlaceholder({
  pageTitle,
  heading,
  description,
}: {
  pageTitle: string;
  heading: string;
  description: string;
}) {
  return (
    <AuthorShellPage pageTitle={pageTitle}>
      <RolePlaceholder heading={heading} description={description} />
    </AuthorShellPage>
  );
}

function AuthorRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <AuthorProtected>
            <AuthorShellPage pageTitle="Dashboard">
              <AuthorDashboardPage />
            </AuthorShellPage>
          </AuthorProtected>
        }
      />
      <Route
        path="books"
        element={
          <AuthorProtected>
            <AuthorShellPage pageTitle="Books">
              <AuthorBooksPage />
            </AuthorShellPage>
          </AuthorProtected>
        }
      />
      <Route
        path="articles"
        element={
          <AuthorProtected>
            <AuthorShellPagePlaceholder
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
            <AuthorShellPagePlaceholder
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
            <AuthorShellPagePlaceholder
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

export function AuthorApp() {
  return (
    <AuthorQueryProvider>
      <AuthorRoutes />
    </AuthorQueryProvider>
  );
}

export default AuthorApp;
