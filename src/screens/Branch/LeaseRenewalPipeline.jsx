'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';
import confetti from 'canvas-confetti';

export const LeaseRenewalPipeline = () => {
  const {
    activeBranch,
    currentUser,
    leaseContracts,
    renewContract,
    updateContractStage,
    markContractMoveOut,
    setCurrentScreen,
    addToast
  } = useApp();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [filterStage, setFilterStage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');

  // Modals state
  const [renewalModalContract, setRenewalModalContract] = useState(null);
  const [moveOutModalContract, setMoveOutModalContract] = useState(null);
  const [previewAddendumContract, setPreviewAddendumContract] = useState(null);

  // Renewal Form State
  const [escalationPct, setEscalationPct] = useState(6);
  const [seatDelta, setSeatDelta] = useState(0);
  const [lockInMonths, setLockInMonths] = useState(11);
  const [renewalStartDate, setRenewalStartDate] = useState('2026-10-01');

  // Move-Out Form State
  const [moveOutChecklist, setMoveOutChecklist] = useState({
    keycardsReturned: true,
    conditionApproved: true,
    itEquipmentCleared: true,
    furnitureIntact: true
  });
  const [utilityDeduction, setUtilityDeduction] = useState(0);
  const [repairDeduction, setRepairDeduction] = useState(0);
  const [moveOutDate, setMoveOutDate] = useState('2026-09-30');

  // Open Renewal Modal & set initial parameters
  const handleOpenRenewalModal = (contract) => {
    soundFx.playClick();
    setRenewalModalContract(contract);
    setEscalationPct(contract.proposedEscalation || 6);
    setSeatDelta(0);
    setLockInMonths(contract.newTermMonths || 11);
    setRenewalStartDate(contract.contractEnd || '2026-10-01');
  };

  // Open Move-Out Modal
  const handleOpenMoveOutModal = (contract) => {
    soundFx.playClick();
    setMoveOutModalContract(contract);
    setUtilityDeduction(8500);
    setRepairDeduction(0);
    setMoveOutDate(contract.contractEnd || '2026-09-30');
  };

  // Calculations for Active Renewal Modal
  const renewalCalculations = useMemo(() => {
    if (!renewalModalContract) return null;
    const baseSeats = Number(renewalModalContract.seats) || 20;
    const currentRate = Number(renewalModalContract.baseRatePerSeat) || 15000;
    const currentMonthly = baseSeats * currentRate;

    const newSeats = Math.max(1, baseSeats + Number(seatDelta));
    const newRatePerSeat = Math.round(currentRate * (1 + Number(escalationPct) / 100));
    const newMonthlyRent = newSeats * newRatePerSeat;
    const gstAmount = Math.round(newMonthlyRent * 0.18);
    const newMonthlyTotalWithGst = newMonthlyRent + gstAmount;

    const existingDeposit = Number(renewalModalContract.depositAmount) || currentMonthly * 2;
    const requiredDeposit = newMonthlyRent * 2;
    const depositDifferential = requiredDeposit - existingDeposit;

    const monthlyIncrement = newMonthlyRent - currentMonthly;
    const annualContractValue = newMonthlyRent * Number(lockInMonths);

    // Calculate new end date based on term
    const startDateObj = new Date(renewalStartDate || renewalModalContract.contractEnd);
    const endDateObj = new Date(startDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + Number(lockInMonths));
    const calculatedEndDate = endDateObj.toISOString().split('T')[0];

    return {
      baseSeats,
      newSeats,
      currentRate,
      newRatePerSeat,
      currentMonthly,
      newMonthlyRent,
      monthlyIncrement,
      gstAmount,
      newMonthlyTotalWithGst,
      existingDeposit,
      requiredDeposit,
      depositDifferential,
      annualContractValue,
      calculatedEndDate
    };
  }, [renewalModalContract, escalationPct, seatDelta, lockInMonths, renewalStartDate]);

  // Execute Renewal Handler
  const handleExecuteRenewal = (e) => {
    e.preventDefault();
    if (!renewalModalContract || !renewalCalculations) return;

    soundFx.playChime();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5B400', '#161616', '#1E8A5F']
      });
    } catch (err) {
      console.log(err);
    }

    renewContract(renewalModalContract.id, {
      seats: renewalCalculations.newSeats,
      baseRatePerSeat: renewalCalculations.newRatePerSeat,
      monthlyRent: renewalCalculations.newMonthlyRent,
      depositAmount: renewalCalculations.requiredDeposit,
      contractStart: renewalStartDate,
      contractEnd: renewalCalculations.calculatedEndDate,
      newTermMonths: Number(lockInMonths),
      proposedEscalation: Number(escalationPct),
      notes: `Renewed for ${lockInMonths} months with +${escalationPct}% escalation on ${new Date().toLocaleDateString('en-IN')}.`
    });

    setRenewalModalContract(null);
  };

  // Move-Out Settlement Calculations
  const moveOutCalculations = useMemo(() => {
    if (!moveOutModalContract) return null;
    const existingDeposit = Number(moveOutModalContract.depositAmount) || 600000;
    const totalDeductions = Number(utilityDeduction) + Number(repairDeduction);
    const netRefundable = Math.max(0, existingDeposit - totalDeductions);

    return {
      existingDeposit,
      totalDeductions,
      netRefundable
    };
  }, [moveOutModalContract, utilityDeduction, repairDeduction]);

  // Execute Move-Out Settlement
  const handleExecuteMoveOut = (e) => {
    e.preventDefault();
    if (!moveOutModalContract || !moveOutCalculations) return;

    soundFx.playClick();
    markContractMoveOut(moveOutModalContract.id, {
      moveOutDate,
      checklist: moveOutChecklist,
      totalDeductions: moveOutCalculations.totalDeductions,
      netRefunded: moveOutCalculations.netRefundable,
      processedDate: new Date().toISOString().split('T')[0]
    });

    setMoveOutModalContract(null);
  };

  // Pipeline Filtered Data
  const filteredContracts = useMemo(() => {
    return leaseContracts.filter((c) => {
      const matchesBranch = selectedBranch === 'All' || c.centre === selectedBranch;
      const matchesStage = filterStage === 'All' || c.stage === filterStage;
      const matchesSearch =
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.legalEntity && c.legalEntity.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.suites && c.suites.join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesBranch && matchesStage && matchesSearch;
    });
  }, [leaseContracts, selectedBranch, filterStage, searchQuery]);

  // Global Pipeline Metrics
  const metrics = useMemo(() => {
    const totalActive = leaseContracts.filter((c) => c.stage !== 'Notice to Vacate / Exited');
    const totalSeats = totalActive.reduce((sum, c) => sum + Number(c.seats || 0), 0);
    const totalMonthlyRevenue = totalActive.reduce((sum, c) => sum + Number(c.monthlyRent || 0), 0);
    const criticalCount = leaseContracts.filter((c) => c.stage === 'Critical (< 30 Days)').length;
    const upcomingCount = leaseContracts.filter(
      (c) => c.stage === 'Upcoming (60-90 Days)' || c.stage === 'Proposal & Negotiation'
    ).length;
    const renewedCount = leaseContracts.filter((c) => c.stage === 'Renewed').length;
    const criticalRevenue = leaseContracts
      .filter((c) => c.stage === 'Critical (< 30 Days)')
      .reduce((sum, c) => sum + Number(c.monthlyRent || 0), 0);

    return {
      totalSeats,
      totalMonthlyRevenue,
      criticalCount,
      upcomingCount,
      renewedCount,
      criticalRevenue,
      retentionRate: '94.2%'
    };
  }, [leaseContracts]);

  // Kanban Columns Definition
  const KANBAN_STAGES = [
    { id: 'Critical (< 30 Days)', label: '🚨 Critical (< 30 Days)', badge: 'bg-[#ffdad6] text-[#ba1a1a] dark:bg-[#ef4444]/20 dark:text-[#fca5a5]', color: 'border-l-4 border-l-[#ef4444]' },
    { id: 'Proposal & Negotiation', label: '📑 Proposal & Negotiation (30-60d)', badge: 'bg-[#fff4e5] text-[#c77800] dark:bg-[#f5b400]/20 dark:text-[#f5b400]', color: 'border-l-4 border-l-[#f5b400]' },
    { id: 'Upcoming (60-90 Days)', label: '⏳ Upcoming Notice (60-90d)', badge: 'bg-[#f4f3f1] text-[#444748] dark:bg-[#202024] dark:text-[#a1a1aa]', color: 'border-l-4 border-l-[#3b82f6]' },
    { id: 'Healthy (> 90 Days)', label: '🟢 Healthy Active (> 90d)', badge: 'bg-[#e6f4ea] text-[#1e8a5f] dark:bg-[#1e8a5f]/20 dark:text-[#4ade80]', color: 'border-l-4 border-l-[#1e8a5f]' },
    { id: 'Renewed', label: '✨ Renewed & Executed', badge: 'bg-[#fffdf0] text-[#7b5900] dark:bg-[#f5b400]/15 dark:text-[#f5b400]', color: 'border-l-4 border-l-[#f5b400]' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Commercial Asset Management • Expiry & Revenue Protection
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#161616] dark:text-white">
            Lease Renewal & Contract Expiry Pipeline
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Monitor client agreement expirations, calculate contractual rent escalations (+5% to +8%), simulate seat expansions, and execute renewal addendums.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setViewMode('kanban');
              }}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-[#161616] dark:bg-[#f5b400] text-[#f5b400] dark:text-[#161616] shadow-sm'
                  : 'text-[#747878] dark:text-[#a1a1aa]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setViewMode('table');
              }}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#161616] dark:bg-[#f5b400] text-[#f5b400] dark:text-[#161616] shadow-sm'
                  : 'text-[#747878] dark:text-[#a1a1aa]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">table_rows</span>
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentScreen('onboarding_wizard');
            }}
            className="px-4 py-2 bg-[#f5b400] hover:bg-[#ffdea4] text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ New Lease Agreement</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa] flex items-center justify-between">
            <span>Active Contracted Seats</span>
            <span className="material-symbols-outlined text-[#1e8a5f] text-sm">chair</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-1">
            {metrics.totalSeats} Desks
          </div>
          <div className="text-[10px] text-[#1e8a5f] mt-0.5 font-semibold">
            ₹{(metrics.totalMonthlyRevenue / 100000).toFixed(1)}L Monthly Contracted ARR
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#ba1a1a] dark:text-[#fca5a5] flex items-center justify-between">
            <span>Critical Expiries (&lt; 30d)</span>
            <span className="material-symbols-outlined text-[#ef4444] text-sm">warning</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#ef4444] mt-1">
            {metrics.criticalCount} Accounts
          </div>
          <div className="text-[10px] text-[#ef4444] mt-0.5 font-bold">
            ₹{(metrics.criticalRevenue / 100000).toFixed(1)}L /mo ARR at risk
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa] flex items-center justify-between">
            <span>Upcoming (30-90d)</span>
            <span className="material-symbols-outlined text-[#f5b400] text-sm">schedule</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-1">
            {metrics.upcomingCount} Accounts
          </div>
          <div className="text-[10px] text-[#747878] mt-0.5">Escalation proposals in prep</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa] flex items-center justify-between">
            <span>Client Renewal Rate</span>
            <span className="material-symbols-outlined text-[#f5b400] text-sm">verified</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#1e8a5f] mt-1">
            {metrics.retentionRate}
          </div>
          <div className="text-[10px] text-[#747878] mt-0.5">{metrics.renewedCount} Renewals Executed</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-[#747878] uppercase">Filter Stage:</span>
          {['All', 'Critical (< 30 Days)', 'Proposal & Negotiation', 'Upcoming (60-90 Days)', 'Healthy (> 90 Days)', 'Renewed'].map((st) => (
            <button
              key={st}
              onClick={() => {
                soundFx.playClick();
                setFilterStage(st);
              }}
              className={`px-3 py-1 rounded-xl transition-colors cursor-pointer font-semibold ${
                filterStage === st
                  ? 'bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-bold'
                  : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#747878] dark:text-[#a1a1aa] hover:text-[#161616]'
              }`}
            >
              {st === 'All' ? 'All Contracts' : st.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747878] text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client, contract ID, suite..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] text-xs rounded-xl outline-none text-[#161616] dark:text-white"
          />
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((col) => {
            const colContracts = filteredContracts.filter((c) => c.stage === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#f8f7f5] dark:bg-[#121315] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-4 flex flex-col min-h-[560px] shadow-xs space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#e3e2e0] dark:border-[#27272a]">
                  <span className="font-['Space_Grotesk'] text-xs font-bold text-[#161616] dark:text-white truncate">
                    {col.label}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${col.badge}`}>
                    {colContracts.length}
                  </span>
                </div>

                {/* Contract Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {colContracts.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-3 border border-dashed border-[#e3e2e0] dark:border-[#27272a] rounded-2xl text-[#858383] text-xs">
                      <span className="material-symbols-outlined text-xl mb-1 opacity-40">task_alt</span>
                      <span>No agreements in this phase</span>
                    </div>
                  ) : (
                    colContracts.map((contract) => {
                      const isCritical = contract.stage === 'Critical (< 30 Days)';

                      return (
                        <div
                          key={contract.id}
                          className={`bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl p-4 shadow-sm hover:border-[#f5b400] transition-all space-y-3 ${col.color} group`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-[#7b5900] dark:text-[#f5b400] bg-[#fffbf2] dark:bg-[#f5b400]/15 px-2 py-0.5 rounded-md border border-[#f5b400]/30">
                              {contract.id}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isCritical
                                  ? 'bg-[#ffdad6] dark:bg-[#ef4444]/20 text-[#ba1a1a] dark:text-[#fca5a5] animate-pulse'
                                  : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#444748] dark:text-[#a1a1aa]'
                              }`}
                            >
                              {contract.daysToExpiry}d Expiry
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-xs text-[#161616] dark:text-white group-hover:text-[#7b5900] dark:group-hover:text-[#f5b400] transition-colors leading-snug">
                              {contract.clientName}
                            </h4>
                            <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa] mt-0.5 truncate">
                              🏢 {contract.suites?.join(', ') || 'Dedicated Suite'}
                            </div>
                          </div>

                          {/* Commercial Specs */}
                          <div className="p-2.5 bg-[#f8f7f5] dark:bg-[#1a1b1d] rounded-xl border border-[#e3e2e0] dark:border-[#2e2f33] text-[11px] space-y-1">
                            <div className="flex justify-between">
                              <span className="text-[#747878]">Desks & Rate:</span>
                              <span className="font-bold text-[#161616] dark:text-white">
                                {contract.seats} Desks @ ₹{contract.baseRatePerSeat?.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#747878]">Monthly License:</span>
                              <span className="font-mono font-bold text-[#161616] dark:text-white">
                                ₹{contract.monthlyRent?.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px] pt-1 border-t border-black/5 dark:border-white/5">
                              <span className="text-[#747878]">Contract End:</span>
                              <span className="font-bold font-mono text-[#ba1a1a] dark:text-[#fca5a5]">
                                {contract.contractEnd}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-[#f4f3f1] dark:border-[#27272a] space-y-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenRenewalModal(contract)}
                              className="w-full py-2 bg-[#f5b400] hover:bg-[#ffdea4] text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">autorenew</span>
                              <span>⚡ Renew & Escalate</span>
                            </button>

                            <div className="flex items-center justify-between gap-1 text-[10px]">
                              <button
                                type="button"
                                onClick={() => {
                                  soundFx.playClick();
                                  setPreviewAddendumContract(contract);
                                }}
                                className="text-[#7b5900] dark:text-[#f5b400] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <span className="material-symbols-outlined text-xs">description</span>
                                <span>Addendum</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenMoveOutModal(contract)}
                                className="text-[#ef4444] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <span className="material-symbols-outlined text-xs">exit_to_app</span>
                                <span>Move-Out</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e0] dark:border-[#27272a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                  <th className="p-3.5 font-bold font-['Space_Grotesk']">Contract ID</th>
                  <th className="p-3.5 font-bold font-['Space_Grotesk']">Client & Legal Entity</th>
                  <th className="p-3.5 font-bold font-['Space_Grotesk']">Centre & Suites</th>
                  <th className="p-3.5 font-bold font-['Space_Grotesk'] text-center">Desks</th>
                  <th className="p-3.5 font-bold font-['Space_Grotesk'] text-right">Monthly Rent (₹)</th>
                  <th className="p-3.5 font-bold font-['Space_Grotesk']">Expiry Date</th>
                  <th className="p-3.5 font-bold font-['Space_Grotesk']">Pipeline Stage</th>
                  <th className="p-3.5 font-bold font-['Space_Grotesk'] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e0] dark:divide-[#27272a]">
                {filteredContracts.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8f7f5] dark:hover:bg-[#1a1b1d] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#7b5900] dark:text-[#f5b400]">{c.id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#161616] dark:text-white">{c.clientName}</div>
                      <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">{c.legalEntity}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#161616] dark:text-white">{c.centre}</div>
                      <div className="text-[10px] text-[#747878]">{c.suites?.join(', ')}</div>
                    </td>
                    <td className="p-3.5 text-center font-bold font-mono">{c.seats}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#161616] dark:text-white">
                      ₹{c.monthlyRent?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-[#161616] dark:text-white">{c.contractEnd}</div>
                      <div className="text-[10px] text-[#ba1a1a] font-bold">{c.daysToExpiry} days left</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#fff4e5] text-[#c77800] dark:bg-[#f5b400]/20 dark:text-[#f5b400]">
                        {c.stage}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenRenewalModal(c)}
                        className="px-3 py-1 bg-[#f5b400] hover:bg-[#ffdea4] text-[#161616] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Renew →
                      </button>
                      <button
                        onClick={() => handleOpenMoveOutModal(c)}
                        className="px-2.5 py-1 bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs rounded-lg hover:bg-[#ffb5a1] transition-colors cursor-pointer"
                      >
                        Exit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Interactive Renewal & Escalation Engine Modal */}
      {renewalModalContract && renewalCalculations && (
        <div className="fixed inset-0 bg-[#161616]/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Commercial Agreement Extension & Rent Escalation
                </span>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-0.5">
                  Renew Lease: {renewalModalContract.clientName}
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
                  Agreement #{renewalModalContract.id} • Maturing on <span className="font-bold text-[#ba1a1a]">{renewalModalContract.contractEnd}</span>
                </p>
              </div>

              <button
                onClick={() => setRenewalModalContract(null)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleExecuteRenewal} className="space-y-5 text-xs">
              {/* Interactive Commercial Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#f8f7f5] dark:bg-[#1a1b1d] rounded-2xl border border-[#e3e2e0] dark:border-[#2e2f33]">
                {/* Escalation % */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#161616] dark:text-white">Annual Escalation:</span>
                    <span className="font-mono text-[#f5b400] text-sm">+{escalationPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={escalationPct}
                    onChange={(e) => setEscalationPct(Number(e.target.value))}
                    className="w-full accent-[#f5b400] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#747878]">Standard flex-market rate: +6%</div>
                </div>

                {/* Seat Expansion/Contraction */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#161616] dark:text-white">Desk Adjustment:</span>
                    <span className="font-mono text-sm">{seatDelta >= 0 ? `+${seatDelta}` : seatDelta} Desks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSeatDelta((d) => d - 5)}
                      className="px-2 py-1 bg-white dark:bg-[#202024] border border-[#e3e2e0] rounded-lg font-bold cursor-pointer"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeatDelta(0)}
                      className="px-2 py-1 bg-white dark:bg-[#202024] border border-[#e3e2e0] rounded-lg font-bold text-[10px] cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeatDelta((d) => d + 5)}
                      className="px-2 py-1 bg-white dark:bg-[#202024] border border-[#e3e2e0] rounded-lg font-bold cursor-pointer"
                    >
                      +5
                    </button>
                  </div>
                  <div className="text-[10px] text-[#747878]">Total Desks: {renewalCalculations.newSeats}</div>
                </div>

                {/* Lock-In Term */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#161616] dark:text-white">Extension Term:</span>
                    <span className="font-mono text-sm">{lockInMonths} Months</span>
                  </div>
                  <select
                    value={lockInMonths}
                    onChange={(e) => setLockInMonths(Number(e.target.value))}
                    className="w-full p-2 bg-white dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none font-semibold"
                  >
                    <option value={6}>6 Months (Flexible)</option>
                    <option value={11}>11 Months (Standard Lock-in)</option>
                    <option value={24}>24 Months (Enterprise 2-Yr)</option>
                    <option value={36}>36 Months (Institutional 3-Yr)</option>
                  </select>
                  <div className="text-[10px] text-[#747878]">New End: {renewalCalculations.calculatedEndDate}</div>
                </div>
              </div>

              {/* Commercial Comparison Matrix */}
              <div className="p-4 bg-white dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-2xl space-y-3">
                <div className="font-bold font-['Space_Grotesk'] text-sm text-[#161616] dark:text-white border-b border-[#e3e2e0] dark:border-[#27272a] pb-2">
                  Financial Comparison & Revised Schedule
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-[#747878]">Rate Per Seat:</div>
                    <div className="font-mono font-bold text-sm text-[#161616] dark:text-white mt-0.5">
                      ₹{renewalCalculations.newRatePerSeat.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#1e8a5f] font-semibold">
                      ↑ ₹{(renewalCalculations.newRatePerSeat - renewalCalculations.currentRate).toLocaleString('en-IN')}/mo
                    </div>
                  </div>

                  <div>
                    <div className="text-[#747878]">Monthly Base:</div>
                    <div className="font-mono font-bold text-sm text-[#161616] dark:text-white mt-0.5">
                      ₹{renewalCalculations.newMonthlyRent.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#747878]">+ ₹{renewalCalculations.gstAmount.toLocaleString('en-IN')} GST (18%)</div>
                  </div>

                  <div>
                    <div className="text-[#747878]">Deposit Differential:</div>
                    <div className="font-mono font-bold text-sm text-[#161616] dark:text-white mt-0.5">
                      ₹{Math.max(0, renewalCalculations.depositDifferential).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#747878]">Total: ₹{renewalCalculations.requiredDeposit.toLocaleString('en-IN')}</div>
                  </div>

                  <div>
                    <div className="text-[#747878]">New Annual Value (ACV):</div>
                    <div className="font-mono font-bold text-sm text-[#1e8a5f] mt-0.5">
                      ₹{renewalCalculations.annualContractValue.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#1e8a5f] font-semibold">Over {lockInMonths} Months</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#e3e2e0] dark:border-[#27272a] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewAddendumContract(renewalModalContract)}
                  className="text-xs text-[#7b5900] dark:text-[#f5b400] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Preview Renewal Addendum PDF</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRenewalModalContract(null)}
                    className="px-4 py-2.5 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl text-[#161616] dark:text-white cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#f5b400] hover:bg-[#ffdea4] text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>Sign & Execute Renewal Agreement</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Move-Out & Security Deposit Settlement Modal */}
      {moveOutModalContract && moveOutCalculations && (
        <div className="fixed inset-0 bg-[#161616]/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ba1a1a]">
                  Lease Exit & Security Deposit Reconciliation
                </span>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-0.5">
                  Move-Out: {moveOutModalContract.clientName}
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-0.5">
                  Contract #{moveOutModalContract.id} • Vacating {moveOutModalContract.suites?.join(', ')}
                </p>
              </div>

              <button
                onClick={() => setMoveOutModalContract(null)}
                className="text-[#747878] hover:text-[#161616] p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleExecuteMoveOut} className="space-y-4 text-xs">
              {/* Handover Checklist */}
              <div className="space-y-2 p-3 bg-[#f8f7f5] dark:bg-[#1a1b1d] rounded-2xl border border-[#e3e2e0] dark:border-[#2e2f33]">
                <div className="font-bold text-[#161616] dark:text-white mb-1">Move-Out Physical Clearance Checklist:</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moveOutChecklist.keycardsReturned}
                    onChange={(e) => setMoveOutChecklist({ ...moveOutChecklist, keycardsReturned: e.target.checked })}
                    className="text-[#f5b400] rounded focus:ring-0"
                  />
                  <span>All RFID biometric access keycards & turnstile tokens surrendered ({moveOutModalContract.seats} cards)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moveOutChecklist.conditionApproved}
                    onChange={(e) => setMoveOutChecklist({ ...moveOutChecklist, conditionApproved: e.target.checked })}
                    className="text-[#f5b400] rounded focus:ring-0"
                  />
                  <span>Suite walls, glass doors, and physical space condition verified intact</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moveOutChecklist.itEquipmentCleared}
                    onChange={(e) => setMoveOutChecklist({ ...moveOutChecklist, itEquipmentCleared: e.target.checked })}
                    className="text-[#f5b400] rounded focus:ring-0"
                  />
                  <span>Dedicated server rack / private router leased-lines disconnected</span>
                </label>
              </div>

              {/* Deductions Matrix */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Electricity & Overage Deductions (₹)</label>
                  <input
                    type="number"
                    value={utilityDeduction}
                    onChange={(e) => setUtilityDeduction(Number(e.target.value))}
                    className="w-full p-2 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Repair / Painting Deductions (₹)</label>
                  <input
                    type="number"
                    value={repairDeduction}
                    onChange={(e) => setRepairDeduction(Number(e.target.value))}
                    className="w-full p-2 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              {/* Refund Summary Box */}
              <div className="p-4 bg-[#fff8f7] dark:bg-[#241718] border border-[#ffdad6] rounded-2xl space-y-1">
                <div className="flex justify-between text-[#747878]">
                  <span>Held Security Deposit:</span>
                  <span className="font-mono font-bold">₹{moveOutCalculations.existingDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#ef4444]">
                  <span>Total Deductions:</span>
                  <span className="font-mono font-bold">- ₹{moveOutCalculations.totalDeductions.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-black/10 dark:border-white/10 font-bold text-sm text-[#1e8a5f]">
                  <span>Net Refundable Settlement:</span>
                  <span className="font-mono text-base">₹{moveOutCalculations.netRefundable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e3e2e0] dark:border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setMoveOutModalContract(null)}
                  className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl text-[#161616] dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-['Space_Grotesk'] font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Finalize Move-Out & Release Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Printable Agreement Extension Addendum */}
      {previewAddendumContract && (
        <div className="fixed inset-0 bg-[#161616]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white text-[#161616] rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-start border-b-2 border-[#161616] pb-4">
              <div>
                <div className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight">WORKAFELLA WORKSPACE OS</div>
                <div className="text-[10px] uppercase tracking-widest text-[#7b5900] font-bold">
                  Master Service Agreement (MSA) Extension Addendum
                </div>
              </div>
              <button
                onClick={() => setPreviewAddendumContract(null)}
                className="text-[#747878] hover:text-[#161616] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="text-xs space-y-4 leading-relaxed text-[#444748]">
              <p>
                This <strong>Lease Renewal & Extension Addendum</strong> is entered into on <strong>{new Date().toLocaleDateString('en-IN')}</strong> between <strong>Workafella Real Estate & Workspace Platform Ltd</strong> and <strong>{previewAddendumContract.legalEntity || previewAddendumContract.clientName}</strong> ("Licensee").
              </p>

              <div className="p-4 bg-[#f8f7f5] rounded-xl border border-[#e3e2e0] space-y-2">
                <div className="font-bold text-[#161616] uppercase text-[10px]">Schedule of Extended Commercial Terms:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Agreement ID:</strong> {previewAddendumContract.id}</div>
                  <div><strong>Licensed Centre:</strong> {previewAddendumContract.centre}</div>
                  <div><strong>Allocated Suites:</strong> {previewAddendumContract.suites?.join(', ')}</div>
                  <div><strong>Total Workstation Desks:</strong> {previewAddendumContract.seats} Desks</div>
                  <div><strong>Revised Monthly Fee:</strong> ₹{previewAddendumContract.monthlyRent?.toLocaleString('en-IN')} + 18% GST</div>
                  <div><strong>Effective Renewal Date:</strong> {previewAddendumContract.contractStart || '2026-10-01'}</div>
                  <div><strong>Extended Term Expiry:</strong> {previewAddendumContract.contractEnd || '2027-09-30'}</div>
                  <div><strong>Lock-In Period:</strong> {previewAddendumContract.newTermMonths || 11} Months</div>
                </div>
              </div>

              <p>
                All other terms, conditions, codes of conduct, and network uptime service level agreements specified under the Original Master Service Agreement shall continue in full force and effect without alteration.
              </p>

              <div className="pt-8 border-t border-[#e3e2e0] grid grid-cols-2 gap-8 text-center text-xs">
                <div className="border-t border-dashed border-[#747878] pt-2">
                  <div className="font-bold">For Workafella India Ltd</div>
                  <div className="text-[10px] text-[#747878]">Authorized Signatory</div>
                </div>
                <div className="border-t border-dashed border-[#747878] pt-2">
                  <div className="font-bold">For {previewAddendumContract.clientName}</div>
                  <div className="text-[10px] text-[#747878]">Authorized Director / Signatory</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e3e2e0] flex justify-end gap-2">
              <button
                onClick={() => setPreviewAddendumContract(null)}
                className="px-4 py-2 bg-[#f4f3f1] font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  soundFx.playChime();
                  window.print();
                }}
                className="px-5 py-2 bg-[#f5b400] text-[#161616] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print Legal Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
