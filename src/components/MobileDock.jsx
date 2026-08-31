'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export const MobileDock = () => {
  const { currentScreen, setCurrentScreen, setIsAIChatOpen, setIsCommandPaletteOpen, currentUser } = useApp();

  const isClient = currentUser.id === 'client_admin';
  const isSecurity = currentUser.id === 'security_guard';

  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#161616]/90 backdrop-blur-2xl border border-white/20 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center justify-around gap-4 w-full max-w-sm">
        {/* Dashboard / Home */}
        <button
          onClick={() => setCurrentScreen(currentUser.id === 'super_admin' ? 'executive_dashboard' : 'dashboard')}
          className={`p-2 rounded-full transition-colors flex flex-col items-center ${
            currentScreen === 'dashboard' || currentScreen === 'executive_dashboard'
              ? 'text-[#f5b400] bg-white/10'
              : 'text-[#858383] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-xl">dashboard</span>
        </button>

        {/* Meeting Rooms / Calendar */}
        <button
          onClick={() => setCurrentScreen(isClient ? 'book_room' : 'centre_calendar')}
          className={`p-2 rounded-full transition-colors flex flex-col items-center ${
            currentScreen === 'book_room' || currentScreen === 'centre_calendar'
              ? 'text-[#f5b400] bg-white/10'
              : 'text-[#858383] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-xl">meeting_room</span>
        </button>

        {/* Spotlight Search Center Action */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-3 rounded-full bg-[#f5b400] text-[#161616] font-bold shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl">search</span>
        </button>

        {/* Tickets / Gate Pass */}
        <button
          onClick={() => setCurrentScreen(isSecurity ? 'gate_pass' : isClient ? 'raise_ticket' : 'tickets')}
          className={`p-2 rounded-full transition-colors flex flex-col items-center ${
            currentScreen === 'tickets' || currentScreen === 'raise_ticket' || currentScreen === 'gate_pass'
              ? 'text-[#f5b400] bg-white/10'
              : 'text-[#858383] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            {isSecurity ? 'qr_code_scanner' : 'support_agent'}
          </span>
        </button>

        {/* AI Assistant */}
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="p-2 rounded-full text-[#858383] hover:text-[#f5b400] transition-colors flex flex-col items-center"
        >
          <span className="material-symbols-outlined text-xl">psychology</span>
        </button>
      </div>
    </div>
  );
};
