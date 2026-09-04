import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';
import confetti from 'canvas-confetti';

export const BRANCH_WORKERS = [
  {
    id: 'tech-1',
    name: 'Naveen Kumar',
    designation: 'Enterprise Network & IT Lead',
    specialty: 'Internet / Wi-Fi',
    phone: '+91 98400 67890',
    shift: '10:00 AM - 07:00 PM',
    activeTickets: 1,
    status: 'On-Duty',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tech-2',
    name: 'Suresh Babu',
    designation: 'Chief HVAC & Climate Systems Lead',
    specialty: 'Maintenance & AC',
    phone: '+91 98400 99887',
    shift: '07:00 AM - 04:00 PM',
    activeTickets: 0,
    status: 'On-Duty / Available',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tech-3',
    name: 'Venkat Ramana',
    designation: 'Senior Facility & Power Systems Lead',
    specialty: 'Utilities & Power',
    phone: '+91 98400 33445',
    shift: '08:00 AM - 05:00 PM',
    activeTickets: 2,
    status: 'On-Duty',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tech-4',
    name: 'Chandana Reddy',
    designation: 'Housekeeping & Hospitality Lead',
    specialty: 'Housekeeping',
    phone: '+91 98400 77665',
    shift: '06:30 AM - 03:30 PM',
    activeTickets: 0,
    status: 'On-Duty / Available',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tech-5',
    name: 'Arjun Mehta',
    designation: 'Operations & Facility Manager',
    specialty: 'General Ops',
    phone: '+91 98400 54321',
    shift: '08:30 AM - 05:30 PM',
    activeTickets: 0,
    status: 'On-Duty',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const TicketManagementDashboard = () => {
  const { tickets, setTickets, setSelectedTicket, setCurrentScreen, activeBranch, addToast } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [penaltyModalTicket, setPenaltyModalTicket] = useState(null);
  const [assignModalTicket, setAssignModalTicket] = useState(null);

  const columns = [
    { id: 'New', label: 'New / Triaged', color: 'border-l-4 border-l-blue-500', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { id: 'Assigned', label: 'Assigned to Staff', color: 'border-l-4 border-l-purple-500', badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { id: 'In Progress', label: 'In Progress / Work In Motion', color: 'border-l-4 border-l-[#f5b400]', badge: 'bg-[#fff4e5] dark:bg-[#f5b400]/20 text-[#c77800] dark:text-[#f5b400]' },
    { id: 'Resolved', label: 'Resolved & Verified', color: 'border-l-4 border-l-[#1e8a5f]', badge: 'bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 text-[#1e8a5f] dark:text-[#4ade80]' }
  ];

  const handleAssignWorker = (worker) => {
    soundFx.playChime();
    const updatedStatus = assignModalTicket.status === 'New' ? 'Assigned' : assignModalTicket.status;

    setTickets(
      tickets.map((t) =>
        t.id === assignModalTicket.id
          ? {
              ...t,
              assignee: `${worker.name} (${worker.designation.split(' ')[0]})`,
              status: updatedStatus,
              comments: [
                ...(t.comments || []),
                {
                  author: 'Operations Dispatch',
                  time: 'Just now',
                  text: `Dispatched work-order to ${worker.name} (${worker.designation}). Shift: ${worker.shift}.`
                }
              ]
            }
          : t
      )
    );

    addToast(
      `Assigned ${assignModalTicket.id} to ${worker.name} (${worker.designation})!`,
      'success',
      'Work-Order Dispatched'
    );
    setAssignModalTicket(null);
  };

  const handleAdvanceStatus = (ticketId, currentStatus) => {
    let nextStatus = 'Assigned';
    if (currentStatus === 'New') {
      const targetTick = tickets.find((t) => t.id === ticketId);
      setAssignModalTicket(targetTick);
      return;
    } else if (currentStatus === 'Assigned') {
      nextStatus = 'In Progress';
    } else if (currentStatus === 'In Progress') {
      nextStatus = 'Resolved';
    }

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
      (t.company && t.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.assignee && t.assignee.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getSlaHealth = (ticket) => {
    if (ticket.status === 'Resolved') return { label: 'Met SLA', color: 'text-[#1e8a5f]', pct: 100, isBreached: false };
    if ((ticket.slaDue && ticket.slaDue.includes('30 mins')) || ticket.priority === 'Urgent') {
      return { label: 'Critical (< 45m)', color: 'text-[#ef4444]', pct: 85, isBreached: false, penaltyEligible: true };
    }
    return { label: 'Healthy (3h+)', color: 'text-[#1e8a5f]', pct: 35, isBreached: false };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-5 sm:pb-6">
        <div>
          <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Operations Service Desk • Real-Time SLA Triage
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#161616] dark:text-white">
            Incident & Maintenance Service Desk
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1 leading-relaxed">
            Live SLA countdowns, technician work-order dispatch, and automated breach penalty credits at {activeBranch.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
            className="px-3.5 sm:px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa]">On-Duty Staff</div>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-[#7b5900] dark:text-[#f5b400] mt-0.5">
            {BRANCH_WORKERS.length} Active Leads
          </div>
          <div className="text-[10px] text-[#747878] mt-0.5">Ready for Dispatch</div>
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
            placeholder="Search tickets, suites, workers..."
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
                          <div className="pt-2 border-t border-[#f4f3f1] dark:border-[#27272a] flex items-center justify-between gap-1">
                            {/* Assignee Badge / Assign Trigger */}
                            {col.id === 'New' ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  soundFx.playClick();
                                  setAssignModalTicket(t);
                                }}
                                className="px-2.5 py-1 bg-[#f5b400] hover:bg-[#ffdea4] text-[#161616] font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-xs">person_add</span>
                                <span>Assign Staff</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  soundFx.playClick();
                                  setAssignModalTicket(t);
                                }}
                                title="Click to reassign technician"
                                className="font-bold text-[#161616] dark:text-white bg-[#f4f3f1] dark:bg-[#202024] hover:bg-[#e3e2e0] px-2 py-0.5 rounded-md text-[10px] truncate max-w-[120px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span>👤 {t.assignee ? t.assignee.split(' ')[0] : 'Unassigned'}</span>
                                <span className="material-symbols-outlined text-[10px] opacity-70">sync_alt</span>
                              </button>
                            )}

                            {col.id !== 'Resolved' ? (
                              <div className="flex items-center gap-1">
                                {slaHealth.penaltyEligible && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPenaltyModalTicket(t);
                                    }}
                                    className="text-[10px] font-bold text-[#ef4444] bg-[#ffdad6] dark:bg-[#ef4444]/20 px-1.5 py-1 rounded-lg hover:scale-105 transition-all"
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
                                  className="text-[10px] font-bold text-[#161616] dark:text-white bg-[#f4f3f1] dark:bg-[#202024] hover:bg-[#f5b400] hover:text-[#161616] px-2 py-1 rounded-lg transition-all flex items-center gap-1 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
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
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Assigned Worker</th>
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
                  className="hover:bg-[#f8f7f5] dark:hover:bg-[#202024]/50 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-mono font-bold text-[#7b5900] dark:text-[#f5b400]">{t.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#161616] dark:text-white">{t.title}</div>
                    <div className="text-[11px] text-[#747878]">{t.category}</div>
                  </td>
                  <td className="p-3.5 text-[#444748] dark:text-[#a1a1aa]">{t.company} • {t.suite}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                  <td className="p-3.5">
                    <span className="font-bold text-[11px] text-[#161616] dark:text-white bg-[#f4f3f1] dark:bg-[#202024] px-2.5 py-1 rounded-lg">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-[#ef4444] font-bold">{t.slaDue}</td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        setAssignModalTicket(t);
                      }}
                      className="px-2.5 py-1 bg-[#f4f3f1] dark:bg-[#202024] hover:bg-[#f5b400] hover:text-[#161616] rounded-lg font-bold text-[11px] text-[#161616] dark:text-white inline-flex items-center gap-1 transition-colors"
                    >
                      <span>👤 {t.assignee || 'Unassigned'}</span>
                      <span className="material-symbols-outlined text-xs">edit</span>
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        setSelectedTicket(t);
                        setCurrentScreen('ticket_detail');
                      }}
                      className="px-3 py-1 bg-[#161616] text-[#f5b400] font-bold rounded-lg text-xs hover:bg-[#333]"
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

      {/* MODAL 1: Assign On-Duty Staff / Lead Technician */}
      {assignModalTicket && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-4">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Operations Workforce Dispatch
                </div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-0.5">
                  Assign Lead Technician to #{assignModalTicket.id}
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
                  Incident: <span className="font-bold text-[#161616] dark:text-white">{assignModalTicket.title}</span> • Category: <span className="font-bold text-[#7b5900] dark:text-[#f5b400]">{assignModalTicket.category}</span>
                </p>
              </div>

              <button
                onClick={() => setAssignModalTicket(null)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* On-Duty Workers List */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              <div className="text-xs font-bold text-[#747878] dark:text-[#a1a1aa] uppercase tracking-wider">
                Available On-Duty Staff at {activeBranch.name}:
              </div>

              {BRANCH_WORKERS.map((worker) => {
                const isRecommended =
                  assignModalTicket.category.toLowerCase().includes(worker.specialty.toLowerCase().slice(0, 4)) ||
                  worker.specialty.toLowerCase().includes(assignModalTicket.category.toLowerCase().slice(0, 4));

                return (
                  <div
                    key={worker.id}
                    onClick={() => handleAssignWorker(worker)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between hover:scale-[1.01] ${
                      isRecommended
                        ? 'bg-[#fffdf7] dark:bg-[#232014] border-[#f5b400] ring-1 ring-[#f5b400]'
                        : 'bg-[#f8f7f5] dark:bg-[#1a1b1d] border-[#e3e2e0] dark:border-[#27272a] hover:border-[#f5b400]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-[#e3e2e0] dark:border-[#27272a]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#161616] dark:text-white">{worker.name}</span>
                          {isRecommended && (
                            <span className="text-[10px] font-bold bg-[#f5b400] text-[#161616] px-2 py-0.5 rounded-full">
                              ★ Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-0.5">{worker.designation}</div>
                        <div className="flex items-center gap-3 text-[11px] text-[#444748] dark:text-[#a1a1aa] mt-1 font-mono">
                          <span>⏱️ {worker.shift}</span>
                          <span>•</span>
                          <span className={worker.activeTickets === 0 ? 'text-[#1e8a5f] font-bold' : 'text-[#747878]'}>
                            📋 {worker.activeTickets} Active Task{worker.activeTickets === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-2 bg-[#161616] hover:bg-[#f5b400] text-white hover:text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Assign →
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#e3e2e0] dark:border-[#27272a] flex justify-between items-center text-xs">
              <span className="text-[#747878]">
                ✓ Selected technician will receive immediate work-order dispatch notification.
              </span>
              <button
                type="button"
                onClick={() => setAssignModalTicket(null)}
                className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl text-[#161616] dark:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SLA Penalty Compensation Credit */}
      {penaltyModalTicket && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                  SLA Breach Guarantee Policy
                </span>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-1">
                  Issue Compensatory Credit
                </h3>
              </div>
              <button
                onClick={() => setPenaltyModalTicket(null)}
                className="text-[#747878] hover:text-[#161616] p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-[#444748] dark:text-[#a1a1aa] leading-relaxed">
              Ticket <span className="font-bold text-[#161616] dark:text-white">#{penaltyModalTicket.id}</span> ({penaltyModalTicket.title}) has exceeded its guaranteed 4-hour SLA window for {penaltyModalTicket.company}.
            </p>

            <div className="p-4 bg-[#fff8f7] border border-[#ffdad6] rounded-2xl space-y-1">
              <div className="text-[11px] text-[#747878]">Compensatory Wallet Credit Amount:</div>
              <div className="font-['Space_Grotesk'] font-mono text-3xl font-bold text-[#ba1a1a]">₹2,500.00</div>
              <div className="text-[10px] text-[#747878]">Credited towards next month's invoice deduction</div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPenaltyModalTicket(null)}
                className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold text-xs rounded-xl text-[#161616] dark:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleIssuePenaltyCredit(penaltyModalTicket)}
                className="px-5 py-2 bg-[#ba1a1a] hover:bg-[#931212] text-white font-['Space_Grotesk'] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Deposit ₹2,500 Credit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
