'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/login-form';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const showForgotPassword = () => {
    router.push('/login?view=forgot-password', { scroll: false });
  };

  const showLogin = () => {
    router.push('/login', { scroll: false });
  };

  return (
    <div className="page-container flex min-h-screen flex-col items-center justify-center">
      <div className="card w-full max-w-md p-8 bg-slate-900/80">
        {view === 'forgot-password' ? (
          <ForgotPasswordForm onBackToLogin={showLogin} />
        ) : (
          <LoginForm onForgotPassword={showForgotPassword} />
        )}
      </div>
    </div>
  );
}
