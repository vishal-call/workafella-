'use client';

import React, { useState } from 'react';
import { useApp, CITIES, CENTRES } from '../context/AppContext';
import { soundFx } from '../utils/audioEffects';

export const IndiaGeoMap = () => {
  const { setActiveCity, setActiveBranch, addToast } = useApp();
  const [hoveredCity, setHoveredCity] = useState(null);

  // Geographic coordinates mapped to SVG canvas (viewBox: 0 0 600 650)
  const cityNodes = [
    {
      name: 'Hyderabad',
      cx: 265,
      cy: 390,
      state: 'Telangana',
      centresCount: 4,
      totalSeats: 1650,
      occupancy: 91,
      revenueMtd: '₹1.84 Cr',
      flagship: 'Hitec City Innovation Campus'
    },
    {
      name: 'Chennai',
      cx: 295,
      cy: 485,
      state: 'Tamil Nadu',
      centresCount: 3,
      totalSeats: 1380,
      occupancy: 88,
      revenueMtd: '₹1.42 Cr',
      flagship: 'Guindy Cybervale Premium'
    },
    {
      name: 'Bangalore',
      cx: 245,
      cy: 475,
      state: 'Karnataka',
      centresCount: 2,
      totalSeats: 830,
      occupancy: 94,
      revenueMtd: '₹0.95 Cr',
      flagship: 'Millers Road Executive Center'
    },
    {
      name: 'Mumbai',
      cx: 165,
      cy: 375,
      state: 'Maharashtra',
      centresCount: 2,
      totalSeats: 790,
      occupancy: 86,
      revenueMtd: '₹0.61 Cr',
      flagship: 'BKC One High-Street Hub'
    }
  ];

  const handleCitySelect = (city) => {
    soundFx.playClick();
    setActiveCity(city.name);
    const targetBranch = CENTRES.find((c) => c.city === city.name);
    if (targetBranch) {
      setActiveBranch(targetBranch);
    }
    addToast(`Switched operational scope to ${city.name} (${city.centresCount} Centres)`, 'info', 'Geographic Scope Updated');
  };

  return (
    <div className="bg-white border border-[#e3e2e0] rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e3e2e0]">
        <div>
          <div className="text-[10px] uppercase font-bold text-[#7b5900] tracking-widest">
            Pan-India Geographic Intelligence
          </div>
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
            11 Centres Topology & Fill Rates
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#747878] font-medium">Click city node to scope:</span>
          <div className="flex gap-1.5">
            {cityNodes.map((c) => (
              <button
                key={c.name}
                onClick={() => handleCitySelect(c)}
                className="px-2.5 py-1 bg-[#f4f3f1] hover:bg-[#161616] hover:text-[#f5b400] text-[#161616] font-bold text-[10px] rounded-lg transition-all"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Geographic Map */}
      <div className="relative bg-[#faf9f7] rounded-2xl p-4 border border-[#e3e2e0] flex items-center justify-center min-h-[380px]">
        <svg
          viewBox="0 0 600 600"
          className="w-full max-w-lg h-auto overflow-visible select-none"
        >
          {/* Stylized Architectural Country Outline */}
          <path
            d="M 230 40 L 290 50 L 320 100 L 300 140 L 360 170 L 420 190 L 470 240 L 420 270 L 360 260 L 340 300 L 350 360 L 380 400 L 330 460 L 310 540 L 280 570 L 250 540 L 210 470 L 160 410 L 130 350 L 150 280 L 120 230 L 180 180 L 200 110 Z"
            fill="#eae8e4"
            stroke="#d4d2cc"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="transition-colors"
          />

          {/* Connected Network Line Arcs */}
          <path
            d="M 165 375 Q 215 380 265 390 Q 255 430 245 475 Q 270 480 295 485 Q 280 435 265 390 Z"
            fill="none"
            stroke="#f5b400"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Render City Beacons */}
          {cityNodes.map((city) => {
            const isHovered = hoveredCity?.name === city.name;
            return (
              <g
                key={city.name}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => handleCitySelect(city)}
              >
                {/* Outer Pulsing Wave */}
                <circle
                  cx={city.cx}
                  cy={city.cy}
                  r="18"
                  fill="rgba(245, 180, 0, 0.2)"
                  className="animate-ping origin-center"
                />
                {/* Mid Ring */}
                <circle
                  cx={city.cx}
                  cy={city.cy}
                  r="12"
                  fill="rgba(22, 22, 22, 0.85)"
                  stroke="#f5b400"
                  strokeWidth="2"
                  className="transition-transform duration-200 group-hover:scale-125"
                />
                {/* Center Core Dot */}
                <circle
                  cx={city.cx}
                  cy={city.cy}
                  r="5"
                  fill="#f5b400"
                />

                {/* City Label Pin */}
                <text
                  x={city.cx + 16}
                  y={city.cy + 4}
                  fill="#161616"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="'Space Grotesk', sans-serif"
                  className="select-none"
                >
                  {city.name}
                </text>
                <text
                  x={city.cx + 16}
                  y={city.cy + 17}
                  fill="#747878"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="'Inter', sans-serif"
                  className="select-none"
                >
                  {city.occupancy}% Fill • {city.centresCount} Centres
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Hover City Telemetry Card Overlay */}
        {hoveredCity && (
          <div className="absolute top-4 right-4 bg-[#161616] text-white p-4 rounded-2xl shadow-2xl border border-[#f5b400] w-64 animate-fade-in text-xs space-y-2 z-20">
            <div className="flex justify-between items-start border-b border-[#3a3a3a] pb-2">
              <div>
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#f5b400]">
                  {hoveredCity.name} Hub
                </h4>
                <span className="text-[10px] text-[#858383]">{hoveredCity.state}</span>
              </div>
              <span className="bg-[#1e8a5f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {hoveredCity.occupancy}% Occupied
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#858383]">Total Desks:</span>
                <span className="font-bold font-mono">{hoveredCity.totalSeats} Desks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858383]">Revenue (MTD):</span>
                <span className="font-bold font-mono text-[#f5b400]">{hoveredCity.revenueMtd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858383]">Flagship Campus:</span>
                <span className="font-semibold text-white/90 truncate max-w-[120px]">{hoveredCity.flagship}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#3a3a3a] text-[9px] text-[#f5b400] text-center font-bold uppercase tracking-wider">
              Click to Zoom Scope
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
