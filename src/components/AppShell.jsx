import React, { useState } from 'react';
import { useApp, ROLES, CENTRES, CITIES } from '../context/AppContext';
import { ToastContainer } from './ToastContainer';
import { CommandPalette } from './CommandPalette';
import { ActivityTicker } from './ActivityTicker';
import { soundFx } from '../utils/audioEffects';

export const AppShell = ({ children }) => {
  const {
    currentUser,
    switchRole,
    activeBranch,
    setActiveBranch,
    activeCity,
    setActiveCity,
    currentScreen,
    setCurrentScreen,
    isSidebarOpen,
    setIsSidebarOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    setIsAIChatOpen,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isDarkMode,
    setIsDarkMode
  } = useApp();

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const getNavItems = () => {
    switch (currentUser.id) {
      case 'super_admin':
        return [
          { id: 'executive_dashboard', label: 'Executive Overview', icon: 'monitoring' },
          { id: 'enterprise_ops', label: 'Enterprise Ops', icon: 'domain' },
          { id: 'ai_insights', label: 'AI Insights & Forecasts', icon: 'psychology' },
          { id: 'branch_expenses_analytics', label: 'Expense Analytics', icon: 'donut_large' },
          { id: 'reports', label: 'Consolidated Reports', icon: 'assessment' },
          { id: 'admin_config', label: 'Global Administration', icon: 'admin_panel_settings' }
        ];

      case 'branch_admin':
        return [
          { id: 'dashboard', label: 'Branch Dashboard', icon: 'dashboard' },
          { id: 'onboarding_wizard', label: 'Client Onboarding', icon: 'person_add' },
          { id: 'workspace_allocation', label: 'Workspace Allocation', icon: 'grid_view' },
          { id: 'access_approvals', label: 'Access Requests', icon: 'fingerprint' },
          { id: 'expense_approvals', label: 'Expense Approvals', icon: 'fact_check' },
          { id: 'staff_directory', label: 'Staff Directory', icon: 'badge' },
          { id: 'reports', label: 'Branch Reports', icon: 'assessment' }
        ];

      case 'finance_user':
        return [
          { id: 'invoices', label: 'Invoice Management', icon: 'receipt_long' },
          { id: 'invoice_review', label: 'Invoice Review & Line Items', icon: 'rate_review' },
          { id: 'expense_approvals', label: 'Expense Approvals', icon: 'payments' },
          { id: 'branch_expenses_analytics', label: 'Expense Analytics', icon: 'pie_chart' },
          { id: 'reports', label: 'Financial Reports', icon: 'account_balance' }
        ];

      case 'operations_facility':
        return [
          { id: 'tickets', label: 'Ticket Service Desk', icon: 'support_agent' },
          { id: 'centre_calendar', label: 'Meeting Room Calendar', icon: 'calendar_month' },
          { id: 'visitor_history', label: 'Visitor Logs', icon: 'badge' },
          { id: 'inventory', label: 'Supplies & Inventory', icon: 'inventory_2' },
          { id: 'assets', label: 'Asset Register', icon: 'devices_other' },
          { id: 'vendors', label: 'Vendor Directory', icon: 'storefront' },
          { id: 'log_expense', label: 'Log Branch Expense', icon: 'post_add' }
        ];

      case 'client_admin':
        return [
          { id: 'book_room', label: 'Book a Meeting Room', icon: 'meeting_room' },
          { id: 'client_billing', label: 'Billing & Entitlements', icon: 'account_balance_wallet' },
          { id: 'raise_ticket', label: 'Raise a Support Ticket', icon: 'confirmation_number' },
          { id: 'visitor_pre_reg', label: 'Pre-register Visitor', icon: 'person_pin_circle' },
          { id: 'employee_access', label: 'Employee Access Request', icon: 'sensor_occupied' }
        ];

      case 'security_guard':
        return [
          { id: 'gate_pass', label: 'Gate Pass Execution', icon: 'qr_code_scanner' },
          { id: 'visitor_history', label: 'Today Visitor Log', icon: 'list_alt' }
        ];

      default:
        return [];
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#faf9f7] text-[#1a1c1b] overflow-hidden">
      {/* SideNavBar in Ink (#161616) */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } h-screen max-h-screen bg-[#161616] text-[#ffffff] border-r border-[#27272a] transition-all duration-300 ease-in-out flex flex-col justify-between py-5 z-30 select-none flex-shrink-0 relative overflow-hidden`}
      >
        {/* Top Header & Scope Section */}
        <div className="flex-shrink-0">
          {/* Brand Lockup */}
          <div className={`px-4 mb-5 flex items-center ${isSidebarOpen ? 'justify-between' : 'flex-col gap-3 justify-center'}`}>
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                soundFx.playClick();
                setCurrentScreen(currentUser.id === 'super_admin' ? 'executive_dashboard' : 'dashboard');
              }}
            >
              {/* Rounded triangular cascade logo mark */}
              <div className="w-8 h-8 flex flex-col justify-center gap-[3px] group-hover:scale-110 transition-transform flex-shrink-0">
                <div className="flex gap-[3px]">
                  <div className="w-3.5 h-3.5 bg-[#f5b400] rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                  <div className="w-3.5 h-3.5 bg-[#f5b400] rounded-sm" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
                </div>
                <div className="w-3.5 h-3.5 bg-[#f5b400] ml-3.5 rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
              </div>
              {isSidebarOpen && (
                <div className="animate-fade-in">
                  <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-white block leading-tight">
                    Workafella
                  </span>
                  <span className="text-[9px] tracking-[0.18em] text-[#f5b400] uppercase font-extrabold">
                    Workspace OS
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsSidebarOpen(!isSidebarOpen);
              }}
              className="text-[#858383] hover:text-[#f5b400] p-1.5 rounded-xl hover:bg-[#27272a] transition-all flex items-center justify-center"
              title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <span className="material-symbols-outlined text-lg">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
          </div>

          {/* Branch / Scope Switcher */}
          <div className="px-3 mb-4 relative">
            {isSidebarOpen ? (
              <div
                onClick={() => {
                  soundFx.playClick();
                  setIsBranchDropdownOpen(!isBranchDropdownOpen);
                }}
                className="w-full flex items-center justify-between bg-gradient-to-b from-[#202022] to-[#171718] text-white border border-[#2e2e32] hover:border-[#f5b400]/70 p-3 rounded-2xl transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-[10px] uppercase tracking-widest text-[#f5b400] font-bold">
                    {currentUser.id === 'super_admin' ? 'Enterprise' : 'Active Centre'}
                  </span>
                  <span className="text-xs font-bold text-white truncate group-hover:text-[#f5b400] transition-colors">
                    {currentUser.id === 'super_admin' ? 'All 11 Centres' : activeBranch.name}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#858383] group-hover:text-[#f5b400] text-base transition-colors">
                  {isBranchDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsSidebarOpen(true);
                  setIsBranchDropdownOpen(true);
                }}
                className="w-12 h-12 mx-auto flex items-center justify-center rounded-2xl bg-[#202022] border border-[#2e2e32] text-[#f5b400] hover:scale-105 transition-all shadow-sm"
                title={`Active Centre: ${activeBranch.name}`}
              >
                <span className="material-symbols-outlined text-lg">domain</span>
              </button>
            )}

            {/* Branch Dropdown */}
            {isBranchDropdownOpen && isSidebarOpen && (
              <div className="absolute left-3 right-3 top-full mt-2 bg-[#1c1b1b] border border-[#3a3a3a] rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-1.5 animate-fade-in-up">
                <div className="p-2 text-[10px] uppercase font-bold text-[#858383] border-b border-[#3a3a3a]">
                  Select Workafella Centre
                </div>
                {CENTRES.map((centre) => (
                  <button
                    key={centre.id}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveBranch(centre);
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl flex justify-between items-center transition-all my-0.5 ${
                      activeBranch.id === centre.id
                        ? 'bg-[#f5b400] text-[#161616] font-bold shadow-sm'
                        : 'text-white hover:bg-[#2f3130]'
                    }`}
                  >
                    <span>{centre.name}</span>
                    <span className="text-[10px] opacity-75">{centre.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Navigation Section - Fills available height cleanly */}
        <div className="flex-1 overflow-y-auto min-h-0 py-2 px-2 space-y-1">
          <nav className="space-y-1">
            {getNavItems().map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentScreen(item.id);
                  }}
                  className={`w-full flex items-center transition-all duration-200 relative group cursor-pointer ${
                    isSidebarOpen
                      ? `gap-3 px-3.5 py-2.5 text-left rounded-xl ${
                          isActive
                            ? 'text-[#f5b400] font-bold bg-gradient-to-r from-[#f5b400]/15 via-[#f5b400]/5 to-transparent border-l-4 border-[#f5b400] shadow-sm'
                            : 'text-[#a1a1aa] hover:text-white hover:bg-[#202022] hover:translate-x-1'
                        }`
                      : `justify-center py-2.5 ${
                          isActive
                            ? 'text-[#161616]'
                            : 'text-[#a1a1aa] hover:text-white'
                        }`
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  {!isSidebarOpen ? (
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-[#f5b400] text-[#161616] shadow-lg shadow-[#f5b400]/25 scale-105'
                          : 'hover:bg-[#252528] text-[#a1a1aa] hover:text-white hover:scale-110'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {item.icon}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className={`material-symbols-outlined text-xl transition-colors ${
                        isActive ? 'text-[#f5b400]' : 'text-[#858383] group-hover:text-white'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="text-xs truncate font-medium tracking-wide">
                        {item.label}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Quick Role Switcher (ALWAYS PINNED TO BOTTOM) */}
        <div className="px-3 pt-3 flex-shrink-0 border-t border-[#27272a]/60">
          {isSidebarOpen ? (
            <div className="bg-gradient-to-b from-[#1e1e20] to-[#151516] border border-[#2e2e32] p-3.5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#858383] font-bold mb-2">
                <span>Demo Role Switcher</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b400]"></span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(ROLES).map((rKey) => (
                  <button
                    key={rKey}
                    onClick={() => {
                      soundFx.playClick();
                      switchRole(rKey);
                    }}
                    className={`text-[10px] py-2 px-2 text-center rounded-xl truncate font-bold transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                      currentUser.id === rKey
                        ? 'bg-[#f5b400] text-[#161616] shadow-md shadow-[#f5b400]/20'
                        : 'bg-[#27272a] text-[#dadad8] hover:bg-[#333338] hover:text-white'
                    }`}
                  >
                    {ROLES[rKey].roleLabel.split('—')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                soundFx.playClick();
                setIsSidebarOpen(true);
              }}
              className="w-12 h-12 mx-auto flex items-center justify-center text-[#f5b400] bg-[#202022] hover:bg-[#28282d] border border-[#2e2e32] rounded-2xl transition-all hover:scale-110 shadow-sm"
              title="Open Role Switcher"
            >
              <span className="material-symbols-outlined text-xl">swap_horiz</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#faf9f7]/90 dark:bg-[#0c0d0e]/90 backdrop-blur-xs overflow-hidden relative">
        {/* Frosted Glass Top App Bar */}
        <header className="h-16 bg-[#faf9f7]/85 backdrop-blur-xl border-b border-[#e3e2e0] flex items-center justify-between px-6 z-20 flex-shrink-0 sticky top-0">
          {/* Left: Live Centre Heartbeat & Telemetry Ticker */}
          <div className="flex items-center gap-4">
            <ActivityTicker />
          </div>

          {/* Right: Actions, Command Palette Trigger, Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            {/* Global Command Palette Trigger Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center justify-between gap-3 px-3.5 py-1.5 text-xs bg-[#f4f3f1] border border-[#e3e2e0] hover:border-[#f5b400] hover:bg-white text-[#747878] hover:text-[#161616] rounded-xl transition-all w-60 shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#747878] text-sm group-hover:text-[#f5b400]">
                  search
                </span>
                <span>Spotlight Search...</span>
              </div>
              <kbd className="bg-white border border-[#c4c7c7] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-[#444748]">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Theme Toggle */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsDarkMode(!isDarkMode);
              }}
              className="p-2 text-[#444748] hover:text-[#161616] hover:bg-[#f4f3f1] rounded-xl transition-colors flex items-center justify-center"
              title={isDarkMode ? 'Switch to Luxury Light Mode' : 'Switch to Midnight Obsidian Mode'}
            >
              <span className="material-symbols-outlined text-xl">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsNotificationOpen(true);
              }}
              className="relative p-2 text-[#444748] hover:text-[#161616] hover:bg-[#f4f3f1] rounded-xl transition-colors flex items-center justify-center"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#f5b400] text-[#161616] font-bold text-[9px] flex items-center justify-center rounded-full shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-[#e3e2e0]"></div>

            {/* User Profile & Role Switcher Dropdown */}
            <div className="relative">
              <div
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer group bg-[#f4f3f1] p-1.5 pr-3 rounded-full border border-[#e3e2e0] hover:border-[#f5b400] transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-[#3a3a3a] overflow-hidden flex-shrink-0">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[#161616] group-hover:text-[#7b5900] transition-colors leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#747878] uppercase font-semibold">
                    {currentUser.roleLabel.split('—')[0].trim()}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#747878] text-sm">
                  {isRoleDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#e3e2e0] rounded-2xl shadow-2xl z-50 p-2 animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-[#e3e2e0]">
                    <div className="text-xs font-bold text-[#161616]">{currentUser.name}</div>
                    <div className="text-[11px] text-[#747878]">{currentUser.email}</div>
                    <div className="text-[10px] text-[#f5b400] font-bold mt-0.5">{currentUser.roleLabel}</div>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#747878] font-bold mt-1">
                    Switch Active Persona
                  </div>

                  {Object.keys(ROLES).map((rKey) => (
                    <button
                      key={rKey}
                      onClick={() => {
                        switchRole(rKey);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors my-0.5 ${
                        currentUser.id === rKey
                          ? 'bg-[#f5b400] text-[#161616] font-bold'
                          : 'text-[#161616] hover:bg-[#f4f3f1]'
                      }`}
                    >
                      <span>{ROLES[rKey].roleLabel}</span>
                      {currentUser.id === rKey && (
                        <span className="material-symbols-outlined text-sm">check</span>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-[#e3e2e0] mt-2 pt-1">
                    <button
                      onClick={() => setCurrentScreen('login')}
                      className="w-full text-left px-3 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg flex items-center gap-2 font-medium"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      <span>Logout to Login Screen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Canvas with Ambient Warm Lighting & Architectural Background */}
        <main className="flex-1 overflow-y-auto bg-transparent relative scroll-smooth">
          {/* Persistent Architectural Background Image Layer */}
          <div
            className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 opacity-20 dark:opacity-12"
            style={{ backgroundImage: "url('/bg-main.png')" }}
          ></div>

          {/* Subtle Warm Gold Ambient Gradient */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-40 z-0"
            style={{
              background: 'radial-gradient(circle at top right, rgba(245, 180, 0, 0.12), transparent 70%)'
            }}
          ></div>

          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #f5b400 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          ></div>

          <div className="relative z-10">{children}</div>
        </main>
      </div>

      {/* Global Overlays: Toast Container & Command Palette */}
      <ToastContainer />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};
