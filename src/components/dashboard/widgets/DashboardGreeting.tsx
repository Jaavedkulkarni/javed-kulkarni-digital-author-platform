import { useReader } from '../../../context/ReaderContext';

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function DashboardGreeting() {
  const { profile, user } = useReader();
  const greeting = getTimeGreeting();
  const readerName = profile?.display_name || user?.email?.split('@')[0] || 'Reader';

  return (
    <section aria-label="Dashboard greeting" className="mb-2">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{greeting},</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 dark:text-white sm:text-3xl">
        {readerName} <span aria-hidden="true">👋</span>
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
        Welcome back. Continue your reading journey.
      </p>
    </section>
  );
}

export default DashboardGreeting;
