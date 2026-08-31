import React from 'react';
import { useApp, CENTRES } from '../../context/AppContext';

export const EnterpriseOperations = () => {
  const { setCurrentScreen, setActiveBranch } = useApp();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Enterprise Architecture & Infrastructure
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Enterprise Operations Overview
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Live operational telemetry across all 11 Workafella centres in Hyderabad, Chennai, Bangalore, and Mumbai.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('executive_dashboard')}
          className="px-4 py-2 bg-[#161616] text-[#f5b400] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#2f3130] flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          <span>Executive Dashboard</span>
        </button>
      </div>

      {/* 11 Centres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CENTRES.map((centre) => (
          <div
            key={centre.id}
            className="bg-white border border-[#3a3a3a] p-6 relative overflow-hidden group hover:border-[#f5b400] transition-all flex flex-col justify-between"
          >
            {/* Clipped Corner */}
            <div
              className="absolute -top-[1px] -right-[1px] w-4 h-4 bg-[#faf9f7] z-10"
              style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
            ></div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
                    {centre.name}
                  </h3>
                  <span className="text-xs text-[#7b5900] font-semibold">{centre.city}</span>
                </div>
                <span className="bg-[#161616] text-[#f5b400] px-2 py-0.5 text-[10px] font-bold font-['Space_Grotesk']">
                  {centre.occupancy}% Occupancy
                </span>
              </div>

              <div className="space-y-2 text-xs bg-[#f8f7f5] p-3 border border-[#e3e2e0] my-4">
                <div className="flex justify-between">
                  <span className="text-[#747878]">Floors / Capacity:</span>
                  <span className="font-bold text-[#161616]">{centre.floors} Floors ({centre.seats} Desks)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747878]">Private Rooms:</span>
                  <span className="font-bold text-[#161616]">{centre.rooms} Suites</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747878]">Network & Utilities:</span>
                  <span className="font-bold text-[#1e8a5f]">100% Redundant</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveBranch(centre);
                setCurrentScreen('dashboard');
              }}
              className="w-full py-2 bg-[#f4f3f1] border border-[#e3e2e0] text-[#161616] font-bold text-xs hover:bg-[#f5b400] hover:border-[#f5b400] transition-colors flex items-center justify-center gap-1"
            >
              <span>Inspect Centre Terminal</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
