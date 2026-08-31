'use client';

import React, { useState } from 'react';
import { soundFx } from '../utils/audioEffects';

export const Room360TourModal = ({ room, onClose, onPlaceHold }) => {
  const [activeAmbience, setActiveAmbience] = useState('daylight');
  const [panAngle, setPanAngle] = useState(0);

  if (!room) return null;

  const ambienceModes = [
    {
      id: 'daylight',
      label: 'Natural Daylight',
      icon: 'light_mode',
      kelvin: '5500K Natural',
      gradient: 'from-amber-100/20 via-transparent to-transparent',
      scrim: 'bg-black/20'
    },
    {
      id: 'dimming',
      label: 'Executive Dimming',
      icon: 'dark_mode',
      kelvin: '2700K Warm Tungsten',
      gradient: 'from-amber-900/40 via-black/40 to-black/70',
      scrim: 'bg-black/60'
    },
    {
      id: 'presentation',
      label: 'Presentation Dark',
      icon: 'tv',
      kelvin: 'Screen Spotlight Mode',
      gradient: 'from-blue-900/30 via-black/60 to-black/80',
      scrim: 'bg-black/75'
    },
    {
      id: 'golden',
      label: 'Golden Hour Sunset',
      icon: 'wb_twilight',
      kelvin: '3200K Golden Ambient',
      gradient: 'from-[#f5b400]/30 via-orange-950/40 to-black/60',
      scrim: 'bg-black/40'
    }
  ];

  const currentMode = ambienceModes.find((m) => m.id === activeAmbience);

  const amenities = [
    { name: 'Crestron 4K AirMedia Ultra Display', icon: 'tv', status: 'Online 4K 60Hz' },
    { name: 'Dolby Voice Array Soundbar & Beamforming Mic', icon: 'mic', status: 'Acoustic Calibrated' },
    { name: 'Samsung Flip 65" Digital Interactive Whiteboard', icon: 'draw', status: 'Stylus Paired' },
    { name: 'Dedicated Leased Line & Wi-Fi 6 AP', icon: 'wifi', status: '940 Mbps Low-Latency' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-4xl bg-[#161616] text-white border-2 border-[#f5b400] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in-up">
        {/* Top Header */}
        <div className="p-4 bg-[#1c1b1b] border-b border-[#333338] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f5b400] text-2xl">
              360
            </span>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                360° Virtual Suite & Lighting Visualizer
              </h3>
              <p className="text-[11px] text-[#858383]">
                {room.name} • {room.centre} ({room.floor}) • Capacity: {room.capacity} Persons
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#858383] hover:text-white p-1.5 rounded-full hover:bg-[#27272a] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* 360 Viewport Canvas */}
        <div className="relative h-96 w-full overflow-hidden bg-black flex items-center justify-center flex-shrink-0">
          {/* Panoramic Room Image with Dynamic Panning & Ambience Filter */}
          <img
            src={room.image}
            alt={room.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
            style={{
              transform: `scale(1.1) translateX(${panAngle * -0.5}px)`
            }}
          />

          {/* Dynamic Ambience Lighting Scrim Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${currentMode.gradient} ${currentMode.scrim} transition-all duration-700 pointer-events-none`}></div>

          {/* 360 Reticle & Panning Indicator */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-[11px] flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#f5b400] animate-pulse"></span>
            <span>Ambience: {currentMode.kelvin}</span>
          </div>

          {/* Pan Slider Controls */}
          <div className="absolute bottom-4 inset-x-8 flex flex-col items-center gap-2">
            <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-3 w-full max-w-md">
              <span className="text-[10px] text-[#858383] font-mono font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">pan_tool</span> Pan 360°
              </span>
              <input
                type="range"
                min="-100"
                max="100"
                value={panAngle}
                onChange={(e) => setPanAngle(Number(e.target.value))}
                className="w-full accent-[#f5b400] cursor-pointer"
              />
              <span className="text-[10px] text-[#f5b400] font-mono font-bold w-8 text-right">
                {panAngle}°
              </span>
            </div>
          </div>
        </div>

        {/* Lower Control Bar: Ambience Modes & Tech Specs */}
        <div className="p-6 bg-[#161616] space-y-5 overflow-y-auto">
          {/* Ambience Lighting Mode Switcher */}
          <div>
            <div className="text-[10px] uppercase font-bold text-[#858383] tracking-widest mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#f5b400]">tungsten</span>
              <span>Select Room Ambience & Lighting Mode</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ambienceModes.map((mode) => {
                const isActive = activeAmbience === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveAmbience(mode.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isActive
                        ? 'bg-[#252529] border-[#f5b400] text-white shadow-lg shadow-[#f5b400]/15'
                        : 'bg-[#1b1b1e] border-[#2e2e32] text-[#858383] hover:text-white hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#f5b400]' : ''}`}>
                        {mode.icon}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#f5b400]"></span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{mode.label}</div>
                      <div className="text-[10px] opacity-75 font-mono mt-0.5">{mode.kelvin}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Integrated Equipment & Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {amenities.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#1c1b1b] border border-[#2e2e32] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#f5b400] text-base">
                    {item.icon}
                  </span>
                  <span className="font-semibold text-white/90">{item.name}</span>
                </div>
                <span className="text-[10px] text-[#1e8a5f] font-mono font-bold bg-[#1e8a5f]/15 px-2 py-0.5 rounded-md">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-[#2e2e32] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#858383]">Standard Hourly Rate:</span>
              <div className="font-['Space_Grotesk'] text-lg font-bold text-white">
                ₹{room.hourlyRate.toLocaleString('en-IN')}{' '}
                <span className="text-xs text-[#1e8a5f] font-normal font-sans">
                  (Or 1 Free Entitlement Hour)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-[#252529] text-white font-bold text-xs rounded-xl hover:bg-[#333338] transition-colors"
              >
                Close Visualizer
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onPlaceHold) onPlaceHold();
                }}
                className="px-6 py-2.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Place 5-Minute Hold</span>
                <span className="material-symbols-outlined text-sm">lock_clock</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
