import { PublicSiteLayout } from '../../components/layout/PublicSiteLayout';
import { ReaderVerifyEmailContent } from '../../components/reader/auth/ReaderVerifyEmailContent';
import { ReaderAuthShell } from './ReaderAuthShell';

export function ReaderVerifyEmail() {
  return (
    <PublicSiteLayout title="Verify Email">
      <div className="max-w-md mx-auto">
        <ReaderAuthShell title="Verify Your Email" subtitle="Please confirm your email address." embedded>
          <ReaderVerifyEmailContent />
        </ReaderAuthShell>
      </div>
    </PublicSiteLayout>
  );
}

export default ReaderVerifyEmail;
