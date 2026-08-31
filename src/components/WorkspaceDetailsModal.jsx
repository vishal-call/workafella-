'use client';

import React, { useState } from 'react';
import { soundFx } from '../utils/audioEffects';

export const WorkspaceDetailsModal = ({ suite, onClose, onSelectSuite, isSelected = false }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!suite) return null;

  const suiteGallery = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&auto=format&fit=crop&q=80'
  ];

  const features = [
    { name: 'Air conditioning', sub: 'VRV Multi-Zone Climate', icon: 'ac_unit' },
    { name: 'High-Speed Internet', sub: '1 Gbps Dedicated Fiber + Wi-Fi 6', icon: 'wifi' },
    { name: 'Tea & Coffee', sub: 'Unlimited Barista Espresso Lounge', icon: 'coffee' },
    { name: '24/7 CCTV & Security', sub: 'Biometric Access Control', icon: 'videocam' },
    { name: 'Neutral Smart Light', sub: 'Ergonomic 5500K Circadian LED', icon: 'lightbulb' },
    { name: 'Acoustic Insulation', sub: 'Double-Glazed Soundproofing', icon: 'volume_off' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Slide-in Detail Drawer */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#161719] text-[#161616] dark:text-white shadow-2xl border-l border-[#e3e2e0] dark:border-[#27272a] h-full flex flex-col justify-between overflow-hidden animate-slide-in-right z-10">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#e3e2e0] dark:border-[#27272a] bg-[#faf9f7] dark:bg-[#121315] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#f5b400]">
                {suite.floor || 'Floor 7'} Workspace Specification
              </span>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  suite.status === 'Available'
                    ? 'bg-[#e6f4ea] text-[#1e8a5f] dark:bg-[#1e8a5f]/20'
                    : suite.status === 'Meeting Room'
                    ? 'bg-[#f3e8ff] text-[#7e22ce] dark:bg-[#7e22ce]/20'
                    : 'bg-[#f4f3f1] text-[#747878] dark:bg-[#27272a] dark:text-[#a1a1aa]'
                }`}
              >
                {suite.status || 'Active Suite'}
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-[#161616] dark:text-white mt-0.5">
              {suite.name} — {suite.status === 'Meeting Room' ? 'Conference Suite' : 'Private Office'}
            </h2>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1.5 rounded-full hover:bg-[#e3e2e0] dark:hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Workspace Detail Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Main Hero Photo Gallery */}
          <div className="space-y-2.5">
            <div className="h-56 sm:h-64 w-full rounded-2xl overflow-hidden relative shadow-md bg-black group">
              <img
                src={suiteGallery[activePhotoIdx]}
                alt={suite.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                  {suite.area || '1,200 sq.ft'} • Capacity: {suite.desks || 20} Desks
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-5 gap-2">
              {suiteGallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundFx.playClick();
                    setActivePhotoIdx(idx);
                  }}
                  className={`h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-[#f5b400] scale-105 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Time & Capacity Heat Bar */}
          <div className="p-3.5 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-[#747878] dark:text-[#a1a1aa]">Day Utilization Schedule (08:00 - 20:00)</span>
              <span className="text-[#1e8a5f] font-mono">
                {suite.status === 'Available' ? '100% Open' : 'Assigned to Client'}
              </span>
            </div>

            {/* 12-Hour Segmented Bar */}
            <div className="grid grid-cols-12 gap-1 h-3.5">
              {[...Array(12)].map((_, i) => {
                const isOccupiedHour = suite.status === 'Occupied' || (suite.status === 'Meeting Room' && (i < 3 || i > 7));
                return (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      isOccupiedHour
                        ? 'bg-[#ef4444]/80'
                        : 'bg-[#1e8a5f] shadow-xs'
                    }`}
                    title={`Hour ${8 + i}:00`}
                  ></div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white dark:bg-[#222326] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-md text-[#161616] dark:text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#f5b400]">person</span>
                <span>x{suite.desks || 20} Desks</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white dark:bg-[#222326] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-md text-[#161616] dark:text-white">
                {suite.client || 'Enterprise Pass'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#f5b400]/15 text-[#7b5900] dark:text-[#f5b400] rounded-md">
                1 Gbps Leased Line
              </span>
            </div>
          </div>

          {/* Detailed Inclusions Description */}
          <div className="space-y-2">
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#161616] dark:text-white">
              Our Workspace allocation provides dedicated private office & meeting access to plug in & scale:
            </h3>

            <ul className="text-xs text-[#444748] dark:text-[#d4d4d8] space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b400] mt-1.5 flex-shrink-0"></span>
                <span><strong>1000 Mbps High Speed Internet Link</strong> with dual fiber ISP automatic failover.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b400] mt-1.5 flex-shrink-0"></span>
                <span>Access to the commercial print / copy / scan & confidential shredding facilities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b400] mt-1.5 flex-shrink-0"></span>
                <span>Access to private acoustic phone booths and executive huddle focus pods.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b400] mt-1.5 flex-shrink-0"></span>
                <span>Access to the communal cafeteria space with unlimited barista espresso coffee & tea making facilities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b400] mt-1.5 flex-shrink-0"></span>
                <span>24/7 Smart Biometric Turnstile access and NFC encrypted digital door locks.</span>
              </li>
            </ul>
          </div>

          {/* Feature Grid with Luxury Icons */}
          <div className="space-y-3 pt-2 border-t border-[#e3e2e0] dark:border-[#27272a]">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#747878] dark:text-[#a1a1aa]">
              Features & Infrastructure
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-xl flex items-center gap-2.5"
                >
                  <span className="material-symbols-outlined text-[#f5b400] text-lg">
                    {feat.icon}
                  </span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#161616] dark:text-white truncate">
                      {feat.name}
                    </div>
                    <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa] truncate">
                      {feat.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white dark:bg-[#161719] border-t border-[#e3e2e0] dark:border-[#27272a] flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              if (onSelectSuite) {
                onSelectSuite(`${suite.name} (${suite.desks} Seats)`);
              }
              onClose();
            }}
            className={`flex-1 py-3 font-['Space_Grotesk'] font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
              isSelected
                ? 'bg-[#161616] text-[#f5b400] border border-[#f5b400]'
                : 'bg-[#f5b400] text-[#161616] hover:bg-[#ffdea4]'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isSelected ? 'check_circle' : 'add_task'}
            </span>
            <span>{isSelected ? 'Suite Selected in Allocation' : 'Select Suite for Allocation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
