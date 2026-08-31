'use client';

import React, { useState } from 'react';
import { WorkspaceDetailsModal } from './WorkspaceDetailsModal';
import { soundFx } from '../utils/audioEffects';

export const InteractiveFloorMap = ({ selectedRooms = [], onToggleRoom, readOnly = false }) => {
  const [activeFloor, setActiveFloor] = useState('Floor 7');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'available' | 'occupied' | 'meeting'
  const [hoveredSuite, setHoveredSuite] = useState(null);
  const [inspectingSuite, setInspectingSuite] = useState(null);

  const suites = [
    { id: 'Suite 701', name: 'Suite 701', floor: 'Floor 7', desks: 20, status: 'Occupied', client: 'Cognizant Digital', area: '1,200 sq.ft', type: 'Private Office' },
    { id: 'Suite 702', name: 'Suite 702', floor: 'Floor 7', desks: 15, status: 'Occupied', client: 'Zenith Systems', area: '950 sq.ft', type: 'Private Office' },
    { id: 'Suite 703', name: 'Suite 703', floor: 'Floor 7', desks: 25, status: 'Available', client: 'Vacant Space', area: '1,500 sq.ft', type: 'Private Office' },
    { id: 'Suite 704', name: 'Suite 704', floor: 'Floor 7', desks: 30, status: 'Occupied', client: 'Acme Innovations', area: '1,800 sq.ft', type: 'Enterprise Wing' },
    { id: 'Suite 705', name: 'Suite 705', floor: 'Floor 7', desks: 15, status: 'Occupied', client: 'Acme Innovations', area: '900 sq.ft', type: 'Private Office' },
    { id: 'Suite 706', name: 'Suite 706', floor: 'Floor 7', desks: 15, status: 'Available', client: 'Vacant (Expansion Signal)', area: '920 sq.ft', type: 'Private Office' },
    { id: 'Boardroom 7A', name: 'The Boardroom 7A', floor: 'Floor 7', desks: 16, status: 'Meeting Room', client: 'Conference Suite', area: '650 sq.ft', type: 'Conference Suite' },
    { id: 'Pod Alpha', name: 'Creator Pod Alpha', floor: 'Floor 7', desks: 4, status: 'Meeting Room', client: 'Huddle Focus Pod', area: '200 sq.ft', type: 'Focus Pod' },

    // Floor 8
    { id: 'Suite 801', name: 'Suite 801', floor: 'Floor 8', desks: 20, status: 'Available', client: 'Vacant Space', area: '1,200 sq.ft', type: 'Private Office' },
    { id: 'Suite 802', name: 'Suite 802', floor: 'Floor 8', desks: 15, status: 'Available', client: 'Vacant Space', area: '900 sq.ft', type: 'Private Office' },
    { id: 'Suite 803', name: 'Suite 803', floor: 'Floor 8', desks: 40, status: 'Occupied', client: 'Infosys FinTech', area: '2,400 sq.ft', type: 'Custom Built Wing' },
    { id: 'Boardroom 8B', name: 'Executive Boardroom 8B', floor: 'Floor 8', desks: 20, status: 'Meeting Room', client: 'VIP Conference Suite', area: '800 sq.ft', type: 'VIP Conference' }
  ];

  const currentFloorSuites = suites.filter((s) => s.floor === activeFloor);

  const filteredSuites = currentFloorSuites.filter((s) => {
    if (filterType === 'available') return s.status === 'Available';
    if (filterType === 'occupied') return s.status === 'Occupied';
    if (filterType === 'meeting') return s.status === 'Meeting Room';
    return true;
  });

  const totalFloorDesks = currentFloorSuites.reduce((acc, s) => acc + s.desks, 0);
  const occupiedFloorDesks = currentFloorSuites
    .filter((s) => s.status === 'Occupied')
    .reduce((acc, s) => acc + s.desks, 0);
  const floorOccupancyPct = Math.round((occupiedFloorDesks / totalFloorDesks) * 100) || 0;

  const getSuiteStatusStyle = (suite) => {
    const isSelected = selectedRooms.some((r) => r.includes(suite.name) || r.includes(suite.id));
    if (isSelected) {
      return 'bg-[#fffbf2] dark:bg-[#f5b400]/15 border-2 border-[#f5b400] text-[#161616] dark:text-white shadow-lg ring-4 ring-[#f5b400]/20 scale-[1.02]';
    }
    switch (suite.status) {
      case 'Available':
        return 'bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7] dark:from-[#14231b] dark:to-[#0d1712] border-2 border-[#22c55e] text-[#15803d] dark:text-[#4ade80] shadow-sm hover:border-[#16a34a] hover:shadow-md';
      case 'Occupied':
        return 'bg-gradient-to-b from-[#ffffff] to-[#f4f3f1] dark:from-[#1b1c1e] dark:to-[#141517] border border-[#d4d4d8] dark:border-[#2e2f33] text-[#3f3f46] dark:text-[#d4d4d8] opacity-95 hover:border-[#a1a1aa]';
      case 'Meeting Room':
        return 'bg-gradient-to-b from-[#faf5ff] to-[#f3e8ff] dark:from-[#20152b] dark:to-[#170e20] border-2 border-[#a855f7] text-[#7e22ce] dark:text-[#c084fc] shadow-sm hover:border-[#9333ea]';
      default:
        return 'bg-white dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] text-[#161616] dark:text-white';
    }
  };

  return (
    <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-5 transition-all">
      {/* Top Header Bar: Floor Switcher, Live Telemetry & Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e3e2e0] dark:border-[#27272a]">
        <div className="flex items-center gap-3">
          {/* Floor Switcher */}
          <div className="flex bg-[#f4f3f1] dark:bg-[#202024] p-1 rounded-2xl border border-[#e3e2e0] dark:border-[#2e2f33]">
            {['Floor 7', 'Floor 8'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveFloor(f);
                }}
                className={`px-4 py-1.5 rounded-xl font-['Space_Grotesk'] text-xs font-bold transition-all cursor-pointer ${
                  activeFloor === f
                    ? 'bg-[#161616] dark:bg-[#f5b400] text-[#f5b400] dark:text-[#161616] shadow-sm'
                    : 'text-[#747878] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Live Floor Telemetry Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs bg-[#faf9f7] dark:bg-[#1f2023] px-3.5 py-1.5 rounded-xl border border-[#e3e2e0] dark:border-[#2e2f33] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#1e8a5f] animate-pulse"></span>
            <span className="text-[#161616] dark:text-white font-bold">{floorOccupancyPct}% Occupancy</span>
            <span className="text-[#747878] dark:text-[#858383]">({occupiedFloorDesks}/{totalFloorDesks} Desks)</span>
          </div>
        </div>

        {/* Legend & Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-bold shadow-xs'
                : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#747878] dark:text-[#a1a1aa] hover:text-black dark:hover:text-white'
            }`}
          >
            All Units ({currentFloorSuites.length})
          </button>
          <button
            onClick={() => setFilterType('available')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              filterType === 'available'
                ? 'bg-[#15803d] text-white font-bold shadow-xs'
                : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#15803d] dark:text-[#4ade80] hover:bg-[#e7f5ed]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span>Available</span>
          </button>
          <button
            onClick={() => setFilterType('occupied')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              filterType === 'occupied'
                ? 'bg-[#52525b] text-white font-bold shadow-xs'
                : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#747878] dark:text-[#a1a1aa] hover:bg-[#e4e4e7]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#71717a]"></span>
            <span>Occupied</span>
          </button>
          <button
            onClick={() => setFilterType('meeting')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              filterType === 'meeting'
                ? 'bg-[#9333ea] text-white font-bold shadow-xs'
                : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#9333ea] dark:text-[#c084fc] hover:bg-[#f3e8ff]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span>
            <span>Meeting Rooms</span>
          </button>
        </div>
      </div>

      {/* Architectural CAD Blueprint Visualizer */}
      <div className="p-5 bg-gradient-to-b from-[#faf9f7] to-[#f4f3f1] dark:from-[#0d0e10] dark:to-[#070809] border-2 border-dashed border-[#e3e2e0] dark:border-[#27272a] rounded-3xl relative overflow-hidden">
        {/* CAD Grid Header Coordinates */}
        <div className="text-[10px] uppercase font-bold text-[#858383] tracking-widest mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#f5b400]">explore</span>
            <span>{activeFloor} Architectural Blueprint • North Wing Elevation</span>
          </div>
          <span className="text-[10px] text-[#f5b400] font-mono font-bold bg-[#161616] dark:bg-[#202024] px-2.5 py-0.5 rounded-full border border-white/10">
            Interactive Click-to-Inspect
          </span>
        </div>

        {/* Floor Grid Layout of Suites */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredSuites.map((suite) => {
            const isSelected = selectedRooms.some((r) => r.includes(suite.name) || r.includes(suite.id));

            return (
              <div
                key={suite.id}
                onClick={() => {
                  soundFx.playClick();
                  setInspectingSuite(suite);
                }}
                onMouseEnter={() => setHoveredSuite(suite)}
                onMouseLeave={() => setHoveredSuite(null)}
                className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer min-h-[125px] flex flex-col justify-between relative group hover:-translate-y-1 hover:shadow-xl ${getSuiteStatusStyle(
                  suite
                )}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-['Space_Grotesk'] text-sm font-bold leading-tight group-hover:text-[#f5b400] transition-colors">
                        {suite.name}
                      </h4>
                      <span className="text-[10px] opacity-75 font-mono block mt-0.5">{suite.area}</span>
                    </div>

                    <div className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-[#f5b400] group-hover:text-[#161616] transition-colors">
                      <span className="material-symbols-outlined text-xs">
                        {isSelected ? 'check' : 'open_in_new'}
                      </span>
                    </div>
                  </div>

                  {/* Tenant Tag / Room Type */}
                  <div className="mt-2 text-[10px] font-semibold truncate">
                    {suite.status === 'Occupied' ? (
                      <span className="text-[#52525b] dark:text-[#a1a1aa] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">
                        {suite.client}
                      </span>
                    ) : suite.status === 'Available' ? (
                      <span className="text-[#15803d] dark:text-[#4ade80] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping"></span>
                        <span>Open for Allocation</span>
                      </span>
                    ) : (
                      <span className="text-[#7e22ce] dark:text-[#c084fc] font-bold">
                        {suite.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-2 border-t border-current/15 flex justify-between items-center text-[11px] font-mono">
                  <span className="font-bold">{suite.desks} Desks</span>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded">
                    {isSelected ? 'SELECTED' : suite.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Core, Elevators & Amenities Hub Strip */}
        <div className="mt-4 p-3 bg-white/80 dark:bg-[#161719]/90 backdrop-blur-md border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl flex items-center justify-around text-xs font-semibold text-[#444748] dark:text-[#a1a1aa] shadow-xs">
          <div className="flex items-center gap-2 hover:text-[#f5b400] transition-colors">
            <span className="w-7 h-7 rounded-lg bg-[#f4f3f1] dark:bg-[#242528] flex items-center justify-center text-[#f5b400]">
              <span className="material-symbols-outlined text-sm">elevator</span>
            </span>
            <span className="text-[11px] font-bold">High-Speed Elevators</span>
          </div>

          <div className="h-4 w-px bg-[#e3e2e0] dark:bg-[#27272a]"></div>

          <div className="flex items-center gap-2 hover:text-[#f5b400] transition-colors">
            <span className="w-7 h-7 rounded-lg bg-[#f4f3f1] dark:bg-[#242528] flex items-center justify-center text-[#f5b400]">
              <span className="material-symbols-outlined text-sm">local_cafe</span>
            </span>
            <span className="text-[11px] font-bold">Central Barista Cafeteria Zone</span>
          </div>

          <div className="h-4 w-px bg-[#e3e2e0] dark:bg-[#27272a]"></div>

          <div className="flex items-center gap-2 hover:text-[#f5b400] transition-colors">
            <span className="w-7 h-7 rounded-lg bg-[#f4f3f1] dark:bg-[#242528] flex items-center justify-center text-[#f5b400]">
              <span className="material-symbols-outlined text-sm">wc</span>
            </span>
            <span className="text-[11px] font-bold">Executive Restroom Facilities</span>
          </div>
        </div>
      </div>

      {/* Hovered Suite Mini Tooltip Bar */}
      {hoveredSuite && (
        <div className="p-3 bg-[#161616] text-white rounded-2xl flex items-center justify-between text-xs animate-fade-in border border-[#333338] shadow-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f5b400] text-sm animate-pulse">info</span>
            <span>
              <strong className="text-[#f5b400]">{hoveredSuite.name}:</strong> {hoveredSuite.desks} Desks • {hoveredSuite.area} • {hoveredSuite.client}
            </span>
          </div>
          <span className="text-[10px] text-[#f5b400] font-bold uppercase tracking-wider flex items-center gap-1">
            <span>Click to inspect 360° specs</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </span>
        </div>
      )}

      {/* Interactive Workspace Specification & Photo Drawer */}
      <WorkspaceDetailsModal
        suite={inspectingSuite}
        onClose={() => setInspectingSuite(null)}
        onSelectSuite={onToggleRoom}
        isSelected={selectedRooms.some((r) => r.includes(inspectingSuite?.name) || r.includes(inspectingSuite?.id))}
      />
    </div>
  );
};
