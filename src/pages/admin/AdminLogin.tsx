import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function AdminLogin() {
  const { isAuthenticated, login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-navy-800 rounded-xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gold-500 flex items-center justify-center text-navy-900 text-3xl font-bold mb-4">
              ज
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 mt-2">ब्लॉग CMS मध्ये लॉगिन करा</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Use Supabase Auth credentials to login
          </p>
        </div>
      </div>
    </div>
  );
}
