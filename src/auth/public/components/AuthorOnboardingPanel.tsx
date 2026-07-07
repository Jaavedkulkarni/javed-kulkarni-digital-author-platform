import { memo, useState } from 'react';
import { useRoles } from '../../../context/RoleContext';
import { useOrganizationServices } from '../../../organization/hooks/useOrganizationServices';
import { useBootstrap } from '../../bootstrap/hooks';
import { AlertCircle, CheckCircle2, User } from 'lucide-react';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';

export interface AuthorOnboardingPanelProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export const AuthorOnboardingPanel = memo(function AuthorOnboardingPanel({
  onComplete,
  onCancel,
}: AuthorOnboardingPanelProps) {
  const { profile, refreshRoles } = useRoles();
  const { refresh: refreshBootstrap } = useBootstrap();
  const { onboarding } = useOrganizationServices();
  const [displayName, setDisplayName] = useState(
    () =>
      profile?.full_name?.trim() ||
      profile?.email?.split('@')[0] ||
      '',
  );
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) {
      setError('Sign in required.');
      return;
    }
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onboarding.becomeAuthor({
        userId: profile.id,
        displayName: displayName.trim(),
      });
      if (!result.success) {
        setError(result.errors?.join(' ') ?? 'Could not complete author onboarding.');
        return;
      }
      await refreshRoles();
      await refreshBootstrap();
      setDone(true);
      window.setTimeout(onComplete, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete author onboarding.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-4 py-2">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <p className="text-gray-300 text-sm font-medium">Author profile activated. Opening your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm text-center mb-4">
        Complete your author profile to start publishing on AuthorOS.
      </p>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Display Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className={`${inputCls} pl-10`}
              placeholder="Your author name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Bio (optional)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="Tell readers about yourself"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50"
        >
          {loading ? 'Activating...' : 'Complete Author Profile'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
});

export default AuthorOnboardingPanel;
