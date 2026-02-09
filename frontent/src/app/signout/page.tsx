'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const SignoutPage = () => {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        router.push('/signin');
      } catch (error) {
        console.error('Logout failed:', error);
        // Even if logout fails, redirect to signin
        router.push('/signin');
      }
    };

    handleLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Logging out...</div>
    </div>
  );
};

export default SignoutPage;