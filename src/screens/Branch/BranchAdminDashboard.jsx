import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const BranchAdminDashboard = () => {
  const {
    activeBranch,
    clients,
    accessRequests,
    expenses,
    tickets,
    bookings,
    visitors,
    setCurrentScreen
  } = useApp();

  const branchClients = clients.filter((c) => c.centre === activeBranch.name);
  const pendingAccess = accessRequests.filter((a) => a.status === 'Under Review');
  const pendingExpenses = expenses.filter((e) => e.status === 'Branch Admin Review' || e.status === 'Submitted');
  const openTickets = tickets.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed');

  // Dynamic Occupancy & Seat Calculations
  const branchOccupiedSeats = branchClients.reduce((acc, c) => acc + (c.seats || 0), 0);
  const totalBranchCapacity = activeBranch.seats || 480;
  const branchOccupancyPercent = Math.min(
    100,
    Math.round((branchOccupiedSeats / totalBranchCapacity) * 100) || activeBranch.occupancy
  );

  const kpis = [
    {
      label: 'Centre Occupancy',
      value: `${branchOccupancyPercent}%`,
      sub: `${branchOccupiedSeats} / ${totalBranchCapacity} Desks Occupied`,
      icon: 'chair'
    },
    {
      label: 'Active Enterprise Orgs',
      value: `${branchClients.length}`,
      sub: `Tenants at ${activeBranch.name}`,
      icon: 'business'
    },
    {
      label: 'Open Service Tickets',
      value: `${openTickets.length}`,
      sub: '1 Urgent Escalation',
      icon: 'support_agent',
      alert: true
    },
    {
      label: 'Pending Approvals',
      value: `${pendingAccess.length + pendingExpenses.length}`,
      sub: 'Access & Expenses',
      icon: 'pending_actions',
      alert: true
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Local Branch Terminal • {activeBranch.city}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            {activeBranch.name} Command Center
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Centre Overview: {activeBranch.city} • {activeBranch.floors} Floors • {activeBranch.rooms} Rooms • {activeBranch.seats} Total Seats
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentScreen('workspace_allocation');
            }}
            className="px-4 py-2 bg-white border border-[#3a3a3a] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#f4f3f1] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
            <span>Allocation Board</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentScreen('onboarding_wizard');
            }}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ Onboard Client</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#e3e2e0] p-6 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md hover:border-[#f5b400] transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#747878]">
                {kpi.label}
              </span>
              <span className={`material-symbols-outlined text-lg ${kpi.alert ? 'text-[#c4432b]' : 'text-[#7b5900]'}`}>
                {kpi.icon}
              </span>
            </div>
            <div className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
              {kpi.value}
            </div>
            <div className="text-xs text-[#747878] mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Active Branch Enterprise Tenants Section */}
      <div className="bg-white border border-[#e3e2e0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e3e2e0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f5b400]">business</span>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
                Active Enterprise Tenants at {activeBranch.name}
              </h3>
            </div>
            <p className="text-xs text-[#747878]">
              Contracted client organizations operating at this physical centre ({branchClients.length} Organizations).
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentScreen('onboarding_wizard');
            }}
            className="px-3.5 py-1.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Onboard New Tenant</span>
          </button>
        </div>

        {branchClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-[#e3e2e0] text-[#747878] uppercase text-[10px] tracking-wider bg-[#faf9f7]">
                  <th className="p-3 font-bold">Client Entity</th>
                  <th className="p-3 font-bold">Suites & Wings</th>
                  <th className="p-3 font-bold">Desks Committed</th>
                  <th className="p-3 font-bold">Monthly Rent (MRR)</th>
                  <th className="p-3 font-bold">Primary Admin</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f3f1]">
                {branchClients.map((client) => {
                  const mrr = (client.seats || 20) * (client.ratePerSeat || 15000);
                  return (
                    <tr key={client.id} className="hover:bg-[#f8f7f5] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-sm text-[#161616]">{client.name}</div>
                        <div className="text-[11px] text-[#747878]">{client.legalEntity || client.name}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-[#161616]">
                          {Array.isArray(client.rooms) ? client.rooms.map(r => `Suite ${r}`).join(', ') : 'Dedicated Wing'}
                        </div>
                        <div className="text-[10px] text-[#747878]">Floor 6 & 7</div>
                      </td>

                      <td className="p-3">
                        <span className="font-['Space_Grotesk'] font-bold text-sm text-[#1e8a5f] bg-[#e7f5ed] px-2.5 py-0.5 rounded-md">
                          {client.seats} Desks
                        </span>
                      </td>

                      <td className="p-3 font-mono font-bold text-[#161616]">
                        ₹{mrr.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-[#747878] font-normal">/mo</span>
                      </td>

                      <td className="p-3 text-[11px] text-[#444748]">
                        <div className="font-medium">{client.adminName || 'Corporate Admin'}</div>
                        <div className="text-[#747878]">{client.adminEmail || 'admin@client.com'}</div>
                      </td>

                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e7f5ed] text-[#1e8a5f]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{client.status || 'Active'}</span>
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            setCurrentScreen('workspace_allocation');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold bg-[#f4f3f1] hover:bg-[#f5b400] text-[#161616] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Allocation</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-[#faf9f7] rounded-2xl border border-dashed border-[#e3e2e0] space-y-2">
            <span className="material-symbols-outlined text-3xl text-[#747878]">domain_disabled</span>
            <div className="font-bold text-sm text-[#161616]">No active clients onboarded at {activeBranch.name} yet</div>
            <p className="text-xs text-[#747878]">Click the button below to onboard the first enterprise client to this branch.</p>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentScreen('onboarding_wizard');
              }}
              className="mt-2 px-4 py-2 bg-[#f5b400] text-[#161616] font-bold text-xs rounded-xl inline-flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Onboard First Client</span>
            </button>
          </div>
        )}
      </div>

      {/* Two Column Layout: Actionable Queue & Live Centre Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Actionable Approval Queue */}
        <div className="lg:col-span-6 bg-white border border-[#e3e2e0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e3e2e0]">
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
                Actionable Approval Queue
              </h3>
              <p className="text-xs text-[#747878]">Review client employee access requests and branch operational expenses</p>
            </div>
            <span className="text-xs font-bold text-[#161616] bg-[#f5b400] px-2.5 py-0.5 rounded-full">
              {pendingAccess.length + pendingExpenses.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {/* Access Requests */}
            {pendingAccess.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] rounded-xl flex items-center justify-between hover:border-[#f5b400] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7b5900] text-base">badge</span>
                    <span className="font-bold text-xs text-[#161616]">{req.employeeName}</span>
                    <span className="text-[10px] bg-[#fff4e5] text-[#7b5900] px-2 py-0.5 rounded-full font-bold">Biometric Access</span>
                  </div>
                  <div className="text-xs text-[#747878] mt-0.5 pl-6">
                    {req.company} • {req.floorRoom}
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentScreen('access_approvals');
                  }}
                  className="px-3 py-1.5 bg-[#161616] text-[#f5b400] text-xs font-bold hover:bg-[#2f3130] rounded-lg transition-colors cursor-pointer"
                >
                  Review
                </button>
              </div>
            ))}

            {/* Expense Requests */}
            {pendingExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] rounded-xl flex items-center justify-between hover:border-[#f5b400] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c77800] text-base">receipt_long</span>
                    <span className="font-bold text-xs text-[#161616]">{exp.subcategory}</span>
                    <span className="text-[10px] font-mono font-bold text-[#161616]">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-xs text-[#747878] mt-0.5 pl-6">
                    Submitted by: {exp.submittedBy} • {exp.category}
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentScreen('expense_approvals');
                  }}
                  className="px-3 py-1.5 bg-[#f5b400] text-[#161616] text-xs font-bold hover:bg-[#ffdea4] rounded-lg transition-colors cursor-pointer"
                >
                  Sign Off
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Centre Stream */}
        <div className="lg:col-span-6 bg-white border border-[#e3e2e0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e3e2e0]">
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
                Today at {activeBranch.name}
              </h3>
              <p className="text-xs text-[#747878]">Live stream of room bookings, visitors and tickets</p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentScreen('centre_calendar');
              }}
              className="text-xs text-[#7b5900] font-bold hover:underline cursor-pointer"
            >
              Room Calendar →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="p-3 bg-[#f8f7f5] border border-[#e3e2e0] rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1e8a5f]"></div>
                  <div>
                    <div className="font-bold text-[#161616]">{b.room}</div>
                    <div className="text-[#747878] text-[11px]">{b.client} • {b.timeSlot}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#1e8a5f] bg-[#e7f5ed] px-2 py-0.5 rounded-full">
                  Confirmed
                </span>
              </div>
            ))}

            {visitors.slice(0, 2).map((v) => (
              <div key={v.id} className="p-3 bg-[#f8f7f5] border border-[#e3e2e0] rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#f5b400]"></div>
                  <div>
                    <div className="font-bold text-[#161616]">{v.name} (Visitor)</div>
                    <div className="text-[#747878] text-[11px]">Host: {v.host} • {v.timeSlot}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#7b5900] bg-[#fff4e5] px-2 py-0.5 rounded-full">
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
