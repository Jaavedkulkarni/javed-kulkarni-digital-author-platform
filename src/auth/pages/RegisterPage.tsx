import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <AuthShell title="Create Account" subtitle="Join AuthorOS">
      <RegisterForm
        onSuccess={() => navigate('/auth/login', { replace: true })}
        onVerificationRequired={() => navigate('/auth/verify-email', { replace: true })}
      />
    </AuthShell>
  );
}

export default RegisterPage;
