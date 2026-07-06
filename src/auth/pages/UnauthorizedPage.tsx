import { Link } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';

export function UnauthorizedPage() {
  return (
    <AuthShell title="Unauthorized" subtitle="You do not have access to this area">
      <p className="mb-6 text-sm text-gray-300">
        Your account does not have permission to view this page. Sign in with a different role or return to your
        dashboard.
      </p>
      <Link
        to="/auth/login"
        className="inline-flex w-full items-center justify-center rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900 transition-colors hover:bg-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
      >
        Back to Sign In
      </Link>
    </AuthShell>
  );
}

export default UnauthorizedPage;
