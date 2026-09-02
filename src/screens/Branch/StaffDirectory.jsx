import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const StaffDirectory = () => {
  const { activeBranch } = useApp();

  const staffMembers = [
    {
      name: 'Ramesh Kumar',
      designation: 'Centre General Manager / Branch Admin',
      role: 'Branch Admin',
      email: 'ramesh.kumar@workafella.com',
      phone: '+91 98400 12345',
      shift: '09:00 AM - 06:00 PM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 1] // 7 days check-in dots
    },
    {
      name: 'Arjun Mehta',
      designation: 'Operations & Facility Manager',
      role: 'Operations / Facility',
      email: 'arjun.mehta@workafella.com',
      phone: '+91 98400 54321',
      shift: '08:30 AM - 05:30 PM',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 0, 1]
    },
    {
      name: 'Naveen Kumar',
      designation: 'Enterprise Network & IT Lead',
      role: 'Operations Staff',
      email: 'naveen.k@workafella.com',
      phone: '+91 98400 67890',
      shift: '10:00 AM - 07:00 PM',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 1]
    },
    {
      name: 'Suresh Babu',
      designation: 'Chief HVAC & Electrical Engineer',
      role: 'Operations Staff',
      email: 'suresh.b@workafella.com',
      phone: '+91 98400 99887',
      shift: '07:00 AM - 04:00 PM',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 0]
    },
    {
      name: 'Chandana Reddy',
      designation: 'Housekeeping & Pantry Services Lead',
      role: 'Operations Staff',
      email: 'chandana.r@workafella.com',
      phone: '+91 98400 77665',
      shift: '06:30 AM - 03:30 PM',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 1]
    }
  ];

  const [selectedStaff, setSelectedStaff] = useState(staffMembers[0]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Internal Team & Workforce
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Branch Staff Directory & Attendance
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Role assignments, shift schedules, and gold-triangle biometric check-in attendance at {activeBranch.name}.
          </p>
        </div>

        <button className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>+ Add Team Member</span>
        </button>
      </div>

      {/* Staff Grid & Attendance View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Staff Cards Grid with Clipped Corners */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {staffMembers.map((s, idx) => {
            const isSelected = selectedStaff.name === s.name;
            return (
              <div
                key={idx}
                onClick={() => setSelectedStaff(s)}
                className={`bg-white border p-5 cursor-pointer relative overflow-hidden transition-all ${
                  isSelected ? 'border-2 border-[#f5b400] shadow-md' : 'border-[#3a3a3a] hover:border-[#f5b400]'
                }`}
              >
                {/* Clipped Top-Right Corner */}
                <div
                  className="absolute -top-[1px] -right-[1px] w-3.5 h-3.5 bg-[#faf9f7] z-10"
                  style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                ></div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-none border border-[#3a3a3a] overflow-hidden flex-shrink-0">
                    <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#161616]">
                      {s.name}
                    </h4>
                    <div className="text-[11px] text-[#747878] leading-tight">{s.designation}</div>
                  </div>
                </div>

                {/* Attendance Mini-Calendar styled with gold triangles */}
                <div className="pt-3 border-t border-[#f4f3f1] flex items-center justify-between">
                  <span className="text-[10px] text-[#747878] uppercase font-bold">Week Attendance:</span>
                  <div className="flex gap-1.5">
                    {s.attendance.map((present, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 ${present ? 'bg-[#f5b400]' : 'bg-[#e3e2e0]'}`}
                        style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                        title={present ? 'Check-in Recorded' : 'Off Shift / Leave'}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Staff Profile & Shift Controls */}
        <div className="lg:col-span-5 bg-white border border-[#3a3a3a] p-6 space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-[#e3e2e0]">
            <div className="w-16 h-16 rounded-none border border-[#3a3a3a] overflow-hidden flex-shrink-0">
              <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                {selectedStaff.name}
              </h3>
              <p className="text-xs text-[#747878]">{selectedStaff.designation}</p>
              <span className="inline-block mt-1 bg-[#161616] text-[#f5b400] px-2 py-0.5 text-[10px] font-bold">
                {selectedStaff.role}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs bg-[#f8f7f5] p-4 border border-[#e3e2e0]">
            <div className="flex justify-between">
              <span className="text-[#747878]">Email:</span>
              <span className="font-semibold text-[#161616]">{selectedStaff.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747878]">Mobile Phone:</span>
              <span className="font-semibold text-[#161616]">{selectedStaff.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747878]">Standard Shift:</span>
              <span className="font-bold text-[#161616]">{selectedStaff.shift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747878]">Hardware Biometrics:</span>
              <span className="font-bold text-[#1e8a5f]">Enrolled & Verified</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#161616]">Role & Permission Scope</label>
            <div className="p-3 bg-[#f4f3f1] border border-[#e3e2e0] text-xs text-[#444748]">
              Authorized for {selectedStaff.role} module capabilities and centre administration.
            </div>
          </div>

          <div className="pt-4 border-t border-[#e3e2e0] flex gap-2">
            <button className="flex-1 py-2 bg-[#161616] text-[#f5b400] font-bold text-xs hover:bg-[#2f3130]">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-[#f4f3f1] text-[#ba1a1a] font-bold text-xs border border-[#e3e2e0] hover:bg-[#ffdad6]">
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
