import { Route, Routes } from 'react-router-dom';
import { GuestRoute } from '../guards/GuestRoute';
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  UnauthorizedPage,
  VerifyEmailPage,
} from '../pages';

export function AuthRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>
      <Route path="unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
}

export default AuthRoutes;
