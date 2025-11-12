'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './SplashScreen';

export default function SplashScreenWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if splash has been shown in this session
    if (typeof window !== 'undefined') {
      const splashShown = sessionStorage.getItem('splash_shown');
      if (splashShown === 'true') {
        setShowSplash(false);
        setHasShownSplash(true);
        return;
      }
    }
  }, []);

  const handleSplashComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splash_shown', 'true');
    }
    setShowSplash(false);
    setHasShownSplash(true);
  };

  // Don't show splash on login page, module selection, or if already shown
  if (pathname === '/login' || pathname === '/select-module' || hasShownSplash || !showSplash) {
    return <>{children}</>;
  }

  return <SplashScreen onComplete={handleSplashComplete} />;
}

