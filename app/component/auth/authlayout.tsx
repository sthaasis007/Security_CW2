import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/formbg.png')",
      }}
    >
      {/* Glassmorphism Box */}
      <div className="w-full max-w-md rounded-2xl bg-white/30 backdrop-blur-xl p-8 shadow-xl border border-white/20">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {title}
        </h1>

        {children}
      </div>
    </main>
  );
}
