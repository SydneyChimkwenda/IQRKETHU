'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getSelectedModule } from '@/lib/module';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Allow access to login and module selection pages
    if (pathname === '/login' || pathname === '/select-module') {
      setIsChecking(false);
      return;
    }

    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Check if module is selected (except for select-module page)
    const selectedModule = getSelectedModule();
    if (!selectedModule && pathname !== '/select-module') {
      router.push('/select-module');
      return;
    }

    setIsChecking(false);
  }, [router, pathname]);

  // Show loading state while checking
  if (isChecking && pathname !== '/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

