'use client';

import React, { useState } from 'react';

export const AnimatedDonutChart = ({ data = [], total = 0 }) => {
  const [activeSegment, setActiveSegment] = useState(null);

  const radius = 68;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
      {/* SVG Donut */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90 transform overflow-visible">
          {data.map((item, idx) => {
            const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);
            cumulativePercent += item.percent;

            const isHovered = activeSegment?.category === item.category;

            return (
              <circle
                key={idx}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={item.hexColor}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                onMouseEnter={() => setActiveSegment(item)}
                onMouseLeave={() => setActiveSegment(null)}
                className="transition-all duration-300 cursor-pointer hover:opacity-90"
                style={{
                  strokeLinecap: 'butt'
                }}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-[#747878] tracking-wider">
            {activeSegment ? activeSegment.category.split(' ')[0] : 'Total OpEx'}
          </span>
          <span className="font-['Space_Grotesk'] font-mono tabular-nums text-lg font-bold text-[#161616]">
            {activeSegment ? `₹${(activeSegment.spent / 1000).toFixed(0)}k` : `₹${(total / 100000).toFixed(1)}L`}
          </span>
          <span className="text-[10px] font-bold text-[#7b5900]">
            {activeSegment ? `${activeSegment.percent}% share` : '100%'}
          </span>
        </div>
      </div>

      {/* Legend with hover sync */}
      <div className="space-y-2.5 flex-1 max-w-xs text-xs">
        {data.map((item, idx) => {
          const isHovered = activeSegment?.category === item.category;
          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveSegment(item)}
              onMouseLeave={() => setActiveSegment(null)}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isHovered
                  ? 'bg-[#fffbf2] border-[#f5b400] shadow-sm font-bold'
                  : 'bg-[#f8f7f5] border-[#e3e2e0] hover:border-[#161616]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.hexColor }}
                ></span>
                <span className="text-[#161616] text-[11px] font-medium truncate">{item.category}</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="font-bold text-[#161616]">₹{(item.spent / 1000).toFixed(0)}k</span>
                <span className="text-[10px] text-[#747878] w-8 text-right font-bold">{item.percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
