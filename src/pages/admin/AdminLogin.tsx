import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { isAdminUser } from '../../lib/authRoles';
import { consumeAdminReturnTo } from '../../lib/authRedirect';

export function AdminLogin() {
  const { isAuthenticated, user, login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && isAdminUser(user)) {
      navigate(consumeAdminReturnTo('/admin'), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate(consumeAdminReturnTo('/admin'), { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  if (isAuthenticated && isAdminUser(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="bg-navy-800 rounded-xl p-8 shadow-xl space-y-6">
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-sm text-gray-300 mb-2">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm text-gray-300 mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
