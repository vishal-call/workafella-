import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const EmployeeAccessForm = () => {
  const { accessRequests, setAccessRequests, activeBranch, currentUser, setCurrentScreen } = useApp();

  const [employeeName, setEmployeeName] = useState('Rahul Nambisan');
  const [email, setEmail] = useState('rahul.n@acmeinnovations.io');
  const [floorRoom, setFloorRoom] = useState('Floor 7 / Suite 704 & 705');
  const [scope, setScope] = useState(['24/7 Building Turnstile', 'Suite 704 Smart Lock', '7th Floor Meeting Rooms']);

  const availableScopes = [
    '24/7 Building Turnstile',
    'Suite 704 Smart Lock',
    'Suite 705 Smart Lock',
    '7th Floor Meeting Rooms',
    'Level 8 Executive Lounge'
  ];

  const toggleScope = (s) => {
    if (scope.includes(s)) {
      setScope(scope.filter((item) => item !== s));
    } else {
      setScope([...scope, s]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: `ACC-${Math.floor(3000 + Math.random() * 1000)}`,
      employeeName,
      email,
      company: currentUser.name.includes('Acme') ? 'Acme Innovations Pvt Ltd' : currentUser.name,
      centre: activeBranch.name,
      floorRoom,
      scope,
      status: 'Under Review',
      submittedDate: '2026-08-29',
      idDocument: 'rahul_nambisan_id_proof.pdf',
      biometricStatus: 'Pending Verification'
    };

    setAccessRequests([newReq, ...accessRequests]);
    alert(`Success! Biometric access request submitted for ${employeeName}. Forwarded to Branch Admin.`);
    setCurrentScreen('access_approvals');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Access Control & Biometrics
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Employee Biometric Access Request
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Onboard client employees for turnstile gate clearance and smart office suite access.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('access_approvals')}
          className="text-xs text-[#747878] hover:text-[#161616] font-semibold flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">fingerprint</span>
          <span>View Access Queue</span>
        </button>
      </div>

      {/* Access Form */}
      <div className="bg-white border border-[#3a3a3a] p-8 relative">
        <div
          className="absolute -top-[1px] -right-[1px] w-4 h-4 bg-[#faf9f7] z-10"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        ></div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-[#161616] mb-1">Employee Full Name</label>
              <input
                type="text"
                required
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Work Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Centre / Floor / Suite</label>
              <input
                type="text"
                required
                value={floorRoom}
                onChange={(e) => setFloorRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Employer / Legal Entity</label>
              <input
                type="text"
                disabled
                value="Acme Innovations Pvt Ltd"
                className="w-full px-3.5 py-2.5 bg-[#e3e2e0] border border-[#c4c7c7] text-[#444748] outline-none font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Access Scope Checkboxes */}
          <div>
            <label className="block font-bold text-[#161616] dark:text-white mb-2 uppercase tracking-wider text-[11px]">
              Requested Access Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableScopes.map((s, idx) => {
                const isChecked = scope.includes(s);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleScope(s)}
                    className={`p-3 border flex items-center justify-between cursor-pointer transition-all rounded-xl ${
                      isChecked
                        ? 'border-2 border-[#f5b400] bg-[#fffbf2] dark:bg-[#f5b400]/15 dark:text-white font-bold shadow-sm'
                        : 'border-[#e3e2e0] dark:border-[#2e2f33] bg-[#f8f7f5] dark:bg-[#1a1b1d] text-[#444748] dark:text-[#d4d4d8] hover:border-[#f5b400]/50'
                    }`}
                  >
                    <span className="text-xs font-semibold">{s}</span>
                    <span className="material-symbols-outlined text-base text-[#f5b400]">
                      {isChecked ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mandatory KYC Document Upload */}
          <div className="border-2 border-dashed border-[#c4c7c7] p-5 text-center bg-[#faf9f7] hover:border-[#f5b400] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[#f5b400] text-3xl mb-1">upload_file</span>
            <div className="text-xs font-bold text-[#161616]">Upload Masked Aadhaar / Passport ID Copy (PDF, Max 5MB)</div>
            <div className="text-[10px] text-[#747878] mt-0.5">Attached: rahul_nambisan_id_proof.pdf (Encrypted at rest)</div>
          </div>

          <div className="pt-4 border-t border-[#e3e2e0] flex items-center justify-between">
            <span className="text-[11px] text-[#747878]">
              Branch Admin review followed by physical hardware biometric capture.
            </span>

            <button
              type="submit"
              className="px-8 py-3 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-sm hover:bg-[#ffdea4] transition-colors flex items-center gap-2 shadow-md"
            >
              <span>Submit Access Request</span>
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
