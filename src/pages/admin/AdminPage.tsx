import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import { isAdminUser, isReaderUser } from '../../lib/authRoles';
import { storeAdminReturnTo } from '../../lib/authRedirect';
import { adminPathFromView, adminViewFromPath } from '../../lib/adminPaths';

function AdminCmsContent() {
  const { currentView } = useAdmin();

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
  const { isAuthenticated, user, logout, currentView, setCurrentView } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdminUser(user)) return;
    const viewFromUrl = adminViewFromPath(location.pathname);
    if (viewFromUrl !== currentView) {
      setCurrentView(viewFromUrl);
    }
  }, [location.pathname, isAuthenticated, user, setCurrentView, currentView]);

  useEffect(() => {
    if (!isAuthenticated || !isAdminUser(user)) return;
    const expectedPath = adminPathFromView(currentView);
    if (location.pathname !== expectedPath) {
      navigate(expectedPath, { replace: true });
    }
  }, [currentView, isAuthenticated, user, navigate, location.pathname]);

  if (isAuthenticated && isReaderUser(user)) {
    return <AdminReaderBlocked onLogout={logout} />;
  }

  if (!isAuthenticated || !isAdminUser(user)) {
    storeAdminReturnTo();
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <ProductProvider>
      <BookProvider>
        <AdminCmsContent />
      </BookProvider>
    </ProductProvider>
  );
}

export function AdminPage() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="*" element={<AdminProtected />} />
    </Routes>
  );
}

export default AdminPage;
