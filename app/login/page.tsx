import AuthLayout from "../component/auth/authlayout";
import LoginForm from "../component/auth/loginform";

export default function LoginPage() {
  return (
    <AuthLayout title="Login">
      <LoginForm />
    </AuthLayout>
  );
}
