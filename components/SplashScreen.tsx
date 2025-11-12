'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getSelectedModule } from '@/lib/module';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const router = useRouter();
  const [displayText, setDisplayText] = useState('');
  const fullText = 'kethu groups';
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Typewriter effect
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100); // Speed of typing

      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  useEffect(() => {
    // After 8 seconds, check where to redirect
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        const module = getSelectedModule();
        if (module) {
          router.push('/');
        } else {
          router.push('/select-module');
        }
      } else {
        router.push('/login');
      }
      onComplete();
    }, 8000);

    return () => clearTimeout(timer);
  }, [router, onComplete]);

  return (
    <div className="fixed inset-0 bg-green-600 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo with shadow */}
        <div className="mb-8">
          <img
            src="/log.jpg"
            alt="Kethu Logo"
            className="mx-auto"
            style={{
              width: '150px',
              height: '150px',
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
              objectFit: 'contain',
            }}
          />
        </div>
        
        {/* Typing text */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>
      </div>
    </div>
  );
}

