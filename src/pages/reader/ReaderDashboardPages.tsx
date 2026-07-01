import { ReaderLayout } from './ReaderLayout';
import { ReaderPlaceholder } from './ReaderPlaceholder';
import { useReader } from '../../context/ReaderContext';

export function ReaderDashboardHome() {
  const { profile } = useReader();
  return (
    <ReaderLayout title="Dashboard">
      <ReaderPlaceholder
        title={`Welcome, ${profile?.display_name || 'Reader'}!`}
        description="Your reader dashboard is ready. Library, wishlist, and reading features will arrive in upcoming sprints."
      />
    </ReaderLayout>
  );
}

export function ReaderLibraryPage() {
  return (
    <ReaderLayout title="My Library">
      <ReaderPlaceholder title="My Library" description="Purchased and saved books will appear here." />
    </ReaderLayout>
  );
}

export function ReaderWishlistPage() {
  return (
    <ReaderLayout title="Wishlist">
      <ReaderPlaceholder title="Wishlist" description="Products you save for later will appear here." />
    </ReaderLayout>
  );
}

export function ReaderProfilePage() {
  const { profile, user } = useReader();
  return (
    <ReaderLayout title="Profile">
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
    </ReaderLayout>
  );
}

export function ReaderHistoryPage() {
  return (
    <ReaderLayout title="Reading History">
      <ReaderPlaceholder title="Reading History" description="Your reading activity will be tracked here." />
    </ReaderLayout>
  );
}

export function ReaderSettingsPage() {
  return (
    <ReaderLayout title="Settings">
      <ReaderPlaceholder title="Settings" description="Notification and account preferences will be available here." />
    </ReaderLayout>
  );
}
