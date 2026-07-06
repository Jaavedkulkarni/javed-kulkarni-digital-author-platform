import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { LoginForm } from '../components/LoginForm';
import type { AuthRole } from '../types/roles.types';
import { consumeAuthReturnTo } from '../services/sessionStorage';
import { getPostLoginPath } from '../utils/roleRouting';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthShell title="Sign In" subtitle="AuthorOS account access">
      <LoginForm
        onSuccess={(role?: AuthRole) => {
          const returnTo = consumeAuthReturnTo();
          navigate(getPostLoginPath(role ?? 'reader', returnTo), { replace: true });
        }}
      />
    </AuthShell>
  );
}

export default LoginPage;
