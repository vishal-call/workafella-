import React, { useState, useEffect } from 'react';
import { useApp, ROLES, CENTRES } from '../context/AppContext';
import { soundFx } from '../utils/audioEffects';
import { ToastContainer } from './ToastContainer';
import { CommandPalette } from './CommandPalette';

export const AppShell = ({ children }) => {
  const {
    currentUser,
    switchRole,
    activeBranch,
    setActiveBranch,
    currentScreen,
    setCurrentScreen,
    isSidebarOpen,
    setIsSidebarOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    isAIChatOpen,
    setIsAIChatOpen,
    isDarkMode,
    setIsDarkMode,
    unreadCount
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K for Spotlight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        soundFx.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsMobileDrawerOpen(false);
        setIsRoleDropdownOpen(false);
        setIsBranchDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation Items per Role
  const getNavItems = () => {
    switch (currentUser.id) {
      case 'super_admin':
        return [
          { id: 'executive_dashboard', label: 'Executive Portfolio', icon: 'monitoring' },
          { id: 'all_centres', label: 'National 11 Flagships', icon: 'corporate_fare' },
          { id: 'revenue_matrix', label: 'Revenue & Occupancy', icon: 'analytics' },
          { id: 'onboarding_wizard', label: '+ Enterprise Onboarding', icon: 'person_add' },
          { id: 'global_config', label: 'Global Configurations', icon: 'tune' }
        ];

      case 'branch_admin':
        return [
          { id: 'branch_dashboard', label: 'Centre Dashboard', icon: 'dashboard' },
          { id: 'floor_plan', label: 'Visual 2D Floorplan', icon: 'floor' },
          { id: 'meeting_rooms', label: 'Meeting Room Schedule', icon: 'calendar_month' },
          { id: 'onboarding_wizard', label: '+ Onboard Client', icon: 'badge' },
          { id: 'visitor_history', label: 'Visitor Clearances', icon: 'id_card' },
          { id: 'access_approvals', label: 'Access Card Approvals', icon: 'key' },
          { id: 'staff_directory', label: 'Branch Staff & Attendance', icon: 'badge' }
        ];

      case 'finance_user':
        return [
          { id: 'billing_dashboard', label: 'Billing & Invoicing', icon: 'receipt_long' },
          { id: 'expense_approvals', label: 'Expense Audit & Approvals', icon: 'rule' },
          { id: 'arrears_tracker', label: 'Credit & Payment Ledger', icon: 'credit_card' }
        ];

      case 'operations_facility':
        return [
          { id: 'tickets', label: 'Incident Service Desk', icon: 'support_agent' },
          { id: 'asset_tracker', label: 'Asset Lifecycle & AMC', icon: 'precision_manufacturing' },
          { id: 'vendor_management', label: 'Vendor Contracts & SLA', icon: 'handshake' },
          { id: 'inventory_tracker', label: 'Consumables Inventory', icon: 'inventory_2' }
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

  const handleNavClick = (screenId) => {
    soundFx.playClick();
    setCurrentScreen(screenId);
    setIsMobileDrawerOpen(false);
  };

  const renderSidebarContent = (isExpanded) => (
    <>
      {/* Top Header & Scope Section */}
      <div className="flex-shrink-0">
        {/* Brand Lockup */}
        <div className={`px-4 mb-5 flex items-center ${isExpanded ? 'justify-between' : 'flex-col gap-3 justify-center'}`}>
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              handleNavClick(currentUser.id === 'super_admin' ? 'executive_dashboard' : 'dashboard');
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
            {isExpanded && (
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

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="hidden md:flex text-[#858383] hover:text-[#f5b400] p-1.5 rounded-xl hover:bg-[#27272a] transition-all items-center justify-center cursor-pointer"
            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <span className="material-symbols-outlined text-lg">
              {isSidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>

          {/* Mobile Drawer Close Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="md:hidden text-[#858383] hover:text-white p-1.5 rounded-xl hover:bg-[#27272a] transition-all flex items-center justify-center cursor-pointer"
            title="Close Menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Branch / Scope Switcher */}
        <div className="px-3 mb-4 relative">
          {isExpanded ? (
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
              className="w-12 h-12 mx-auto flex items-center justify-center rounded-2xl bg-[#202022] border border-[#2e2e32] text-[#f5b400] hover:scale-105 transition-all shadow-sm cursor-pointer"
              title={`Active Centre: ${activeBranch.name}`}
            >
              <span className="material-symbols-outlined text-lg">domain</span>
            </button>
          )}

          {/* Branch Dropdown */}
          {isBranchDropdownOpen && isExpanded && (
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
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex justify-between items-center transition-all my-0.5 cursor-pointer ${
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

      {/* Middle Navigation Section */}
      <div className="flex-1 overflow-y-auto min-h-0 py-2 px-2 space-y-1">
        <nav className="space-y-1">
          {getNavItems().map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center transition-all duration-200 relative group cursor-pointer ${
                  isExpanded
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
                title={!isExpanded ? item.label : undefined}
              >
                {!isExpanded ? (
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
    </>
  );

  return (
    <div className="h-screen w-screen flex bg-[#faf9f7] text-[#1a1c1b] overflow-hidden">
      {/* Mobile Off-Canvas Backdrop */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden animate-fade-in"
        ></div>
      )}

      {/* Mobile Off-Canvas Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#161616] text-[#ffffff] border-r border-[#27272a] z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between py-5 select-none shadow-2xl ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent(true)}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } h-screen max-h-screen bg-[#161616] text-[#ffffff] border-r border-[#27272a] transition-all duration-300 ease-in-out flex-col justify-between py-5 z-30 select-none flex-shrink-0 relative overflow-hidden`}
      >
        {renderSidebarContent(isSidebarOpen)}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#faf9f7]/90 dark:bg-[#0c0d0e]/90 backdrop-blur-xs overflow-hidden relative">
        {/* Frosted Glass Top App Bar - Fully Responsive */}
        <header className="h-16 bg-[#faf9f7]/85 dark:bg-[#121315]/90 backdrop-blur-xl border-b border-[#e3e2e0] dark:border-[#27272a] flex items-center justify-between px-3 sm:px-6 z-20 flex-shrink-0 sticky top-0">
          {/* Left: Mobile Menu Toggle + Live Heartbeat */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsMobileDrawerOpen(true);
              }}
              className="md:hidden p-2 rounded-xl text-[#161616] dark:text-white bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] hover:bg-[#e8e6e3] flex items-center justify-center cursor-pointer"
              title="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            {/* Heartbeat Ticker */}
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e8a5f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1e8a5f]"></span>
              </span>
              <span className="font-bold text-[#161616] dark:text-white truncate max-w-[130px] sm:max-w-none text-xs">
                {activeBranch.name}
              </span>
              <span className="hidden sm:inline-block text-[#747878] dark:text-[#a1a1aa] text-[11px]">
                • 99.98% Telemetry Normal
              </span>
            </div>
          </div>

          {/* Right: Actions, Search, Notifications, Theme, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Global Command Palette Trigger Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden lg:flex items-center justify-between gap-3 px-3 py-1.5 text-xs bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] hover:border-[#f5b400] text-[#747878] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white rounded-xl transition-all w-52 shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#747878] text-sm group-hover:text-[#f5b400]">
                  search
                </span>
                <span>Spotlight (⌘K)...</span>
              </div>
              <kbd className="bg-white dark:bg-[#2d2e33] border border-[#c4c7c7] dark:border-[#3a3b40] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-[#444748] dark:text-white">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Icon Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="lg:hidden p-2 text-[#444748] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white hover:bg-[#f4f3f1] dark:hover:bg-[#202024] rounded-xl transition-colors flex items-center justify-center cursor-pointer"
              title="Search"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>

            {/* Dark Mode Theme Toggle */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsDarkMode(!isDarkMode);
              }}
              className="p-2 text-[#444748] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white hover:bg-[#f4f3f1] dark:hover:bg-[#202024] rounded-xl transition-colors flex items-center justify-center cursor-pointer"
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
              className="relative p-2 text-[#444748] dark:text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white hover:bg-[#f4f3f1] dark:hover:bg-[#202024] rounded-xl transition-colors flex items-center justify-center cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#f5b400] text-[#161616] font-bold text-[9px] flex items-center justify-center rounded-full shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-[#e3e2e0] dark:bg-[#27272a]"></div>

            {/* User Profile & Role Switcher Dropdown */}
            <div className="relative">
              <div
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group bg-[#f4f3f1] dark:bg-[#202024] p-1 sm:p-1.5 sm:pr-3 rounded-full border border-[#e3e2e0] dark:border-[#2e2f33] hover:border-[#f5b400] transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-[#3a3a3a] overflow-hidden flex-shrink-0">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-[#161616] dark:text-white group-hover:text-[#7b5900] dark:group-hover:text-[#f5b400] transition-colors leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa] uppercase font-semibold">
                    {currentUser.roleLabel.split('—')[0].trim()}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#747878] text-sm hidden sm:block">
                  {isRoleDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1a1b1e] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-2xl shadow-2xl z-50 p-2 animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-[#e3e2e0] dark:border-[#2e2f33]">
                    <div className="text-xs font-bold text-[#161616] dark:text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-[#747878] dark:text-[#a1a1aa] truncate">{currentUser.email}</div>
                    <div className="text-[10px] text-[#f5b400] font-bold mt-0.5">{currentUser.roleLabel}</div>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#747878] dark:text-[#a1a1aa] font-bold mt-1">
                    Switch Active Persona
                  </div>

                  {Object.keys(ROLES).map((rKey) => (
                    <button
                      key={rKey}
                      onClick={() => {
                        switchRole(rKey);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors my-0.5 cursor-pointer ${
                        currentUser.id === rKey
                          ? 'bg-[#f5b400] text-[#161616] font-bold'
                          : 'text-[#161616] dark:text-white hover:bg-[#f4f3f1] dark:hover:bg-[#27282d]'
                      }`}
                    >
                      <span className="truncate">{ROLES[rKey].roleLabel.split('—')[0].trim()}</span>
                      {currentUser.id === rKey && (
                        <span className="material-symbols-outlined text-sm">check</span>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-[#e3e2e0] dark:border-[#2e2f33] mt-2 pt-1">
                    <button
                      onClick={() => setCurrentScreen('login')}
                      className="w-full text-left px-3 py-2 text-xs text-[#ba1a1a] dark:text-[#fca5a5] hover:bg-[#ffdad6] dark:hover:bg-[#ef4444]/20 rounded-xl flex items-center gap-2 font-medium cursor-pointer"
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

        {/* Scrollable Canvas with Fluid Responsive Padding */}
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

          <div className="relative z-10 w-full min-h-full">{children}</div>
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
