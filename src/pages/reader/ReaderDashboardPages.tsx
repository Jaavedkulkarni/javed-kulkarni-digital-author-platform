import type { ReactNode } from 'react';
import { DashboardShell } from '../../components/dashboard/DashboardShell';
import { READER_DASHBOARD_MENU } from '../../lib/dashboardNavigation';
import { ReaderDashboardWidgets } from '../../components/dashboard/widgets/ReaderDashboardWidgets';
import { MyLibraryContent } from '../../components/library/MyLibraryContent';
import { MyWishlistContent } from '../../components/wishlist/MyWishlistContent';
import { ReaderPlaceholder } from './ReaderPlaceholder';
import { useReader } from '../../context/ReaderContext';

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
  const { profile, user } = useReader();
  return (
    <ReaderDashboardLayout pageTitle="Profile">
      <div className="max-w-lg space-y-4 rounded-xl border border-navy-700 bg-navy-800 p-6">
        <ReaderPlaceholder title="Profile" description="Manage your reader profile details.">
          <div className="space-y-2 text-left text-sm text-gray-400">
            <p>
              <span className="text-gray-500">Email:</span> {user?.email}
            </p>
            <p>
              <span className="text-gray-500">Display name:</span> {profile?.display_name || '—'}
            </p>
            <p>
              <span className="text-gray-500">Language:</span> {profile?.language || '—'}
            </p>
            <p>
              <span className="text-gray-500">Membership:</span> {profile?.membership_status || 'free'}
            </p>
          </div>
        </ReaderPlaceholder>
      </div>
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
      <ReaderPlaceholder title="Settings" description="Notification and account preferences will be available here." />
    </ReaderDashboardLayout>
  );
}

export function ReaderMembershipPage() {
  const { profile } = useReader();
  return (
    <ReaderDashboardLayout pageTitle="Membership">
      <ReaderPlaceholder
        title="Membership"
        description={`Your current plan: ${profile?.membership_status || 'free'}. Membership upgrades will be available in a future sprint.`}
      />
    </ReaderDashboardLayout>
  );
}

export function ReaderOrdersPage() {
  return (
    <ReaderDashboardLayout pageTitle="Orders">
      <ReaderPlaceholder title="Orders" description="Your purchase history and order tracking will appear here." />
    </ReaderDashboardLayout>
  );
}
