import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export function AdminReaderBlocked({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy-800 border border-navy-700 rounded-xl p-8 text-center">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 text-sm mb-6">
          You are signed in as a reader. Admin CMS requires a separate admin account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/reader" className="px-4 py-2 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400">
            Reader Dashboard
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-lg border border-navy-600 text-gray-300 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminReaderBlocked;
