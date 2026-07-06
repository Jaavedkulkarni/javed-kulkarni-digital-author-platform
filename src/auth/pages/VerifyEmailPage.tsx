import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { VerifyEmailPanel } from '../components/VerifyEmailPanel';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { getPendingVerificationTokenForEmail } from '../services/mockAuthService';
import { getPostLoginPath } from '../utils/roleRouting';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pendingVerificationEmail } = useAuth();
  const { role } = useRole();

  const email = searchParams.get('email') ?? pendingVerificationEmail ?? undefined;
  const token = searchParams.get('token') ?? (email ? getPendingVerificationTokenForEmail(email) ?? undefined : undefined);

  return (
    <AuthShell title="Verify Email" subtitle="Confirm your email address">
      <VerifyEmailPanel
        token={token}
        email={email}
        onSuccess={() => navigate(getPostLoginPath(role), { replace: true })}
      />
    </AuthShell>
  );
}

export default VerifyEmailPage;
