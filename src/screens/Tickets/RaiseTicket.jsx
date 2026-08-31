import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const RaiseTicket = () => {
  const { tickets, setTickets, currentUser, setCurrentScreen, addToast } = useApp();

  const [category, setCategory] = useState('Internet / Wi-Fi');
  const [priority, setPriority] = useState('Urgent');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suiteLocation, setSuiteLocation] = useState('Suite 705 (Floor 7)');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);

  const categories = [
    { name: 'Internet / Wi-Fi', icon: 'wifi' },
    { name: 'Housekeeping', icon: 'cleaning_services' },
    { name: 'Maintenance & AC', icon: 'hvac' },
    { name: 'Utilities & Power', icon: 'bolt' },
    { name: 'Pantry & Coffee', icon: 'coffee' },
    { name: 'Access / Biometrics', icon: 'fingerprint' }
  ];

  const priorities = [
    { label: 'Low', time: '24h SLA', color: 'bg-[#f4f3f1] dark:bg-[#202024] text-[#444748] dark:text-[#a1a1aa]' },
    { label: 'Medium', time: '12h SLA', color: 'bg-[#fff4e5] dark:bg-[#f5b400]/20 text-[#c77800] dark:text-[#f5b400]' },
    { label: 'High', time: '6h SLA', color: 'bg-[#ffdad6] dark:bg-[#ef4444]/20 text-[#ba1a1a] dark:text-[#fca5a5]' },
    { label: 'Urgent', time: '4h SLA (Penalty Shield)', color: 'bg-[#ba1a1a] text-white' }
  ];

  const handleRecordVoice = () => {
    soundFx.playClick();
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecordedAudio(true);
      addToast('12-second voice incident memo recorded & transcribed', 'success');
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.playClick();

    const newTick = {
      id: `TICK-${Math.floor(8000 + Math.random() * 1000)}`,
      company: currentUser.name.includes('Acme') ? 'Acme Innovations Pvt Ltd' : currentUser.name,
      title: title || `${category} Service Request`,
      category,
      priority,
      suite: suiteLocation,
      status: 'New',
      assignee: 'Triage Lead (Naveen K.)',
      createdAt: 'Just now',
      slaDue: priority === 'Urgent' ? '4 Hours from now' : '12 Hours from now',
      description: description || 'Routine service desk maintenance request submitted via client terminal.',
      comments: [
        { author: currentUser.name, time: 'Just now', text: description || 'Ticket registered.' }
      ]
    };

    setTickets([newTick, ...tickets]);
    addToast('Incident ticket dispatched to central operations triage queue!', 'success', 'Ticket Dispatched');
    setTimeout(() => {
      setCurrentScreen('tickets');
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Service Desk & Facilities
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616] dark:text-white">
            Raise an Incident Support Ticket
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Submit facility, network, or housekeeping incidents with tracked SLA resolution commitments and penalty compensation protection.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setCurrentScreen('tickets');
          }}
          className="text-xs text-[#747878] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white font-semibold flex items-center gap-1 bg-white dark:bg-[#1f2023] px-3.5 py-2 rounded-xl border border-[#e3e2e0] dark:border-[#2e2f33] shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">view_kanban</span>
          <span>View Ticket Backlog</span>
        </button>
      </div>

      {/* Ticket Form */}
      <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-8 shadow-sm relative">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Category Icon-Tile Picker */}
          <div>
            <label className="block font-bold text-[#161616] dark:text-white mb-2 uppercase tracking-wider text-[11px]">
              1. Select Service Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((c) => {
                const isSelected = category === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setCategory(c.name);
                    }}
                    className={`p-3.5 border rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#f5b400] bg-[#fffbf2] dark:bg-[#f5b400]/15 shadow-sm font-bold text-[#161616] dark:text-white'
                        : 'border-[#e3e2e0] dark:border-[#2e2f33] bg-[#f8f7f5] dark:bg-[#1a1b1d] text-[#444748] dark:text-[#d4d4d8] hover:border-[#f5b400]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${isSelected ? 'text-[#f5b400]' : 'text-[#747878] dark:text-[#a1a1aa]'}`}>
                      {c.icon}
                    </span>
                    <span className="text-xs truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Pill Selector */}
          <div>
            <label className="block font-bold text-[#161616] dark:text-white mb-2 uppercase tracking-wider text-[11px]">
              2. Severity & SLA Commitment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {priorities.map((p) => {
                const isSelected = priority === p.label;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setPriority(p.label);
                    }}
                    className={`p-3 text-xs font-bold rounded-2xl transition-all border text-left cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#161616] dark:border-[#f5b400] shadow-sm ' + p.color
                        : 'border-[#e3e2e0] dark:border-[#2e2f33] bg-[#f8f7f5] dark:bg-[#1a1b1d] text-[#747878] dark:text-[#a1a1aa]'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{p.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{p.time}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-[#161616] dark:text-white mb-1">
                Incident Title / Summary
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fiber latency spike on secondary port"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] focus:border-[#f5b400] outline-none rounded-xl text-[#161616] dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] dark:text-white mb-1">
                Impacted Suite / Location
              </label>
              <input
                type="text"
                required
                value={suiteLocation}
                onChange={(e) => setSuiteLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] focus:border-[#f5b400] outline-none rounded-xl text-[#161616] dark:text-white"
              />
            </div>
          </div>

          {/* Description & Voice Memo */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-bold text-[#161616] dark:text-white">
                Detailed Problem Symptoms
              </label>
              <button
                type="button"
                onClick={handleRecordVoice}
                className="text-[10px] font-bold text-[#f5b400] bg-[#161616] px-2.5 py-1 rounded-lg flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">
                  {isRecording ? 'graphic_eq' : 'mic'}
                </span>
                <span>{isRecording ? 'Listening...' : hasRecordedAudio ? 'Re-record Voice Memo' : '+ Attach Voice Memo'}</span>
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="Describe symptoms, error codes, or equipment behaviors..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] focus:border-[#f5b400] outline-none rounded-xl text-[#161616] dark:text-white"
            ></textarea>

            {hasRecordedAudio && (
              <div className="mt-2 p-2.5 bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 border border-[#1e8a5f]/30 rounded-xl flex items-center justify-between text-xs text-[#1e8a5f] dark:text-[#4ade80]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">audiotrack</span>
                  <span className="font-semibold">voice_incident_memo_aug30.wav (0:12)</span>
                </div>
                <span className="text-[10px] font-mono font-bold">Auto-Transcribed ✓</span>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-[#e3e2e0] dark:border-[#27272a] flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Dispatch Incident to Triage Desk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
