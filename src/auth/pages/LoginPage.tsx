import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { LoginForm } from '../components/LoginForm';
import { useBootstrap } from '../bootstrap';
import { resolvePostLoginRoute } from '../routing/resolvePostLoginRoute';

export function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useBootstrap();

  return (
    <AuthShell title="Sign In" subtitle="AuthorOS account access">
      <LoginForm
        onSuccess={async () => {
          const target = await resolvePostLoginRoute(refresh);
          navigate(target, { replace: true });
        }}
      />
    </AuthShell>
  );
}

export default LoginPage;
