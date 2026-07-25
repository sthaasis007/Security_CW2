import AuthLayout from "../component/auth/authlayout";
import RegisterForm from "../component/auth/registration";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create Account">
      <RegisterForm />
    </AuthLayout>
  );
}
