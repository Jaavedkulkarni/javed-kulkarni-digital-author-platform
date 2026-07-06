import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { getPendingResetTokenForDev } from '../services/mockAuthService';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? getPendingResetTokenForDev() ?? '';

  return (
    <AuthShell title="Reset Password" subtitle="Choose a new password">
      <ResetPasswordForm token={token} onSuccess={() => navigate('/auth/login', { replace: true })} />
    </AuthShell>
  );
}

export default ResetPasswordPage;
