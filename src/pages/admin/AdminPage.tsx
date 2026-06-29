import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { ArticleManager } from './ArticleManager';
import { CommentManager } from './CommentManager';
import { SubscriberManager } from './SubscriberManager';
import { MediaLibrary } from './MediaLibrary';
import { CategoryManager } from './CategoryManager';
import { TagManager } from './TagManager';
import { SettingsPage } from './SettingsPage';

export function AdminPage() {
  const { isAuthenticated, currentView } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  switch (currentView) {
    case 'dashboard':
      return <AdminDashboard />;
    case 'articles':
    case 'create':
    case 'edit':
      return <ArticleManager />;
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
    case 'settings':
      return <SettingsPage />;
    default:
      return <AdminDashboard />;
  }
}

export default AdminPage;
