'use client';

import React, { useState, useEffect } from 'react';

export const ActivityTicker = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const liveEvents = [
    { id: 1, type: 'access', title: 'Turnstile Clearance', text: 'Rahul N. cleared Gate 03 (Hitec City)', time: 'Just now', icon: 'sensor_door', color: 'text-[#1e8a5f]' },
    { id: 2, type: 'booking', title: 'Meeting Room Locked', text: 'The Boardroom 7A booked by Ananya S.', time: '1m ago', icon: 'meeting_room', color: 'text-[#f5b400]' },
    { id: 3, type: 'ticket', title: 'Incident Resolved', text: 'Ticket #801 (Wi-Fi Fiber) closed by NetOps', time: '3m ago', icon: 'check_circle', color: 'text-[#1e8a5f]' },
    { id: 4, type: 'visitor', title: 'Visitor Checked In', text: 'Ravi Teja Varma arrived at Front Desk', time: '5m ago', icon: 'badge', color: 'text-[#7b5900]' },
    { id: 5, type: 'facility', title: 'Power Grid Telemetry', text: '100% DG Back-up Test Passed (Guindy)', time: '8m ago', icon: 'bolt', color: 'text-[#1e8a5f]' }
  ];

  useEffect(() => {
    if (isExpanded) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveEvents.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isExpanded, liveEvents.length]);

  const currentEvent = liveEvents[currentIndex];

  return (
    <div className="relative hidden md:block">
      {/* Top Header Inline Pill Container */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs bg-[#f4f3f1] hover:bg-white hover:border-[#f5b400] text-[#161616] px-3.5 py-1.5 rounded-full border border-[#e3e2e0] transition-all cursor-pointer shadow-2xs group select-none"
        title="Click to view full Live Network Telemetry"
      >
        {/* Pulsing Live Heartbeat Indicator */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e8a5f] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e8a5f]"></span>
        </span>

        {/* Dynamic Event Content */}
        <div className="flex items-center gap-1.5 max-w-[280px] lg:max-w-[340px] truncate">
          <span className="material-symbols-outlined text-sm text-[#7b5900] group-hover:text-[#f5b400] transition-colors">
            {currentEvent.icon}
          </span>
          <span className="font-bold text-[10px] uppercase tracking-wider text-[#7b5900]">
            {currentEvent.title}:
          </span>
          <span className="text-[#444748] truncate text-xs font-medium">
            {currentEvent.text}
          </span>
        </div>

        {/* Live Tag */}
        <span className="text-[9px] font-mono font-extrabold text-[#1e8a5f] bg-[#e7f5ed] px-1.5 py-0.2 rounded-full flex-shrink-0 ring-1 ring-inset ring-emerald-600/20">
          LIVE
        </span>

        <span className="material-symbols-outlined text-xs text-[#858383] group-hover:text-[#161616]">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {/* Expanded Live Telemetry Stream Popover */}
      {isExpanded && (
        <div className="absolute left-0 top-full mt-2 w-88 bg-[#161616] border-2 border-[#f5b400] text-white p-4 rounded-3xl shadow-2xl z-50 animate-fade-in-up space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#3a3a3a]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1e8a5f] animate-pulse"></span>
              <h4 className="font-['Space_Grotesk'] text-xs font-bold text-white uppercase tracking-wider">
                11 Centres Live Telemetry
              </h4>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="text-[#858383] hover:text-white p-1 rounded-full hover:bg-[#2f3130]"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {liveEvents.map((evt) => (
              <div key={evt.id} className="p-2.5 bg-[#1c1b1b] rounded-xl border border-[#3a3a3a] text-xs flex items-start gap-2.5">
                <span className={`material-symbols-outlined text-base ${evt.color}`}>
                  {evt.icon}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center text-[10px] text-[#858383]">
                    <span className="font-bold uppercase tracking-wider">{evt.title}</span>
                    <span className="font-mono">{evt.time}</span>
                  </div>
                  <div className="text-white/90 text-[11px] mt-0.5 leading-snug">{evt.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#3a3a3a] text-[10px] text-[#858383] text-center font-mono flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e8a5f]"></span>
            <span>All 11 Centres Operating Normally</span>
          </div>
        </div>
      )}
    </div>
  );
};
