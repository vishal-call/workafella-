'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const LoginScreen = () => {
  const { switchRole, isDarkMode, setIsDarkMode } = useApp();
  const [email, setEmail] = useState('vikram.m@workafella.com');
  const [password, setPassword] = useState('••••••••••••');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const heroPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80',
      title: 'Hitec City Innovation Campus',
      location: 'Hyderabad',
      stats: '450 Desks • 32 Suites • Level 7'
    },
    {
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&auto=format&fit=crop&q=80',
      title: 'Guindy Cybervale Executive Suites',
      location: 'Chennai',
      stats: '600 Desks • 48 Suites • Level 4'
    },
    {
      url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&auto=format&fit=crop&q=80',
      title: 'Millers Road Landmark Center',
      location: 'Bangalore',
      stats: '380 Desks • 28 Suites • Level 3'
    },
    {
      url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&auto=format&fit=crop&q=80',
      title: 'BKC One High-Street Hub',
      location: 'Mumbai',
      stats: '520 Desks • 40 Suites • Level 9'
    }
  ];

  // Auto slide carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroPhotos.length]);

  const handleLogin = (e) => {
    e.preventDefault();
    soundFx.playClick();
    if (email.includes('ramesh') || email.includes('branch')) {
      switchRole('branch_admin');
    } else if (email.includes('finance') || email.includes('kavya')) {
      switchRole('finance_user');
    } else if (email.includes('ops') || email.includes('arjun') || email.includes('karthik')) {
      switchRole('operations_facility');
    } else if (email.includes('novatech') || email.includes('priya') || email.includes('client') || email.includes('acme')) {
      switchRole('client_admin');
    } else if (email.includes('security') || email.includes('suresh')) {
      switchRole('security_guard');
    } else {
      switchRole('super_admin');
    }
  };

  return (
    <div className={`h-screen w-screen max-h-screen overflow-hidden flex flex-col md:flex-row font-['Inter'] select-none transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0e0e0e] text-[#faf9f7]' : 'bg-[#faf9f7] text-[#161616]'
    }`}>
      {/* Left Form Panel - Clean, Centered & Perfectly Aligned */}
      <div className={`w-full md:w-[480px] lg:w-[540px] h-full max-h-screen flex-shrink-0 flex flex-col justify-between p-8 sm:p-12 lg:p-14 border-r z-10 relative overflow-hidden ${
        isDarkMode ? 'bg-[#141416] border-[#27272a]' : 'bg-[#ffffff] border-[#e3e2e0]'
      }`}>
        {/* Subtle Ambient Radial Light */}
        <div
          className="absolute top-0 left-0 w-96 h-96 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at top left, rgba(245, 180, 0, 0.25), transparent 70%)'
          }}
        ></div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 flex flex-col justify-center gap-[3.5px] group-hover:scale-110 transition-transform">
              <div className="flex gap-[3.5px]">
                <div className="w-4 h-4 bg-[#f5b400] rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                <div className="w-4 h-4 bg-[#f5b400] rounded-sm" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
              </div>
              <div className="w-4 h-4 bg-[#f5b400] ml-4 rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <div>
              <span className={`font-['Space_Grotesk'] text-2xl font-bold tracking-tight block leading-none ${
                isDarkMode ? 'text-white' : 'text-[#161616]'
              }`}>
                Workafella
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#f5b400] uppercase font-extrabold">
                Workspace OS
              </span>
            </div>
          </div>

          {/* Dark Mode Icon Toggle */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsDarkMode(!isDarkMode);
            }}
            className={`p-2 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
              isDarkMode
                ? 'bg-[#202024] border-[#333338] text-[#f5b400] hover:bg-[#28282d]'
                : 'bg-[#f4f3f1] border-[#e3e2e0] text-[#747878] hover:text-[#161616]'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-lg">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        {/* Center Main Form */}
        <div className="relative z-10 my-auto py-6 space-y-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#f5b400] font-extrabold mb-1">
              Enterprise Access Terminal
            </div>
            <h1 className={`font-['Space_Grotesk'] text-3xl lg:text-4xl font-bold tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-[#161616]'
            }`}>
              Sign In to Command Center
            </h1>
            <p className="text-xs text-[#747878] mt-2 leading-relaxed">
              Consolidated workspace operating system across 11 flagships in Hyderabad, Chennai, Bangalore, and Mumbai.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className={`block font-bold uppercase tracking-wider text-xs mb-1.5 ${
                isDarkMode ? 'text-[#e4e4e7]' : 'text-[#161616]'
              }`}>
                Corporate Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#747878] text-base">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border outline-none text-xs transition-all rounded-2xl font-medium focus:ring-2 focus:ring-[#f5b400]/40 ${
                    isDarkMode
                      ? 'bg-[#1b1b1e] border-[#2e2e32] text-white focus:border-[#f5b400]'
                      : 'bg-[#f4f3f1] border-[#e3e2e0] text-[#161616] focus:bg-white focus:border-[#f5b400]'
                  }`}
                  placeholder="name@workafella.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`block font-bold uppercase tracking-wider text-xs ${
                  isDarkMode ? 'text-[#e4e4e7]' : 'text-[#161616]'
                }`}>
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[#f5b400] hover:underline font-bold">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#747878] text-base">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border outline-none text-xs transition-all rounded-2xl font-medium focus:ring-2 focus:ring-[#f5b400]/40 ${
                    isDarkMode
                      ? 'bg-[#1b1b1e] border-[#2e2e32] text-white focus:border-[#f5b400]'
                      : 'bg-[#f4f3f1] border-[#e3e2e0] text-[#161616] focus:bg-white focus:border-[#f5b400]'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 text-xs text-[#747878] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#747878] text-[#f5b400] focus:ring-0 w-4 h-4"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-[11px] text-[#1e8a5f] font-mono font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">lock</span> 256-bit SSL
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-sm hover:bg-[#ffdea4] transition-all rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#f5b400]/20 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              <span>Authenticate & Enter Workspace</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </form>

          {/* Security & Access Notice */}
          <div className="p-3.5 bg-[#f4f3f1]/60 dark:bg-[#1b1b1e] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl text-[11px] text-[#747878] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-sm text-[#f5b400] mt-0.5 flex-shrink-0">
              verified_user
            </span>
            <p className="leading-relaxed">
              Authorized personnel only. Integrated with Workafella Biometric Access, Single Sign-On (SSO), and PRD Security Protocol.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#747878] flex justify-between items-center border-t border-[#e3e2e0]/60 dark:border-[#27272a] pt-4 relative z-10">
          <span>© 2026 Workafella Co-Working Ltd.</span>
          <span className="text-[#f5b400] font-bold">PRD v1.0 Production Release</span>
        </div>
      </div>

      {/* Right Editorial Photography Panel with Ken-Burns Motion */}
      <div className="hidden md:flex flex-1 h-full max-h-screen relative bg-[#161616] overflow-hidden p-8 lg:p-12 flex-col justify-between select-none">
        {/* Animated Background Photo with Ken Burns Zoom */}
        {heroPhotos.map((photo, idx) => (
          <img
            key={idx}
            src={photo.url}
            alt={photo.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              activePhotoIndex === idx
                ? 'opacity-60 scale-105'
                : 'opacity-0 scale-100 pointer-events-none'
            }`}
          />
        ))}

        {/* Multi-layered Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/30 to-black/50 pointer-events-none"></div>

        {/* Top Floating Glassmorphism Status Badges */}
        <div className="relative z-10 flex justify-between items-center gap-4">
          <div className="bg-[#161616]/80 backdrop-blur-xl border border-white/20 text-white px-4 py-2 text-xs font-bold rounded-full shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1e8a5f] animate-ping"></span>
            <span>11 Centres Active Across 4 Major Tech Hubs</span>
          </div>

          <div className="text-white font-mono text-xs bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 font-bold">
            0{activePhotoIndex + 1} / 0{heroPhotos.length}
          </div>
        </div>

        {/* Bottom Editorial Flagship Details with Animated Captions */}
        <div className="relative z-10 text-white space-y-4 max-w-xl animate-fade-in-up">
          <div className="p-6 bg-[#161616]/85 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#f5b400] text-[11px] uppercase font-extrabold tracking-widest">
                Featured Flagship
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs font-semibold text-white/90">
                {heroPhotos[activePhotoIndex].location}
              </span>
            </div>

            <h2 className="font-['Space_Grotesk'] text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
              {heroPhotos[activePhotoIndex].title}
            </h2>

            <p className="text-white/75 text-xs leading-relaxed">
              {heroPhotos[activePhotoIndex].stats} • Smart Turnstile Biometrics & Private Leased-Line Infrastructure.
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center gap-2.5 pt-1">
            {heroPhotos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setActivePhotoIndex(idx);
                }}
                className={`h-2 transition-all duration-500 rounded-full cursor-pointer ${
                  activePhotoIndex === idx
                    ? 'w-12 bg-[#f5b400] shadow-md shadow-[#f5b400]/40'
                    : 'w-4 bg-white/30 hover:bg-white/60'
                }`}
                title={`View ${photo.title}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
