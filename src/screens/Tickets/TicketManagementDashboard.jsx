import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';
import confetti from 'canvas-confetti';

export const TicketManagementDashboard = () => {
  const { tickets, setTickets, setSelectedTicket, setCurrentScreen, activeBranch, addToast } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [penaltyModalTicket, setPenaltyModalTicket] = useState(null);

  const columns = [
    { id: 'New', label: 'New / Triaged', color: 'border-l-4 border-l-blue-500', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { id: 'Assigned', label: 'Assigned to Staff', color: 'border-l-4 border-l-purple-500', badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { id: 'In Progress', label: 'In Progress / Work In Motion', color: 'border-l-4 border-l-[#f5b400]', badge: 'bg-[#fff4e5] dark:bg-[#f5b400]/20 text-[#c77800] dark:text-[#f5b400]' },
    { id: 'Resolved', label: 'Resolved & Verified', color: 'border-l-4 border-l-[#1e8a5f]', badge: 'bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 text-[#1e8a5f] dark:text-[#4ade80]' }
  ];

  const handleAdvanceStatus = (ticketId, currentStatus) => {
    let nextStatus = 'Assigned';
    if (currentStatus === 'New') nextStatus = 'Assigned';
    else if (currentStatus === 'Assigned') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Resolved';

    if (nextStatus === 'Resolved') {
      soundFx.playChime();
      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#F5B400', '#161616', '#1E8A5F']
        });
      } catch (err) {
        console.log(err);
      }
      addToast(`Ticket #${ticketId} has been successfully resolved & verified!`, 'success', 'SLA Target Achieved');
    } else {
      soundFx.playClick();
      addToast(`Ticket #${ticketId} moved to ${nextStatus}`, 'info', 'Status Updated');
    }

    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    );
  };

  const handleIssuePenaltyCredit = (ticket) => {
    soundFx.playClick();
    addToast(`Issued ₹2,500 SLA breach compensatory credit to ${ticket.company} wallet.`, 'success', 'Credit Memo Dispatched');
    setPenaltyModalTicket(null);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesCategory = filterCategory === 'All' || t.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSlaHealth = (ticket) => {
    if (ticket.status === 'Resolved') return { label: 'Met SLA', color: 'text-[#1e8a5f]', pct: 100, isBreached: false };
    if (ticket.slaDue.includes('30 mins') || ticket.priority === 'Urgent') {
      return { label: 'Critical (< 45m)', color: 'text-[#ef4444]', pct: 85, isBreached: false, penaltyEligible: true };
    }
    return { label: 'Healthy (3h+)', color: 'text-[#1e8a5f]', pct: 35, isBreached: false };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Operations Service Desk • Real-Time SLA Triage
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616] dark:text-white">
            Incident & Maintenance Service Desk
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Live SLA countdowns, automated breach penalty credits, and field technician dispatch at {activeBranch.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
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
              setCurrentScreen('raise_ticket');
            }}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Create Incident</span>
          </button>
        </div>
      </div>

      {/* SLA Health Dashboard Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa]">SLA Compliance</div>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-[#1e8a5f] mt-0.5">97.8%</div>
          <div className="text-[10px] text-[#747878] mt-0.5">Target: 95.0%</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa]">Avg Resolution Time</div>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-0.5">2.2 Hours</div>
          <div className="text-[10px] text-[#1e8a5f] mt-0.5 font-bold">↓ 18m faster this week</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa]">Active Breaches</div>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-[#15803d] mt-0.5">0 Active</div>
          <div className="text-[10px] text-[#747878] mt-0.5">1 Critical at Risk</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa]">Breach Penalty Shield</div>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-[#f5b400] mt-0.5">₹2,500 / hr</div>
          <div className="text-[10px] text-[#747878] mt-0.5">Automated Client Credit</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-3">
        <div className="flex gap-2 text-xs font-semibold overflow-x-auto">
          {['All', 'Wi-Fi', 'HVAC', 'Housekeeping', 'Utilities'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setFilterCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-bold shadow-sm'
                  : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#747878] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white'
              }`}
            >
              {cat}
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
            placeholder="Search tickets, suites, IDs..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] focus:border-[#f5b400] text-xs outline-none rounded-xl text-[#161616] dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const colTickets = filteredTickets.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#f8f7f5] dark:bg-[#121315] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-4 flex flex-col min-h-[540px] shadow-xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e3e2e0] dark:border-[#27272a]">
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] text-xs font-bold text-[#161616] dark:text-white">
                      {col.label}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${col.badge}`}>
                    {colTickets.length}
                  </span>
                </div>

                {/* Ticket Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {colTickets.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#e3e2e0] dark:border-[#27272a] rounded-2xl text-[#858383] text-xs">
                      <span className="material-symbols-outlined text-2xl mb-1 opacity-40">task_alt</span>
                      <span>No incidents in this stage</span>
                    </div>
                  ) : (
                    colTickets.map((t) => {
                      const slaHealth = getSlaHealth(t);

                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            soundFx.playClick();
                            setSelectedTicket(t);
                            setCurrentScreen('ticket_detail');
                          }}
                          className={`bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl p-4 shadow-sm hover:border-[#f5b400] hover:shadow-lg cursor-pointer transition-all space-y-3 luxury-card group ${col.color}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-[#7b5900] dark:text-[#f5b400] bg-[#fffbf2] dark:bg-[#f5b400]/15 px-2 py-0.5 rounded-md border border-[#f5b400]/30">
                              {t.id}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                t.priority === 'Urgent'
                                  ? 'bg-[#ffdad6] dark:bg-[#ef4444]/20 text-[#ba1a1a] dark:text-[#fca5a5] animate-pulse'
                                  : t.priority === 'High'
                                  ? 'bg-[#fff4e5] dark:bg-[#f5b400]/20 text-[#c77800] dark:text-[#f5b400]'
                                  : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#444748] dark:text-[#a1a1aa]'
                              }`}
                            >
                              {t.priority}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-xs text-[#161616] dark:text-white group-hover:text-[#7b5900] dark:group-hover:text-[#f5b400] transition-colors leading-snug">
                              {t.title}
                            </h4>
                            <p className="text-[11px] text-[#747878] dark:text-[#a1a1aa] mt-0.5 truncate">{t.company} • {t.suite}</p>
                          </div>

                          {/* SLA Health Indicator Progress Bar */}
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-[#747878] dark:text-[#a1a1aa] flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs text-[#f5b400]">timer</span>
                                <span>{t.slaDue}</span>
                              </span>
                              <span className={`font-bold ${slaHealth.color}`}>{slaHealth.label}</span>
                            </div>

                            <div className="w-full bg-[#e3e2e0] dark:bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  t.priority === 'Urgent' ? 'bg-[#ef4444]' : 'bg-[#1e8a5f]'
                                }`}
                                style={{ width: `${slaHealth.pct}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Card Footer: Assignee & Action Buttons */}
                          <div className="pt-2 border-t border-[#f4f3f1] dark:border-[#27272a] flex items-center justify-between">
                            <span className="font-bold text-[#161616] dark:text-white bg-[#f4f3f1] dark:bg-[#202024] px-2 py-0.5 rounded-md text-[10px]">
                              👤 {t.assignee.split(' ')[0]}
                            </span>

                            {col.id !== 'Resolved' ? (
                              <div className="flex items-center gap-1.5">
                                {slaHealth.penaltyEligible && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPenaltyModalTicket(t);
                                    }}
                                    className="text-[10px] font-bold text-[#ef4444] bg-[#ffdad6] dark:bg-[#ef4444]/20 px-2 py-1 rounded-lg hover:scale-105 transition-all"
                                    title="SLA Risk: Calculate Penalty Credit"
                                  >
                                    ₹ Credit
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAdvanceStatus(t.id, col.id);
                                  }}
                                  className="text-[10px] font-bold text-[#161616] bg-[#f4f3f1] hover:bg-[#f5b400] hover:text-[#161616] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                  <span>{col.id === 'In Progress' ? 'Resolve ✓' : 'Advance →'}</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-[#1e8a5f] flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">verified</span> Verified
                              </span>
                            )}
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
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Ticket ID</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Title / Category</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Client & Suite</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Priority</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Status</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">SLA Target</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Assignee</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk'] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e0] dark:divide-[#27272a]">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedTicket(t);
                    setCurrentScreen('ticket_detail');
                  }}
                  className="hover:bg-[#f4f3f1] dark:hover:bg-[#202024] cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-mono font-bold text-[#7b5900] dark:text-[#f5b400]">{t.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#161616] dark:text-white">{t.title}</div>
                    <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">{t.category}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-[#161616] dark:text-white">{t.company}</div>
                    <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">{t.suite}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        t.priority === 'Urgent'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : t.priority === 'High'
                          ? 'bg-[#fff4e5] text-[#c77800]'
                          : 'bg-[#f4f3f1] text-[#444748]'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-[#161616] dark:text-white">{t.status}</td>
                  <td className="p-3.5 font-mono text-[#747878] dark:text-[#a1a1aa]">{t.slaDue}</td>
                  <td className="p-3.5 font-medium text-[#161616] dark:text-white">{t.assignee}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        setSelectedTicket(t);
                        setCurrentScreen('ticket_detail');
                      }}
                      className="px-3 py-1 bg-[#161616] text-[#f5b400] text-[10px] font-bold rounded-lg hover:bg-[#f5b400] hover:text-[#161616] transition-colors"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SLA Breach Penalty Credit Memo Modal */}
      {penaltyModalTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setPenaltyModalTicket(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></div>

          <div className="relative bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in-up z-10 text-[#161616] dark:text-white">
            <div className="flex items-center gap-2 text-[#ef4444]">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold">
                SLA Guarantee Compensation Calculator
              </h3>
            </div>

            <p className="text-xs text-[#747878] dark:text-[#a1a1aa] leading-relaxed">
              Ticket <strong>{penaltyModalTicket.id}</strong> ({penaltyModalTicket.title}) has reached critical risk threshold. Under the Workafella Enterprise Service Agreement, the tenant is entitled to a service credit.
            </p>

            <div className="p-4 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Client Beneficiary:</span>
                <strong className="text-[#161616] dark:text-white">{penaltyModalTicket.company}</strong>
              </div>
              <div className="flex justify-between">
                <span>Guaranteed SLA Target:</span>
                <strong className="text-[#161616] dark:text-white">4 Hours (Urgent Tier)</strong>
              </div>
              <div className="flex justify-between border-t border-[#e3e2e0] dark:border-[#27272a] pt-2">
                <span>Calculated Penalty Credit:</span>
                <strong className="text-[#1e8a5f] text-sm font-mono">₹2,500.00</strong>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPenaltyModalTicket(null)}
                className="flex-1 py-2.5 bg-[#f4f3f1] dark:bg-[#242528] text-[#747878] dark:text-[#a1a1aa] font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleIssuePenaltyCredit(penaltyModalTicket)}
                className="flex-1 py-2.5 bg-[#1e8a5f] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#15803d] transition-all"
              >
                Issue ₹2,500 Wallet Credit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
