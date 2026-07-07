import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminLogin } from './AdminLogin';
import { AdminReaderBlocked } from './AdminReaderBlocked';
import { AdminDashboard } from './AdminDashboard';
import { ArticleManager } from './ArticleManager';
import { BookManager } from './BookManager';
import { CommentManager } from './CommentManager';
import { SubscriberManager } from './SubscriberManager';
import { MediaLibrary } from './MediaLibrary';
import { CategoryManager } from './CategoryManager';
import { TagManager } from './TagManager';
import { SettingsPage } from './SettingsPage';
import { ProductTypeManager } from './ProductTypeManager';
import { FormatManager } from './FormatManager';
import { ProductManager } from './ProductManager';
import { ProductProvider } from '../../context/ProductContext';
import { BookProvider } from '../../context/BookContext';
import { useAdmin } from '../../context/AdminContext';
import { useRoles } from '../../context/RoleContext';
import { storeAdminReturnTo } from '../../lib/authRedirect';
import { trackCmsPage } from '../../lib/cmsNavigation';
import { adminViewFromPath } from '../../lib/adminPaths';
import {
  canAccessAdminDashboard,
  canAccessReaderDashboard,
} from '../../lib/permissions';
import { canAccessAdminView } from '../../lib/routeGuard';

function AdminCmsContent() {
  const location = useLocation();
  const { roles } = useRoles();
  const currentView = adminViewFromPath(location.pathname);

  if (!canAccessAdminView(currentView, roles)) {
    return <Navigate to="/admin" replace />;
  }

  switch (currentView) {
    case 'dashboard':
      return <AdminDashboard />;
    case 'articles':
    case 'create':
    case 'edit':
      return <ArticleManager />;
    case 'books':
    case 'book-create':
    case 'book-edit':
      return <BookManager />;
    case 'comments':
      return <CommentManager />;
    case 'subscribers':
      return <SubscriberManager />;
    case 'categories':
      return <CategoryManager />;
    case 'tags':
      return <TagManager />;
    case 'media':
      return <MediaLibrary />;
    case 'products':
    case 'product-create':
    case 'product-edit':
      return <ProductManager />;
    case 'product-types':
      return <ProductTypeManager />;
    case 'formats':
      return <FormatManager />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <AdminDashboard />;
  }
}

function AdminProtected() {
  const { isAuthenticated, logout } = useAdmin();
  const { roles, loading } = useRoles();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/admin/login') {
      trackCmsPage(`${location.pathname}${location.search}`);
    }
  }, [isAuthenticated, location.pathname, location.search]);

  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && canAccessReaderDashboard(roles) && !canAccessAdminDashboard(roles)) {
    return <AdminReaderBlocked onLogout={logout} />;
  }

  if (!isAuthenticated || !canAccessAdminDashboard(roles)) {
    storeAdminReturnTo();
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <AdminCmsContent />;
}

export function AdminPage() {
  return (
    <ProductProvider>
      <BookProvider>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route index element={<AdminProtected />} />
          <Route path="*" element={<AdminProtected />} />
        </Routes>
      </BookProvider>
    </ProductProvider>
  );
}

export default AdminPage;
