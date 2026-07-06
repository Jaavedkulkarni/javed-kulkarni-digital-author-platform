import { AuthShell } from '../components/AuthShell';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot Password" subtitle="Reset your AuthorOS password">
      <ForgotPasswordForm />
    </AuthShell>
  );
}

export default ForgotPasswordPage;
