import React, { useState } from 'react';
import { useApp, CENTRES } from '../../context/AppContext';
import { Sparkline } from '../../components/Sparkline';
import { soundFx } from '../../utils/audioEffects';

export const SuperAdminDashboard = () => {
  const { clients, setCurrentScreen, setActiveBranch } = useApp();
  const [activeKpiIndex, setActiveKpiIndex] = useState(0);
  const [clientFilterCentre, setClientFilterCentre] = useState('All Centres');
  const [clientSearch, setClientSearch] = useState('');

  const totalSeats = CENTRES.reduce((acc, c) => acc + c.seats, 0);
  const totalOccupiedSeats = CENTRES.reduce(
    (acc, c) => acc + Math.round((c.seats * c.occupancy) / 100),
    0
  );
  const avgOccupancy = Math.round((totalOccupiedSeats / totalSeats) * 100);

  const filteredClients = clients.filter((c) => {
    const matchesCentre = clientFilterCentre === 'All Centres' || c.centre === clientFilterCentre;
    const matchesSearch =
      !clientSearch ||
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      (c.legalEntity && c.legalEntity.toLowerCase().includes(clientSearch.toLowerCase())) ||
      (c.centre && c.centre.toLowerCase().includes(clientSearch.toLowerCase()));
    return matchesCentre && matchesSearch;
  });

  const kpis = [
    {
      id: 'rev',
      label: 'Network Total Revenue (MTD)',
      shortLabel: 'Total Revenue',
      value: '₹4.82 Cr',
      sub: '+12.4% vs last month',
      isPositive: true,
      trend: [3.8, 4.1, 4.0, 4.3, 4.5, 4.7, 4.82]
    },
    {
      id: 'occ',
      label: 'Overall Desk Occupancy',
      shortLabel: 'Desk Occupancy',
      value: `${avgOccupancy}%`,
      sub: `${totalOccupiedSeats} / ${totalSeats} desks`,
      isPositive: true,
      trend: [82, 84, 83, 86, 88, 87, 89]
    },
    {
      id: 'cli',
      label: 'Active Enterprise Clients',
      shortLabel: 'Enterprise Clients',
      value: `${clients.length}`,
      sub: `Across 11 physical centres`,
      isPositive: true,
      trend: [24, 25, 27, 28, 29, 31, clients.length]
    },
    {
      id: 'risk',
      label: 'Predictive Churn Risk',
      shortLabel: 'Churn Risk',
      value: '78 / 100',
      sub: 'Zenith Systems (Sept 30)',
      isPositive: false,
      trend: [45, 52, 60, 68, 72, 75, 78]
    }
  ];

  const handleCardClick = (idx) => {
    soundFx.playClick();
    const offset = (idx - activeKpiIndex + kpis.length) % kpis.length;
    if (offset === 0) {
      // Clicking the front active card advances to the next card in the stack
      setActiveKpiIndex((prev) => (prev + 1) % kpis.length);
    } else {
      // Clicking a background card brings that specific card to the front
      setActiveKpiIndex(idx);
    }
  };

  // Stacked Card Configuration (z-index & Rotation)
  const getCardStyle = (idx) => {
    const offset = (idx - activeKpiIndex + kpis.length) % kpis.length;
    
    if (offset === 0) {
      // Front active card
      return {
        zIndex: 40,
        transform: 'translateY(0px) scale(1) rotate(0deg)',
        opacity: 1,
        pointerEvents: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
      };
    } else if (offset === 1) {
      // 1st Layer behind
      return {
        zIndex: 30,
        transform: 'translateY(12px) scale(0.985) rotate(-1.2deg)',
        opacity: 0.96,
        pointerEvents: 'auto',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.06)'
      };
    } else if (offset === 2) {
      // 2nd Layer behind
      return {
        zIndex: 20,
        transform: 'translateY(24px) scale(0.97) rotate(1.4deg)',
        opacity: 0.92,
        pointerEvents: 'auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)'
      };
    } else {
      // 3rd Layer behind
      return {
        zIndex: 10,
        transform: 'translateY(36px) scale(0.955) rotate(-2.2deg)',
        opacity: 0.86,
        pointerEvents: 'auto',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      };
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Enterprise Command Center • Multi-Centre
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Executive Leadership Overview
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Consolidated real-time operational telemetry across Hyderabad, Chennai, Bangalore, and Mumbai.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentScreen('reports');
            }}
            className="px-4 py-2 bg-white border border-[#3a3a3a] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#f4f3f1] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">assessment</span>
            <span>Reports & Exports</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentScreen('onboarding_wizard');
            }}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_business</span>
            <span>+ Onboard New Client</span>
          </button>
        </div>
      </div>

      {/* Full-Width Aligned Big Stacked Card Layering Container */}
      <div className="relative w-full h-[235px] select-none">
        {kpis.map((kpi, idx) => {
          const cardStyle = getCardStyle(idx);
          const isFront = (idx - activeKpiIndex + kpis.length) % kpis.length === 0;

          return (
            <div
              key={kpi.id}
              onClick={() => handleCardClick(idx)}
              style={cardStyle}
              className={`absolute inset-x-0 top-0 w-full bg-white border border-[#e3e2e0] p-6 sm:p-7 rounded-3xl transition-all duration-500 ease-out cursor-pointer luxury-card flex flex-col justify-between h-[185px] group active:scale-[0.99] ${
                isFront ? 'border-[#f5b400] shadow-md' : 'hover:brightness-95'
              }`}
            >
              {/* Decorative corner layer accent matching reference */}
              <div
                className="absolute top-0 right-0 w-8 h-8 bg-[#f5b400]/20 rounded-tr-3xl"
                style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
              />

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[#747878] mb-1.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#f5b400]">
                      {kpi.id === 'rev' ? 'payments' : kpi.id === 'occ' ? 'meeting_room' : kpi.id === 'cli' ? 'corporate_fare' : 'warning'}
                    </span>
                    <span>{kpi.label}</span>
                  </div>
                  <div className="font-['Space_Grotesk'] font-mono tabular-nums text-4xl sm:text-5xl font-bold text-[#161616] tracking-tight">
                    {kpi.value}
                  </div>
                </div>

                {/* Card index & shuffle hint badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-[#747878] bg-[#f8f7f5] px-2.5 py-1 rounded-full border border-[#e3e2e0]">
                    {idx + 1} of {kpis.length}
                  </span>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#747878] bg-[#f8f7f5] px-3 py-1 rounded-full border border-[#e3e2e0] group-hover:border-[#f5b400] transition-colors">
                    <span className="material-symbols-outlined text-xs text-[#f5b400]">
                      {isFront ? 'style' : 'touch_app'}
                    </span>
                    <span>{isFront ? 'Click Card to Shuffle →' : 'Click to Bring to Front'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between pt-3 border-t border-[#f4f3f1]">
                <div className="text-xs sm:text-sm">
                  <span
                    className={`font-bold ${
                      kpi.isPositive ? 'text-[#1e8a5f]' : 'text-[#c4432b]'
                    }`}
                  >
                    {kpi.sub}
                  </span>
                </div>
                <Sparkline data={kpi.trend} isPositive={kpi.isPositive} width={140} height={38} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Centre Comparison Matrix & Anomaly Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 11 Centres Comparison Table */}
        <div className="lg:col-span-8 bg-white border border-[#e3e2e0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e3e2e0]">
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
                Centre Performance Matrix (11 Branches)
              </h3>
              <p className="text-xs text-[#747878]">Occupancy, capacity utilization, and physical suites</p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentScreen('enterprise_ops');
              }}
              className="text-xs text-[#7b5900] font-bold hover:underline cursor-pointer"
            >
              View Grid Telemetry →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e0] text-[#747878] uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-bold">Centre Name</th>
                  <th className="pb-3 font-bold">City</th>
                  <th className="pb-3 font-bold">Occupancy</th>
                  <th className="pb-3 font-bold">Capacity</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f3f1]">
                {CENTRES.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8f7f5] transition-colors">
                    <td className="py-3 font-semibold text-[#161616] flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#f5b400]">domain</span>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3 text-[#444748]">{c.city}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#f4f3f1] h-2 rounded-full overflow-hidden border border-[#e3e2e0]">
                          <div
                            className={`h-full rounded-full ${
                              c.occupancy >= 85
                                ? 'bg-[#1e8a5f]'
                                : c.occupancy >= 80
                                ? 'bg-[#f5b400]'
                                : 'bg-[#c4432b]'
                            }`}
                            style={{ width: `${c.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-[#161616]">{c.occupancy}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-[#747878]">
                      {c.seats} Desks • {c.rooms} Suites
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveBranch(c);
                          setCurrentScreen('branch_dashboard');
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold bg-[#f4f3f1] hover:bg-[#f5b400] text-[#161616] rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Anomalies & Retention Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#e3e2e0] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e2e0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f5b400]">psychology</span>
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#161616]">
                  AI Decision Alerts
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#1e8a5f] bg-[#e7f5ed] px-2 py-0.5 rounded-full">
                Active Models
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#fff8f7] border border-[#ffdad6] rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-[#ba1a1a]">
                  <span>Zenith Systems (Hitec City)</span>
                  <span>Risk: 78/100</span>
                </div>
                <p className="text-[#444748] text-[11px] leading-relaxed">
                  Contract expires in 32 days. Meeting room usage has declined by 40% while 2 HVAC comfort tickets remain pending.
                </p>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentScreen('ai_insights');
                  }}
                  className="mt-2 text-[#7b5900] font-bold hover:underline block text-[11px] cursor-pointer"
                >
                  Inspect Retention Proposal →
                </button>
              </div>

              <div className="p-3.5 bg-[#fffbf2] border border-[#f5b400] rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-[#7b5900]">
                  <span>Acme Innovations Upsell</span>
                  <span>Expansion Signal</span>
                </div>
                <p className="text-[#444748] text-[11px] leading-relaxed">
                  Floor 7 Suite 704 & 705 seat occupancy at 100%. 3 new biometric employee access requests submitted this week.
                </p>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentScreen('ai_insights');
                  }}
                  className="mt-2 text-[#7b5900] font-bold hover:underline block text-[11px] cursor-pointer"
                >
                  Propose Adjacent Suite 706 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Universal Active Enterprise Client Directory (National Portfolio) */}
      <div className="bg-white border border-[#e3e2e0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e3e2e0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f5b400]">corporate_fare</span>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                Active Enterprise Client Directory (National Portfolio)
              </h3>
            </div>
            <p className="text-xs text-[#747878] mt-0.5">
              Live enterprise client accounts, contracted desks, and assigned branch locations ({clients.length} Total Enterprise Tenants).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-sm text-[#747878]">
                search
              </span>
              <input
                type="text"
                placeholder="Search tenant or entity..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] w-48 font-medium"
              />
            </div>

            {/* Centre Filter */}
            <select
              value={clientFilterCentre}
              onChange={(e) => setClientFilterCentre(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl font-bold outline-none text-[#161616] cursor-pointer"
            >
              <option>All Centres</option>
              {CENTRES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentScreen('onboarding_wizard');
              }}
              className="px-3.5 py-1.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Onboard Client</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#e3e2e0] text-[#747878] uppercase text-[10px] tracking-wider bg-[#faf9f7]">
                <th className="p-3 font-bold">Client Entity</th>
                <th className="p-3 font-bold">Branch Centre</th>
                <th className="p-3 font-bold">Suites & Desks</th>
                <th className="p-3 font-bold">Monthly Contract (MRR)</th>
                <th className="p-3 font-bold">Contract Term</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold text-right">Branch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f3f1]">
              {filteredClients.map((client) => {
                const targetCentreObj = CENTRES.find((c) => c.name === client.centre) || CENTRES[0];
                const mrr = (client.seats || 20) * (client.ratePerSeat || 15000);

                return (
                  <tr key={client.id} className="hover:bg-[#f8f7f5] transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-sm text-[#161616]">{client.name}</div>
                      <div className="text-[11px] text-[#747878]">
                        {client.legalEntity || client.name} • {client.pan || 'PAN Verified'}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fff4e5] text-[#7b5900] font-bold text-[11px]">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span>{client.centre || 'Hitec City'}</span>
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-[#161616]">
                        {Array.isArray(client.rooms) ? client.rooms.map(r => `Suite ${r}`).join(', ') : 'Dedicated Wing'}
                      </div>
                      <div className="text-[11px] text-[#1e8a5f] font-semibold">
                        {client.seats} Contracted Desks
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-mono font-bold text-sm text-[#161616]">
                        ₹{mrr.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-[#747878] font-normal">/mo</span>
                      </div>
                      <div className="text-[10px] text-[#747878]">
                        @ ₹{(client.ratePerSeat || 15000).toLocaleString('en-IN')}/desk
                      </div>
                    </td>

                    <td className="p-3 text-[11px] text-[#444748]">
                      <div>{client.contractStart || '2026-09-01'}</div>
                      <div className="text-[#747878]">to {client.contractEnd || '2027-08-31'}</div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          client.status === 'Expiring Soon'
                            ? 'bg-[#fff0ed] text-[#c4432b]'
                            : 'bg-[#e7f5ed] text-[#1e8a5f]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{client.status || 'Active'}</span>
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveBranch(targetCentreObj);
                          setCurrentScreen('branch_dashboard');
                        }}
                        className="px-3 py-1.5 bg-[#161616] hover:bg-[#f5b400] text-white hover:text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Open Branch</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
