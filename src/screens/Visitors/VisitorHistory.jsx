import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const VisitorHistory = () => {
  const { visitors, activeBranch, setCurrentScreen } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = filterStatus === 'All'
    ? visitors
    : visitors.filter((v) => v.status === filterStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Access & Security Audit
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Visitor Access Logs & History
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Historical visitor check-in/out timestamps, host tracking, and security watchlist monitoring at {activeBranch.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('visitor_pre_reg')}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Pre-register Visitor</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#3a3a3a] p-4 flex justify-between items-center text-xs">
        <div className="flex gap-2">
          {['All', 'Checked In', 'Expected', 'Checked Out'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-[#161616] text-[#f5b400]'
                  : 'bg-[#f4f3f1] text-[#747878] hover:text-[#161616]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <button className="text-xs text-[#7b5900] font-bold hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">file_download</span>
          <span>Export CSV Log</span>
        </button>
      </div>

      {/* Visitor Table */}
      <div className="bg-white border border-[#3a3a3a] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Visitor Name</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Company</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Host Employee</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Date & Slot</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Check In</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Check Out</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2e0]">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-[#f8f7f5] transition-colors">
                <td className="p-3.5 font-bold text-[#161616]">{v.name}</td>
                <td className="p-3.5 text-[#444748]">{v.company}</td>
                <td className="p-3.5 font-semibold text-[#161616]">{v.host}</td>
                <td className="p-3.5 text-[#444748]">{v.date} • {v.timeSlot}</td>
                <td className="p-3.5 text-[#1e8a5f] font-semibold">{v.checkInTime || '—'}</td>
                <td className="p-3.5 text-[#747878]">{v.checkOutTime || '—'}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      v.status === 'Checked In'
                        ? 'bg-[#e7f5ed] text-[#1e8a5f]'
                        : v.status === 'Expected'
                        ? 'bg-[#fff4e5] text-[#c77800]'
                        : 'bg-[#f4f3f1] text-[#747878]'
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
