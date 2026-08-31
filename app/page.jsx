'use client';

import React, { useState, useEffect } from 'react';
import App from '../src/App';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#f5b400] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div className="font-['Space_Grotesk'] text-sm font-bold text-[#161616]">
            Loading Workafella Command Center...
          </div>
        </div>
      </div>
    );
  }

  return <App />;
}
