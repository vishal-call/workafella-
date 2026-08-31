import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const VendorManagement = () => {
  const { activeBranch, addToast, vendors, setVendors } = useApp();
  const [selectedVendor, setSelectedVendor] = useState(vendors[0] || null);

  const handleRenewContract = (v) => {
    soundFx.playChime();
    addToast(`Generated 1-Year AMC Extension Agreement for ${v.name}`, 'success', 'Contract Renewal Dispatched');
    setVendors(
      vendors.map((item) =>
        item.id === v.id ? { ...item, isRenewingSoon: false, contractEnd: '2027-09-15' } : item
      )
    );
    setSelectedVendor({ ...selectedVendor, isRenewingSoon: false, contractEnd: '2027-09-15' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            External Partners & Service Contracts • {activeBranch.city}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616] dark:text-white">
            Vendor Management & AMC Roster
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Service partner directory, SLA performance scorecards, deployed staff rosters, and contract renewal tracking at {activeBranch.name}.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            addToast('Opening Vendor Onboarding Wizard', 'info');
          }}
          className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>+ Add Vendor Contract</span>
        </button>
      </div>

      {/* Two Column Layout: Vendor Cards & Deep Dive Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Vendor Cards List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-[#161616] dark:text-white">
            <span>Active Service Providers ({vendors.length})</span>
            <span className="text-[#c77800] dark:text-[#f5b400] bg-[#fff4e5] dark:bg-[#f5b400]/20 px-2.5 py-0.5 rounded-full">
              {vendors.filter((v) => v.isRenewingSoon).length} Renewing Within 30 Days
            </span>
          </div>

          <div className="space-y-3">
            {vendors.map((v) => {
              const isSelected = selectedVendor.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedVendor(v);
                  }}
                  className={`bg-white dark:bg-[#17181a] border rounded-3xl p-5 cursor-pointer relative transition-all shadow-sm ${
                    isSelected
                      ? 'border-2 border-[#f5b400] shadow-md ring-2 ring-[#f5b400]/20 scale-[1.01]'
                      : 'border-[#e3e2e0] dark:border-[#27272a] hover:border-[#f5b400]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#161616] dark:text-white">
                        {v.name}
                      </h4>
                      <div className="text-xs text-[#747878] dark:text-[#a1a1aa] font-medium">{v.category}</div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#161616] dark:text-white font-mono">
                        {v.monthlyValue}
                      </span>
                      <span className="text-[10px] text-[#747878] dark:text-[#a1a1aa] block">/ month</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-[#f4f3f1] dark:border-[#27272a] mt-3">
                    <div className="flex items-center gap-1.5 text-[#f5b400] font-bold">
                      <span>★ {v.rating}</span>
                      <span className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">({v.slaCompliance} SLA)</span>
                    </div>

                    <div className="text-[11px] text-[#444748] dark:text-[#d4d4d8]">
                      Contract Expiry: <strong className={v.isRenewingSoon ? 'text-[#c77800] dark:text-[#f5b400]' : 'text-[#161616] dark:text-white'}>{v.contractEnd}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Vendor Performance & SLA Scorecard Matrix */}
        <div className="lg:col-span-6 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 space-y-5 shadow-sm text-[#161616] dark:text-white">
          <div className="flex justify-between items-start pb-3 border-b border-[#e3e2e0] dark:border-[#27272a]">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5b400]">
                Vendor Performance Audit
              </span>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold mt-0.5">
                {selectedVendor.name}
              </h3>
              <p className="text-xs text-[#747878] dark:text-[#a1a1aa]">{selectedVendor.category}</p>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-[#f5b400] font-mono">★ {selectedVendor.rating}</div>
              <span className="text-[10px] text-[#1e8a5f] font-bold">Approved Tier-1 Partner</span>
            </div>
          </div>

          {/* Performance Scorecard Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#747878] dark:text-[#a1a1aa]">
              SLA Quality & Performance Metrics
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl">
                <span className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">SLA Uptime Compliance</span>
                <div className="font-mono text-base font-bold text-[#1e8a5f] mt-0.5">{selectedVendor.slaCompliance}</div>
              </div>

              <div className="p-3 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl">
                <span className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">On-Site Punctuality</span>
                <div className="font-mono text-base font-bold text-[#f5b400] mt-0.5">★ {selectedVendor.punctuality} / 5.0</div>
              </div>

              <div className="p-3 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl">
                <span className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">Dedicated Staff</span>
                <div className="font-mono text-base font-bold text-[#161616] dark:text-white mt-0.5">{selectedVendor.deployedStaff} Deployed</div>
              </div>

              <div className="p-3 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl">
                <span className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">Escalated Open Incidents</span>
                <div className="font-mono text-base font-bold text-[#1e8a5f] mt-0.5">{selectedVendor.activeTickets} Active</div>
              </div>
            </div>
          </div>

          {/* Contact & Contract Renewal Action */}
          <div className="p-4 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#747878] dark:text-[#a1a1aa]">Account Manager:</span>
              <strong className="text-[#161616] dark:text-white">{selectedVendor.contactPerson}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#747878] dark:text-[#a1a1aa]">Contract Expiry:</span>
              <strong className={selectedVendor.isRenewingSoon ? 'text-[#c77800] dark:text-[#f5b400]' : 'text-[#161616] dark:text-white'}>
                {selectedVendor.contractEnd}
              </strong>
            </div>

            {selectedVendor.isRenewingSoon ? (
              <button
                type="button"
                onClick={() => handleRenewContract(selectedVendor)}
                className="w-full py-2.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl shadow-md hover:bg-[#ffdea4] transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <span className="material-symbols-outlined text-sm">autorenew</span>
                <span>Dispatch 1-Year Contract Extension</span>
              </button>
            ) : (
              <div className="text-center text-[10px] text-[#1e8a5f] font-bold py-1">
                ✓ Contract Active & Compliant through {selectedVendor.contractEnd}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
