import AuthLayout from "../component/auth/authlayout";
import ForgotPasswordForm from "../component/auth/forgotpassword";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
