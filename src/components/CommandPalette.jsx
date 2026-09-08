'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp, CENTRES, ROLES } from '../context/AppContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const { setCurrentScreen, setActiveBranch, switchRole, addToast } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global actions catalogue
  const allActions = [
    // Direct Actions
    { id: 'act_book_room', title: 'Book a Meeting Room', category: 'Actions', icon: 'meeting_room', screen: 'book_room' },
    { id: 'act_onboard', title: 'Client Onboarding 5-Step Wizard', category: 'Actions', icon: 'person_add', screen: 'onboarding_wizard' },
    { id: 'act_alloc', title: 'Workspace Allocation Board', category: 'Actions', icon: 'grid_view', screen: 'workspace_allocation' },
    { id: 'act_manage_workspace', title: 'Manage Workspace (Floors, Rooms & Seats)', category: 'Actions', icon: 'domain_add', screen: 'manage_workspace' },
    { id: 'act_ticket', title: 'Raise Incident / Service Ticket', category: 'Actions', icon: 'confirmation_number', screen: 'raise_ticket' },
    { id: 'act_gatepass', title: 'Pre-Register Visitor & QR Pass', category: 'Actions', icon: 'person_pin_circle', screen: 'visitor_pre_reg' },
    { id: 'act_invoices', title: 'Invoices & Billing Reconciliation', category: 'Actions', icon: 'receipt_long', screen: 'invoices' },
    { id: 'act_ai', title: 'AI Insights & Forecast Models', category: 'Actions', icon: 'psychology', screen: 'ai_insights' },
    { id: 'act_reports', title: 'Consolidated Management Reports', category: 'Actions', icon: 'assessment', screen: 'reports' },

    // Role Switching
    ...Object.keys(ROLES).map((rKey) => ({
      id: `role_${rKey}`,
      title: `Switch Persona: ${ROLES[rKey].roleLabel}`,
      category: 'Switch Role',
      icon: 'manage_accounts',
      onSelect: () => {
        switchRole(rKey);
        addToast(`Switched active persona to ${ROLES[rKey].name}`, 'info');
        onClose();
      }
    })),

    // 11 Centres
    ...CENTRES.map((c) => ({
      id: `centre_${c.id}`,
      title: `Jump to Centre: ${c.name} (${c.city})`,
      category: 'Centres',
      icon: 'domain',
      onSelect: () => {
        setActiveBranch(c);
        addToast(`Switched active centre to ${c.name}`, 'info');
        onClose();
      }
    }))
  ];

  const filtered = query.trim() === ''
    ? allActions.slice(0, 8)
    : allActions.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      executeAction(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeAction = (action) => {
    if (action.onSelect) {
      action.onSelect();
    } else if (action.screen) {
      setCurrentScreen(action.screen);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#ffffff] border-2 border-[#161616] rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-[#e3e2e0] flex items-center gap-3 bg-[#faf9f7]">
          <span className="material-symbols-outlined text-[#7b5900] text-2xl">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, centre, role, or action..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm font-medium text-[#161616] outline-none placeholder:text-[#858383]"
          />
          <span className="text-[10px] bg-[#e3e2e0] text-[#444748] px-2 py-0.5 rounded-md font-mono font-bold">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 bg-[#ffffff]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#747878]">
              No commands found for "{query}".
            </div>
          ) : (
            filtered.map((action, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={action.id}
                  onClick={() => executeAction(action)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-4 py-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#161616] text-white shadow-sm'
                      : 'text-[#161616] hover:bg-[#f8f7f5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isSelected ? 'text-[#f5b400]' : 'text-[#747878]'
                      }`}
                    >
                      {action.icon}
                    </span>
                    <div>
                      <div className="font-bold text-xs">{action.title}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-[#2f3130] text-[#f5b400]'
                        : 'bg-[#f4f3f1] text-[#747878]'
                    }`}
                  >
                    {action.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#faf9f7] border-t border-[#e3e2e0] flex items-center justify-between text-[11px] text-[#747878] px-5">
          <div className="flex items-center gap-2">
            <span>Use</span>
            <kbd className="bg-white border border-[#c4c7c7] px-1.5 py-0.5 rounded shadow-xs font-mono font-bold text-[10px]">↑</kbd>
            <kbd className="bg-white border border-[#c4c7c7] px-1.5 py-0.5 rounded shadow-xs font-mono font-bold text-[10px]">↓</kbd>
            <span>to navigate</span>
            <kbd className="bg-white border border-[#c4c7c7] px-1.5 py-0.5 rounded shadow-xs font-mono font-bold text-[10px] ml-2">↵</kbd>
            <span>to select</span>
          </div>
          <span>Workafella Spotlight</span>
        </div>
      </div>
    </div>
  );
};
