import type { ReactNode } from 'react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { READER_DASHBOARD_MENU } from '../../lib/dashboardNavigation';
import { ReaderDashboardWidgets } from '../../components/dashboard/widgets/ReaderDashboardWidgets';
import { MyLibraryContent } from '../../components/library/MyLibraryContent';
import { MyWishlistContent } from '../../components/wishlist/MyWishlistContent';
import { MyOrdersContent } from '../../components/orders/MyOrdersContent';
import { MyMembershipContent } from '../../components/membership/MyMembershipContent';
import { ReadingInsightsContent } from '../../components/reading-insights/ReadingInsightsContent';
import { MyNotificationsContent } from '../../components/notifications/MyNotificationsContent';
import { ProfileContent } from '../../components/profile/ProfileContent';
import { SettingsContent } from '../../components/settings/SettingsContent';
import { ReaderPlaceholder } from './ReaderPlaceholder';

function ReaderDashboardLayout({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children: ReactNode;
}) {
  return (
    <DashboardShell pageTitle={pageTitle} menuItems={READER_DASHBOARD_MENU} roleLabel="Reader">
      {children}
    </DashboardShell>
  );
}

export function ReaderDashboardHome() {
  return (
    <ReaderDashboardLayout pageTitle="">
      <ReaderDashboardWidgets />
    </ReaderDashboardLayout>
  );
}

export function ReaderLibraryPage() {
  return (
    <ReaderDashboardLayout pageTitle="My Library">
      <MyLibraryContent />
    </ReaderDashboardLayout>
  );
}

export function ReaderWishlistPage() {
  return (
    <ReaderDashboardLayout pageTitle="My Wishlist">
      <MyWishlistContent />
    </ReaderDashboardLayout>
  );
}

export function ReaderProfilePage() {
  return (
    <ReaderDashboardLayout pageTitle="Profile">
      <ProfileContent />
    </ReaderDashboardLayout>
  );
}

export function ReaderReadingInsightsPage() {
  return (
    <ReaderDashboardLayout pageTitle="Reading Insights">
      <ReadingInsightsContent />
    </ReaderDashboardLayout>
  );
}

export function ReaderNotificationsPage() {
  return (
    <ReaderDashboardLayout pageTitle="Notifications">
      <MyNotificationsContent />
    </ReaderDashboardLayout>
  );
}

export function ReaderHistoryPage() {
  return (
    <ReaderDashboardLayout pageTitle="Reading History">
      <ReaderPlaceholder title="Reading History" description="Your reading activity will be tracked here." />
    </ReaderDashboardLayout>
  );
}

export function ReaderSettingsPage() {
  return (
    <ReaderDashboardLayout pageTitle="Settings">
      <SettingsContent />
    </ReaderDashboardLayout>
  );
}

export function ReaderMembershipPage() {
  return (
    <ReaderDashboardLayout pageTitle="Membership">
      <MyMembershipContent />
    </ReaderDashboardLayout>
  );
}

export function ReaderOrdersPage() {
  return (
    <ReaderDashboardLayout pageTitle="Orders">
      <MyOrdersContent />
    </ReaderDashboardLayout>
  );
}
