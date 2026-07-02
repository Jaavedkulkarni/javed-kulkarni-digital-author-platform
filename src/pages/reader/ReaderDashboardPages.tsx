import { PublicSiteLayout } from '../../components/layout/PublicSiteLayout';
import { ReaderPlaceholder } from './ReaderPlaceholder';
import { useReader } from '../../context/ReaderContext';

export function ReaderDashboardHome() {
  const { profile } = useReader();
  return (
    <PublicSiteLayout title="My Account" memberArea>
      <ReaderPlaceholder
        title={`Welcome, ${profile?.display_name || 'Reader'}!`}
        description="Your member area is ready. Library, wishlist, and reading features will arrive in upcoming sprints."
      />
    </PublicSiteLayout>
  );
}

export function ReaderLibraryPage() {
  return (
    <PublicSiteLayout title="My Library" memberArea>
      <ReaderPlaceholder title="My Library" description="Purchased and saved books will appear here." />
    </PublicSiteLayout>
  );
}

export function ReaderWishlistPage() {
  return (
    <PublicSiteLayout title="Wishlist" memberArea>
      <ReaderPlaceholder title="Wishlist" description="Products you save for later will appear here." />
    </PublicSiteLayout>
  );
}

export function ReaderProfilePage() {
  const { profile, user } = useReader();
  return (
    <PublicSiteLayout title="Profile" memberArea>
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 max-w-lg space-y-4">
        <ReaderPlaceholder title="Profile" description="Manage your reader profile details.">
          <div className="text-left space-y-2 text-sm text-gray-400">
            <p><span className="text-gray-500">Email:</span> {user?.email}</p>
            <p><span className="text-gray-500">Display name:</span> {profile?.display_name || '—'}</p>
            <p><span className="text-gray-500">Language:</span> {profile?.language || '—'}</p>
            <p><span className="text-gray-500">Membership:</span> {profile?.membership_status || 'free'}</p>
          </div>
        </ReaderPlaceholder>
      </div>
    </PublicSiteLayout>
  );
}

export function ReaderHistoryPage() {
  return (
    <PublicSiteLayout title="Reading History" memberArea>
      <ReaderPlaceholder title="Reading History" description="Your reading activity will be tracked here." />
    </PublicSiteLayout>
  );
}

export function ReaderSettingsPage() {
  return (
    <PublicSiteLayout title="Settings" memberArea>
      <ReaderPlaceholder title="Settings" description="Notification and account preferences will be available here." />
    </PublicSiteLayout>
  );
}

export function ReaderMembershipPage() {
  const { profile } = useReader();
  return (
    <PublicSiteLayout title="Membership" memberArea>
      <ReaderPlaceholder
        title="Membership"
        description={`Your current plan: ${profile?.membership_status || 'free'}. Membership upgrades will be available in a future sprint.`}
      />
    </PublicSiteLayout>
  );
}

export function ReaderOrdersPage() {
  return (
    <PublicSiteLayout title="Orders" memberArea>
      <ReaderPlaceholder title="Orders" description="Your purchase history and order tracking will appear here." />
    </PublicSiteLayout>
  );
}
