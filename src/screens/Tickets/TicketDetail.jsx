import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';
import { BRANCH_WORKERS } from './TicketManagementDashboard';

export const TicketDetail = () => {
  const { tickets, setTickets, setSelectedTicket, setCurrentScreen, currentUser, activeBranch, addToast } = useApp();
  const activeTicket = tickets[0] || {
    id: 'TICK-8021',
    title: 'Dedicated Leased-Line Fiber Latency Spike',
    category: 'Internet / Wi-Fi',
    priority: 'Urgent',
    status: 'In Progress',
    company: 'Acme Innovations Pvt Ltd',
    suite: 'Suite 705',
    createdAt: 'Today, 09:15 AM',
    slaDue: '30 mins remaining',
    assignee: 'Naveen Kumar (Network Ops)',
    description: 'Packet drop observed on primary Cisco SFP+ gateway interface. Latency exceeds 180ms during heavy video calls.',
    comments: [
      { author: 'Naveen Kumar', time: '09:30 AM', text: 'Dispatched to Floor 7 Server Room rack 2 with OTDR fiber tester.' }
    ]
  };

  const [commentText, setCommentText] = useState('');
  const [csatRating, setCsatRating] = useState(5);
  const [hasRated, setHasRated] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Field Technician Work-Order Checklist State
  const [techChecklist, setTechChecklist] = useState([
    { id: 1, text: 'Run OTDR diagnostic ping test on primary SFP+ port', done: true },
    { id: 2, text: 'Replace patch cord and clean optical fiber connectors', done: true },
    { id: 3, text: 'Perform 1 Gbps full load throughput & jitter speedtest', done: false },
    { id: 4, text: 'Upload verified before & after telemetry screenshot', done: false }
  ]);

  const completedSteps = techChecklist.filter((c) => c.done).length;
  const progressPct = Math.round((completedSteps / techChecklist.length) * 100);

  const toggleChecklist = (id) => {
    soundFx.playClick();
    const updated = techChecklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c));
    setTechChecklist(updated);
    addToast(`Technician diagnostic step updated (${updated.filter(c => c.done).length}/${techChecklist.length})`, 'info');
  };

  const handleStatusChange = (newStatus) => {
    soundFx.playClick();
    setTickets(tickets.map((t) => (t.id === activeTicket.id ? { ...t, status: newStatus } : t)));
    addToast(`Ticket status updated to ${newStatus}`, 'success');
  };

  const handleAssignWorker = (worker) => {
    soundFx.playChime();
    setTickets(
      tickets.map((t) =>
        t.id === activeTicket.id
          ? {
              ...t,
              assignee: `${worker.name} (${worker.designation.split(' ')[0]})`,
              status: t.status === 'New' ? 'Assigned' : t.status,
              comments: [
                ...(t.comments || []),
                {
                  author: 'Operations Lead',
                  time: 'Just now',
                  text: `Reassigned ticket to ${worker.name} (${worker.designation}). Shift: ${worker.shift}.`
                }
              ]
            }
          : t
      )
    );
    addToast(`Assigned ${activeTicket.id} to ${worker.name} (${worker.designation})`, 'success');
    setIsAssignModalOpen(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    soundFx.playClick();
    const newComment = {
      author: currentUser.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: commentText
    };

    setTickets(
      tickets.map((t) =>
        t.id === activeTicket.id ? { ...t, comments: [...(t.comments || []), newComment] } : t
      )
    );
    setCommentText('');
    addToast('Comment added to service thread', 'info');
  };

  const handleSubmitCsat = () => {
    soundFx.playChime();
    setHasRated(true);
    addToast(`Thank you! Recorded a ${csatRating}-star CSAT rating.`, 'success', 'Feedback Submitted');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Service Desk Incident Record • Work-Order #{activeTicket.id}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616] dark:text-white">
            {activeTicket.id}: {activeTicket.title}
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Client: {activeTicket.company || activeTicket.client} • Category: {activeTicket.category} • Created: {activeTicket.createdAt}
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setCurrentScreen('tickets');
          }}
          className="text-xs text-[#747878] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white font-semibold flex items-center gap-1 cursor-pointer bg-white dark:bg-[#1f2023] px-3.5 py-2 rounded-xl border border-[#e3e2e0] dark:border-[#2e2f33] shadow-xs"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Kanban Backlog</span>
        </button>
      </div>

      {/* Two Column Layout: Thread & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Description, Technician Checklist & Activity Thread */}
        <div className="lg:col-span-8 space-y-6">
          {/* Issue Description Card */}
          <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#161616] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f5b400]">description</span>
              <span>Problem Statement & Diagnostics</span>
            </h3>

            <p className="text-xs text-[#444748] dark:text-[#d4d4d8] leading-relaxed bg-[#f8f7f5] dark:bg-[#1a1b1d] p-4 rounded-2xl border border-[#e3e2e0] dark:border-[#2e2f33]">
              {activeTicket.description}
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#161616] dark:text-white block mb-2">
                Attached Diagnostics & Network Trace:
              </span>
              <div className="flex gap-2.5 flex-wrap">
                <div className="flex items-center gap-2 p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl text-xs font-semibold text-[#161616] dark:text-white shadow-2xs">
                  <span className="material-symbols-outlined text-[#f5b400] text-base">attachment</span>
                  <span>gateway_ping_trace_aug30.pdf</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl text-xs font-semibold text-[#161616] dark:text-white shadow-2xs">
                  <span className="material-symbols-outlined text-[#f5b400] text-base">image</span>
                  <span>rack_sfp_fiber_port7.jpg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Field Technician Diagnostic Checklist */}
          <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#e3e2e0] dark:border-[#27272a]">
              <div>
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#161616] dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f5b400]">checklist</span>
                  <span>Field Technician Work-Order Protocol</span>
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-0.5">
                  Assigned Worker: <span className="font-bold text-[#161616] dark:text-white">{activeTicket.assignee}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#1e8a5f] bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 px-2.5 py-1 rounded-full">
                  {progressPct}% Complete
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#e3e2e0] dark:bg-[#27272a] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f5b400] transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5 pt-2">
              {techChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.done
                      ? 'bg-[#f0fdf4] dark:bg-[#14231b] border-[#22c55e]/50 text-[#15803d] dark:text-[#4ade80]'
                      : 'bg-[#f8f7f5] dark:bg-[#1a1b1d] border-[#e3e2e0] dark:border-[#2e2f33] text-[#444748] dark:text-[#d4d4d8] hover:border-[#f5b400]'
                  }`}
                >
                  <span className={`text-xs font-semibold ${item.done ? 'line-through opacity-80' : ''}`}>
                    {item.text}
                  </span>
                  <span className="material-symbols-outlined text-lg text-[#f5b400]">
                    {item.done ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Thread */}
          <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#161616] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f5b400]">forum</span>
              <span>Activity & Resolution Thread ({(activeTicket.comments || []).length})</span>
            </h3>

            <div className="space-y-3">
              {(activeTicket.comments || []).map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-2xl text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#161616] dark:text-white">{c.author}</span>
                    <span className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">{c.time}</span>
                  </div>
                  <p className="text-xs text-[#444748] dark:text-[#d4d4d8] leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="pt-2 space-y-2">
              <textarea
                rows={3}
                placeholder="Log internal note or dispatch update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-3.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] focus:border-[#f5b400] text-xs outline-none rounded-2xl text-[#161616] dark:text-white"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-bold text-xs rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
                >
                  Post Diagnostic Update
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Assignee Card, Status, SLA Timer & CSAT Rating */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assigned Technician Card */}
          <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#161616] dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#f5b400] text-base">engineering</span>
                <span>Assigned Lead Technician</span>
              </h4>
              <span className="text-[10px] font-bold bg-[#e7f5ed] text-[#1e8a5f] px-2 py-0.5 rounded-full">
                Active On-Duty
              </span>
            </div>

            <div className="p-3.5 bg-[#f8f7f5] dark:bg-[#1a1b1d] rounded-2xl border border-[#e3e2e0] dark:border-[#2e2f33] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5b400] text-[#161616] flex items-center justify-center font-bold text-base">
                👤
              </div>
              <div className="flex-1">
                <div className="font-bold text-xs text-[#161616] dark:text-white">
                  {activeTicket.assignee || 'Unassigned Staff'}
                </div>
                <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa] mt-0.5">
                  Assigned at {activeBranch.name}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsAssignModalOpen(true);
              }}
              className="w-full py-2.5 bg-[#161616] hover:bg-[#f5b400] text-white hover:text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>Reassign / Change Worker</span>
            </button>
          </div>

          {/* Quick Status Box */}
          <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#161616] dark:text-white">
              Lifecycle Stage
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {['New', 'Assigned', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTicket.status === st
                      ? 'bg-[#f5b400] text-[#161616] shadow-sm'
                      : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#747878] dark:text-[#a1a1aa] hover:text-black dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e3e2e0] dark:border-[#27272a] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#747878] dark:text-[#a1a1aa]">SLA Countdown:</span>
                <span className="font-mono font-bold text-[#ef4444] animate-pulse">
                  {activeTicket.slaDue || '30 mins remaining'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#747878] dark:text-[#a1a1aa]">Priority Tier:</span>
                <span className="font-bold text-[#ba1a1a] bg-[#ffdad6] dark:bg-[#ef4444]/20 px-2 py-0.5 rounded-md">
                  {activeTicket.priority} (4h Max)
                </span>
              </div>
            </div>
          </div>

          {/* CSAT Client Satisfaction Card */}
          <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#161616] dark:text-white">
              Client CSAT Feedback
            </h4>

            {!hasRated ? (
              <div className="space-y-3">
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa]">
                  Rate the speed and resolution quality of this maintenance request:
                </p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCsatRating(star)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all cursor-pointer ${
                        csatRating >= star
                          ? 'bg-[#f5b400] text-[#161616] shadow-sm scale-105'
                          : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#747878]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitCsat}
                  className="w-full py-2 bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-bold text-xs rounded-xl shadow-sm hover:scale-102 transition-all cursor-pointer"
                >
                  Submit {csatRating}-Star CSAT
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 border border-[#1e8a5f]/30 rounded-2xl text-center space-y-1">
                <span className="material-symbols-outlined text-[#1e8a5f] text-2xl">verified</span>
                <div className="text-xs font-bold text-[#1e8a5f] dark:text-[#4ade80]">
                  {csatRating}-Star Rating Logged
                </div>
                <p className="text-[10px] text-[#747878] dark:text-[#a1a1aa]">
                  Thank you for verifying work-order resolution.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Reassign Worker */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-4">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Operations Workforce Dispatch
                </div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-0.5">
                  Assign Lead Technician to #{activeTicket.id}
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
                  Category: <span className="font-bold text-[#7b5900] dark:text-[#f5b400]">{activeTicket.category}</span>
                </p>
              </div>

              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* On-Duty Workers List */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {BRANCH_WORKERS.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => handleAssignWorker(worker)}
                  className="p-4 rounded-2xl border bg-[#f8f7f5] dark:bg-[#1a1b1d] border-[#e3e2e0] dark:border-[#27272a] hover:border-[#f5b400] transition-all cursor-pointer flex items-center justify-between hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#e3e2e0] dark:border-[#27272a]"
                    />
                    <div>
                      <div className="font-bold text-sm text-[#161616] dark:text-white">{worker.name}</div>
                      <div className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-0.5">{worker.designation}</div>
                      <div className="flex items-center gap-3 text-[11px] text-[#444748] dark:text-[#a1a1aa] mt-1 font-mono">
                        <span>⏱️ {worker.shift}</span>
                        <span>•</span>
                        <span className="text-[#1e8a5f] font-bold">🟢 {worker.status}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 bg-[#161616] hover:bg-[#f5b400] text-white hover:text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Select →
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e3e2e0] dark:border-[#27272a] flex justify-end">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl text-xs text-[#161616] dark:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
