import AuthLayout from "../component/auth/authlayout";
import ResetPasswordForm from "../component/auth/resetpassword";

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset password">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
