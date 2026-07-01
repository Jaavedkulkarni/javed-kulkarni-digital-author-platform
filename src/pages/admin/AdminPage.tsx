import { AdminLogin } from './AdminLogin';
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

export function AdminPage() {
  const { isAuthenticated, currentView } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <ProductProvider>
      <BookProvider>
      {(() => {
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
      })()}
      </BookProvider>
    </ProductProvider>
  );
}

export default AdminPage;
