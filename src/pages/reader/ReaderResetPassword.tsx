import { PublicSiteLayout } from '../../components/layout/PublicSiteLayout';
import { ReaderResetPasswordForm } from '../../components/reader/auth/ReaderResetPasswordForm';
import { ReaderAuthShell } from './ReaderAuthShell';

export function ReaderResetPassword() {
  return (
    <PublicSiteLayout title="Reset Password">
      <div className="max-w-md mx-auto">
        <ReaderAuthShell title="Set New Password" subtitle="Choose a new password for your reader account" embedded>
          <ReaderResetPasswordForm />
        </ReaderAuthShell>
      </div>
    </PublicSiteLayout>
  );
}

export default ReaderResetPassword;
