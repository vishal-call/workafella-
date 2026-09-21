import React, { useState, useMemo } from 'react';
import { useApp, CENTRES } from '../../context/AppContext';

export const GSTReconciliation = () => {
  const {
    gstRecords,
    runGstBatchReconciliation,
    sendVendorGstNotice,
    toggleVendorPaymentHold,
    resolveGstMismatch,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuditRecord, setSelectedAuditRecord] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [simulateAllRecovered, setSimulateAllRecovered] = useState(false);

  // States available in dataset
  const states = ['All States', 'Telangana', 'Tamil Nadu', 'Karnataka', 'Maharashtra'];

  // Calculations
  const metrics = useMemo(() => {
    let totalBooksTax = 0;
    let total2bTax = 0;
    let matchedTax = 0;
    let atRiskTax = 0;
    let blockedTax = 0;
    let onHoldCount = 0;

    gstRecords.forEach((r) => {
      totalBooksTax += r.taxInBooks;
      total2bTax += r.taxIn2B;

      if (r.status === 'Matched') {
        matchedTax += r.taxIn2B;
      } else if (r.status === 'Blocked / Sec 17(5)') {
        blockedTax += r.taxInBooks;
      } else {
        atRiskTax += Math.abs(r.variance);
      }

      if (r.paymentStatus === 'On Hold') {
        onHoldCount++;
      }
    });

    const tenantOutputTax = 4464000; // 18% on ₹2.48 Cr MRR tenant billing
    const eligibleClaim = simulateAllRecovered
      ? totalBooksTax - blockedTax
      : matchedTax;
    const netCashPayable = tenantOutputTax - eligibleClaim;

    return {
      totalBooksTax,
      total2bTax,
      matchedTax,
      atRiskTax,
      blockedTax,
      onHoldCount,
      tenantOutputTax,
      eligibleClaim,
      netCashPayable
    };
  }, [gstRecords, simulateAllRecovered]);

  // Filtering
  const filteredRecords = useMemo(() => {
    return gstRecords.filter((r) => {
      // Tab Filter
      if (activeTab === 'Matched' && r.status !== 'Matched') return false;
      if (activeTab === 'Value Mismatch' && r.status !== 'Value Mismatch') return false;
      if (activeTab === 'Missing in 2B' && r.status !== 'Missing in 2B') return false;
      if (activeTab === 'Blocked / Sec 17(5)' && r.status !== 'Blocked / Sec 17(5)') return false;
      if (activeTab === 'Payment On Hold' && r.paymentStatus !== 'On Hold') return false;

      // State Filter
      if (selectedState !== 'All States' && r.state !== selectedState) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = r.vendorName.toLowerCase().includes(q);
        const matchGstin = r.vendorGstin.toLowerCase().includes(q);
        const matchInv = r.invoiceNumber.toLowerCase().includes(q);
        const matchCentre = r.centre.toLowerCase().includes(q);
        if (!matchName && !matchGstin && !matchInv && !matchCentre) return false;
      }

      return true;
    });
  }, [gstRecords, activeTab, selectedState, searchQuery]);

  const handleSyncFeed = () => {
    setIsSyncing(true);
    setTimeout(() => {
      runGstBatchReconciliation();
      setIsSyncing(false);
    }, 900);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Matched':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Matched (2B Verified)
          </span>
        );
      case 'Value Mismatch':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <span className="material-symbols-outlined text-[13px]">warning</span>
            Value Mismatch
          </span>
        );
      case 'Missing in 2B':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <span className="material-symbols-outlined text-[13px]">cancel</span>
            Missing in 2B (Defaulter)
          </span>
        );
      case 'Blocked / Sec 17(5)':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            <span className="material-symbols-outlined text-[13px]">block</span>
            Sec 17(5) Ineligible
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-[#161616] dark:text-[#f4f4f5]">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            <span className="material-symbols-outlined text-sm">account_balance</span>
            <span>Finance & Billing Operations • Rule 36(4) Statutory Audit</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold tracking-tight">
            GST ITC Reconciliation & Vendor Tax Audit Hub
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1 max-w-3xl">
            Automate matching between Purchase Register (Books) and Govt GSTR-2B portal feeds under Section 16(2)(aa). Withhold AP disbursements from non-filing vendors and maximize GSTR-3B cash offsets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncFeed}
            disabled={isSyncing}
            className={`px-4 py-2.5 rounded-xl font-['Space_Grotesk'] text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
              isSyncing
                ? 'bg-amber-100 text-amber-900 cursor-wait'
                : 'bg-[#161616] hover:bg-[#27272a] text-[#f5b400] border border-[#f5b400]/30'
            }`}
          >
            <span className={`material-symbols-outlined text-base ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isSyncing ? 'Pulling GSTR-2B Feed...' : 'Sync GSTR-2B Portal Feed'}</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2.5 bg-[#f5b400] hover:bg-[#e5a800] text-[#161616] font-['Space_Grotesk'] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Print CA Audit Statement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total ITC in Books */}
        <div className="bg-white dark:bg-[#1f1f23] border border-[#e3e2e0] dark:border-[#27272a] p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-[#f5b400] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878] dark:text-[#a1a1aa]">
              Total ITC in Books (Aug)
            </span>
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-lg material-symbols-outlined text-base">
              menu_book
            </span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold mt-2 font-mono tabular-nums">
            ₹{metrics.totalBooksTax.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#747878] dark:text-[#a1a1aa] mt-1 flex items-center justify-between">
            <span>Across 10 Vendor Invoices</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">100% Invoiced</span>
          </div>
        </div>

        {/* GSTR-2B Verified ITC */}
        <div className="bg-white dark:bg-[#1f1f23] border border-[#e3e2e0] dark:border-[#27272a] p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              GSTR-2B Verified ITC
            </span>
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg material-symbols-outlined text-base">
              verified
            </span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold mt-2 text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            ₹{metrics.matchedTax.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#747878] dark:text-[#a1a1aa] mt-1 flex items-center justify-between">
            <span>Eligible for 3B Offset</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {((metrics.matchedTax / metrics.totalBooksTax) * 100).toFixed(1)}% Claimed
            </span>
          </div>
        </div>

        {/* At-Risk Defaulter ITC */}
        <div className="bg-white dark:bg-[#1f1f23] border border-[#e3e2e0] dark:border-[#27272a] p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-rose-500 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              At-Risk ITC (Non-Filing)
            </span>
            <span className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg material-symbols-outlined text-base">
              gpp_maybe
            </span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold mt-2 text-rose-600 dark:text-rose-400 font-mono tabular-nums">
            ₹{metrics.atRiskTax.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#747878] dark:text-[#a1a1aa] mt-1 flex items-center justify-between">
            <span>{metrics.onHoldCount} AP Invoices on Hold</span>
            <span className="font-semibold text-rose-600">Sec 16(2)(aa) Blocked</span>
          </div>
        </div>

        {/* Section 17(5) Blocked ITC */}
        <div className="bg-white dark:bg-[#1f1f23] border border-[#e3e2e0] dark:border-[#27272a] p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-purple-500 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Blocked ITC Sec 17(5)
            </span>
            <span className="p-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-lg material-symbols-outlined text-base">
              no_food
            </span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold mt-2 text-purple-700 dark:text-purple-400 font-mono tabular-nums">
            ₹{metrics.blockedTax.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#747878] dark:text-[#a1a1aa] mt-1 flex items-center justify-between">
            <span>Pantry & F&B Consumables</span>
            <span className="font-semibold text-purple-600">Auto-Reversed</span>
          </div>
        </div>
      </div>

      {/* GSTR-3B Tax Offset Simulator Card */}
      <div className="bg-gradient-to-r from-[#161616] via-[#242427] to-[#161616] text-white p-6 rounded-3xl border-2 border-[#f5b400]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5b400]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f5b400] text-[#161616] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">calculate</span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#f5b400] font-bold">
                Automated Statutory Tax Engine
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-white">
                GSTR-3B Cash Liability Offset Simulator
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-xs text-white/80 font-medium">Full Recovery Simulation:</span>
            <button
              onClick={() => {
                setSimulateAllRecovered(!simulateAllRecovered);
                addToast(
                  !simulateAllRecovered
                    ? 'Simulating 100% vendor GSTR-1 compliance recovery.'
                    : 'Showing live statutory ledger reconciliation.',
                  'info',
                  'Scenario Toggled'
                );
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                simulateAllRecovered ? 'bg-[#f5b400]' : 'bg-gray-600'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-[#161616] transform transition-transform ${
                  simulateAllRecovered ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Calculation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 relative z-10">
          <div>
            <div className="text-xs text-white/60 font-medium">1. Tenant Output GST Collected</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              ₹{metrics.tenantOutputTax.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">18% GST on ₹2.48 Cr MRR (Aug 2026)</div>
          </div>

          <div>
            <div className="text-xs text-white/60 font-medium">2. Less: Verified Vendor ITC (Offset)</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1">
              <span>-₹{metrics.eligibleClaim.toLocaleString('en-IN')}</span>
              {simulateAllRecovered && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                  Simulated
                </span>
              )}
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">
              {simulateAllRecovered
                ? 'Assuming 100% vendor upload compliance'
                : `Matched GSTR-2B credits under Sec 16(2)(aa)`}
            </div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div className="text-xs text-[#f5b400] font-bold uppercase tracking-wider">
              3. Net Cash Outflow to Govt Treasury
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#f5b400] mt-1">
              ₹{metrics.netCashPayable.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-white/70 mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-emerald-400">savings</span>
              <span>Workafella saves ₹{metrics.eligibleClaim.toLocaleString('en-IN')} hard cash</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Way Matching Matrix Section */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Top Controls: Filter Tabs, State Filter & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e3e2e0] dark:border-[#27272a]">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'All', label: `All Invoices (${gstRecords.length})` },
              { id: 'Matched', label: `Matched (${gstRecords.filter((r) => r.status === 'Matched').length})` },
              { id: 'Value Mismatch', label: `Mismatch (${gstRecords.filter((r) => r.status === 'Value Mismatch').length})` },
              { id: 'Missing in 2B', label: `Missing in 2B (${gstRecords.filter((r) => r.status === 'Missing in 2B').length})` },
              { id: 'Blocked / Sec 17(5)', label: `Sec 17(5) (${gstRecords.filter((r) => r.status === 'Blocked / Sec 17(5)').length})` },
              { id: 'Payment On Hold', label: `On Hold (${gstRecords.filter((r) => r.paymentStatus === 'On Hold').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] shadow-sm'
                    : 'bg-[#f4f3f1] dark:bg-[#27272a] text-[#747878] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Secondary Filters: State Dropdown & Search Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f4f3f1] dark:bg-[#27272a] border border-[#e3e2e0] dark:border-[#3f3f46] text-[#161616] dark:text-[#f4f4f5] focus:outline-hidden"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747878] text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search vendor, GSTIN, invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#f4f3f1] dark:bg-[#27272a] border border-[#e3e2e0] dark:border-[#3f3f46] text-[#161616] dark:text-[#f4f4f5] focus:outline-hidden focus:border-[#f5b400]"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e3e2e0] dark:border-[#27272a] text-[#747878] dark:text-[#a1a1aa] uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3">Vendor & Centre</th>
                <th className="py-3 px-3">Invoice & SAC/HSN</th>
                <th className="py-3 px-3 text-right">Tax in Books</th>
                <th className="py-3 px-3 text-right">Tax in 2B</th>
                <th className="py-3 px-3 text-right">Variance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">AP Payment</th>
                <th className="py-3 px-3 text-center">Remediation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e0] dark:divide-[#27272a]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#747878] dark:text-[#a1a1aa]">
                    No reconciliation records match your selected criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isNegativeVariance = r.variance < 0;
                  const isBlocked = r.status === 'Blocked / Sec 17(5)';
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-[#fcfbf9] dark:hover:bg-[#27272a]/40 transition-colors group"
                    >
                      {/* Vendor & Centre */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#161616] dark:text-[#f4f4f5] flex items-center gap-1.5">
                          <span>{r.vendorName}</span>
                        </div>
                        <div className="font-mono text-[10px] text-[#747878] dark:text-[#a1a1aa]">
                          GSTIN: <span className="text-[#161616] dark:text-[#e4e4e7] font-semibold">{r.vendorGstin}</span>
                        </div>
                        <div className="text-[10px] text-[#7b5900] dark:text-[#f5b400] font-medium">
                          {r.centre} ({r.state})
                        </div>
                      </td>

                      {/* Invoice & SAC/HSN */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-bold text-[#161616] dark:text-[#f4f4f5]">
                          {r.invoiceNumber}
                        </div>
                        <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">
                          {r.invoiceDate} • HSN {r.hsnSac}
                        </div>
                        <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">
                          Taxable: ₹{r.taxableValue.toLocaleString('en-IN')} (@{r.gstRate}%)
                        </div>
                      </td>

                      {/* Tax in Books */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-mono font-bold text-[#161616] dark:text-[#f4f4f5]">
                          ₹{r.taxInBooks.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">
                          {r.igstBooks > 0 ? `IGST ₹${r.igstBooks.toLocaleString('en-IN')}` : `C+S ₹${(r.cgstBooks + r.sgstBooks).toLocaleString('en-IN')}`}
                        </div>
                      </td>

                      {/* Tax in 2B */}
                      <td className="py-3.5 px-3 text-right">
                        <div
                          className={`font-mono font-bold ${
                            r.taxIn2B === 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-[#161616] dark:text-[#f4f4f5]'
                          }`}
                        >
                          ₹{r.taxIn2B.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">
                          {r.taxIn2B > 0 ? 'GSTR-1 Filed' : 'Not Uploaded'}
                        </div>
                      </td>

                      {/* Variance */}
                      <td className="py-3.5 px-3 text-right">
                        <div
                          className={`font-mono font-bold ${
                            isNegativeVariance
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {r.variance === 0
                            ? '₹0'
                            : `₹${Math.abs(r.variance).toLocaleString('en-IN')} ${isNegativeVariance ? 'Deficit' : ''}`}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        {getStatusBadge(r.status)}
                      </td>

                      {/* Payment Tranche Toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => toggleVendorPaymentHold(r.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all ${
                            r.paymentStatus === 'On Hold'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {r.paymentStatus === 'On Hold' ? 'lock' : 'lock_open'}
                          </span>
                          <span>{r.paymentStatus}</span>
                        </button>
                      </td>

                      {/* Remediation Action */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Audit Payload Modal */}
                          <button
                            onClick={() => setSelectedAuditRecord(r)}
                            title="Inspect Side-by-Side Payload"
                            className="p-1.5 rounded-lg bg-[#f4f3f1] dark:bg-[#27272a] hover:bg-[#e3e2e0] text-[#161616] dark:text-[#f4f4f5] transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">troubleshoot</span>
                          </button>

                          {/* Notice Action */}
                          {r.status !== 'Matched' && !isBlocked && (
                            <button
                              onClick={() => sendVendorGstNotice(r.id)}
                              title="Send Section 16(2)(aa) Notice"
                              className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-300 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">forward_to_inbox</span>
                            </button>
                          )}

                          {/* Quick Resolve Mismatch Action */}
                          {r.status === 'Value Mismatch' && (
                            <button
                              onClick={() => resolveGstMismatch(r.id, 9000, 'Vendor issued revised debit note DN-2026-09.')}
                              title="Accept Debit Note & Clear Variance"
                              className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-blue-950 dark:text-blue-300 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">task_alt</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Dive Audit Payload Modal */}
      {selectedAuditRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#18181b] border-2 border-[#161616] dark:border-[#3f3f46] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#e3e2e0] dark:border-[#27272a] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#f5b400]/20 text-[#7b5900] dark:text-[#f5b400] flex items-center justify-center">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616] dark:text-[#f4f4f5]">
                    Audit Comparison: {selectedAuditRecord.vendorName}
                  </h3>
                  <div className="text-xs text-[#747878] dark:text-[#a1a1aa]">
                    Record ID: {selectedAuditRecord.id} • Invoice {selectedAuditRecord.invoiceNumber}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAuditRecord(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Side-by-Side Payload Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Internal Books (Purchase Register) */}
              <div className="p-4 rounded-2xl bg-[#f9f8f6] dark:bg-[#27272a]/50 border border-[#e3e2e0] dark:border-[#3f3f46] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#161616] dark:text-white uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm text-blue-600">book</span>
                  <span>ERP Purchase Register</span>
                </div>
                <div className="space-y-1.5 text-xs pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxable Value:</span>
                    <span className="font-mono font-bold">₹{selectedAuditRecord.taxableValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST Rate:</span>
                    <span className="font-mono">{selectedAuditRecord.gstRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CGST + SGST:</span>
                    <span className="font-mono">₹{(selectedAuditRecord.cgstBooks + selectedAuditRecord.sgstBooks).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">IGST:</span>
                    <span className="font-mono">₹{selectedAuditRecord.igstBooks.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-zinc-700">
                    <span className="font-bold">Total Books Tax:</span>
                    <span className="font-mono font-bold text-blue-600">₹{selectedAuditRecord.taxInBooks.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Govt GSTR-2B Feed */}
              <div className="p-4 rounded-2xl bg-[#f9f8f6] dark:bg-[#27272a]/50 border border-[#e3e2e0] dark:border-[#3f3f46] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#161616] dark:text-white uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm text-emerald-600">cloud_done</span>
                  <span>GSTN GSTR-2B Auto-Drafted</span>
                </div>
                <div className="space-y-1.5 text-xs pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Portal Matched Tax:</span>
                    <span className={`font-mono font-bold ${selectedAuditRecord.taxIn2B === 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹{selectedAuditRecord.taxIn2B.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Variance:</span>
                    <span className={`font-mono font-bold ${selectedAuditRecord.variance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹{selectedAuditRecord.variance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Compliance Status:</span>
                    <span>{getStatusBadge(selectedAuditRecord.status)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-zinc-700">
                    <span className="font-bold">AP Payment Status:</span>
                    <span className={`font-bold ${selectedAuditRecord.paymentStatus === 'On Hold' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {selectedAuditRecord.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auditor Notes & Resolution Trail */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">notes</span>
                <span>Statutory Auditor Notes & Statutory Trace</span>
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-200">
                {selectedAuditRecord.notes}
              </p>
              {selectedAuditRecord.lastNoticeSent && (
                <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold pt-1">
                  Last Statutory Notice Sent: {selectedAuditRecord.lastNoticeSent}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  toggleVendorPaymentHold(selectedAuditRecord.id);
                  setSelectedAuditRecord(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  selectedAuditRecord.paymentStatus === 'On Hold'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {selectedAuditRecord.paymentStatus === 'On Hold' ? 'lock_open' : 'lock'}
                </span>
                <span>{selectedAuditRecord.paymentStatus === 'On Hold' ? 'Release AP Payment' : 'Put AP on Hold'}</span>
              </button>

              {selectedAuditRecord.status !== 'Matched' && selectedAuditRecord.status !== 'Blocked / Sec 17(5)' && (
                <button
                  onClick={() => {
                    sendVendorGstNotice(selectedAuditRecord.id);
                    setSelectedAuditRecord(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#161616] text-[#f5b400] hover:bg-[#27272a] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Dispatch Sec 16(2)(aa) Notice</span>
                </button>
              )}

              <button
                onClick={() => setSelectedAuditRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory CA Audit & Tax Settlement Printable Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl border-4 border-[#161616]">
            {/* Header / Brand Lockup for Print */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4">
              <div>
                <div className="font-['Space_Grotesk'] text-2xl font-black tracking-tight text-black flex items-center gap-2">
                  <span>WORKAFELLA WORKSPACE OS</span>
                </div>
                <div className="text-xs font-medium text-gray-600 mt-0.5">
                  Workafella Coworking Spaces Private Limited • CIN: U70109TN2016PTC104523
                </div>
                <div className="text-xs font-mono text-gray-600">
                  Principal GSTIN: 36AABCW9812A1Z4 • Registered State: Telangana
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase font-bold text-gray-500">Statutory Filing Report</div>
                <div className="font-['Space_Grotesk'] font-bold text-lg">GSTR-2B vs Books ITC Audit</div>
                <div className="text-xs text-gray-600">Period: August 2026 (FY 2026-27)</div>
              </div>
            </div>

            {/* Statutory Compliance Executive Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-300 text-xs">
              <div>
                <span className="text-gray-500 block">Total Books ITC:</span>
                <span className="font-mono font-bold text-base">₹{metrics.totalBooksTax.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-gray-500 block">GSTR-2B Verified (Sec 16):</span>
                <span className="font-mono font-bold text-base text-emerald-700">₹{metrics.matchedTax.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-gray-500 block">At-Risk Withheld ITC:</span>
                <span className="font-mono font-bold text-base text-rose-700">₹{metrics.atRiskTax.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Reconciliation Statement Table */}
            <div>
              <h4 className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider mb-2">
                Statutory Itemized Vendor ITC Statement
              </h4>
              <table className="w-full text-left text-xs border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                    <th className="p-2">Vendor Name</th>
                    <th className="p-2">GSTIN</th>
                    <th className="p-2">Invoice #</th>
                    <th className="p-2 text-right">Taxable (₹)</th>
                    <th className="p-2 text-right">Books Tax (₹)</th>
                    <th className="p-2 text-right">2B Tax (₹)</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">AP Hold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gstRecords.map((r) => (
                    <tr key={r.id}>
                      <td className="p-2 font-semibold">{r.vendorName}</td>
                      <td className="p-2 font-mono text-[11px]">{r.vendorGstin}</td>
                      <td className="p-2 font-mono">{r.invoiceNumber}</td>
                      <td className="p-2 text-right font-mono">{r.taxableValue.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-right font-mono font-bold">{r.taxInBooks.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-right font-mono font-bold">{r.taxIn2B.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-center text-[10px] font-bold">{r.status}</td>
                      <td className="p-2 text-center text-[10px] font-bold">{r.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statutory Auditor Sign-off Box */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-gray-300 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-gray-800 uppercase tracking-wider">Statutory Certification:</div>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Certified that the above Input Tax Credit claims comply strictly with Section 16(2)(aa) & Rule 36(4) of the Central Goods and Services Tax Act, 2017. Defaulting vendor tranches have been placed on statutory AP withhold.
                </p>
              </div>

              <div className="text-right space-y-6">
                <div>
                  <div className="font-bold">For M/s Sundaram & Srinivasan LLP</div>
                  <div className="text-[11px] text-gray-500">Chartered Accountants • FRN: 004212S</div>
                </div>
                <div className="border-b border-gray-400 w-48 ml-auto"></div>
                <div className="text-[11px] text-gray-600 font-semibold">
                  Authorized Signatory & Tax Auditor
                </div>
              </div>
            </div>

            {/* Print & Close Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-[#161616] text-[#f5b400] font-['Space_Grotesk'] font-bold text-xs rounded-xl flex items-center gap-2 shadow-md hover:bg-black"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Send to Printer</span>
              </button>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2.5 bg-gray-200 text-gray-800 font-['Space_Grotesk'] font-bold text-xs rounded-xl hover:bg-gray-300"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default GSTReconciliation;
