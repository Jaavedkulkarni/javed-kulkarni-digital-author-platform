import { AuthProvider } from './context';
import { AuthRoutes } from './routes/AuthRoutes';

export function AuthApp() {
  return (
    <AuthProvider>
      <AuthRoutes />
    </AuthProvider>
  );
}

export default AuthApp;
