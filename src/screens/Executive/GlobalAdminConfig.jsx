import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const GlobalAdminConfig = () => {
  const [activeTab, setActiveTab] = useState('RBAC Matrix');

  const permissionsMatrix = [
    { module: 'Customer Onboarding & Contracts', superAdmin: true, branchAdmin: true, finance: false, ops: false, clientAdmin: false, security: false },
    { module: 'Workspace Allocation & Capacity', superAdmin: true, branchAdmin: true, finance: false, ops: false, clientAdmin: false, security: false },
    { module: 'Meeting Room Booking & Calendar', superAdmin: true, branchAdmin: true, finance: false, ops: true, clientAdmin: true, security: false },
    { module: 'Employee Access & Biometric Sign-off', superAdmin: true, branchAdmin: true, finance: false, ops: false, clientAdmin: true, security: false },
    { module: 'Visitor Pass & Gate Execution', superAdmin: true, branchAdmin: true, finance: false, ops: true, clientAdmin: true, security: true },
    { module: 'Service Desk & Incident Tickets', superAdmin: true, branchAdmin: true, finance: false, ops: true, clientAdmin: true, security: false },
    { module: 'Invoicing, Billing & Adjustments', superAdmin: true, branchAdmin: false, finance: true, ops: false, clientAdmin: false, security: false },
    { module: 'Branch Expense Ledger & Sign-offs', superAdmin: true, branchAdmin: true, finance: true, ops: true, clientAdmin: false, security: false },
    { module: 'Executive Reports & AI Forecasts', superAdmin: true, branchAdmin: true, finance: true, ops: false, clientAdmin: false, security: false }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Enterprise Governance & Platform Masters
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Global Administration & RBAC Configuration
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Manage Role-Based Access Control matrix, centre masters, policy sliders, and notification templates.
          </p>
        </div>

        <button
          onClick={() => alert('Platform master settings saved to production database.')}
          className="px-5 py-2.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-base">save</span>
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#e3e2e0] pb-2 text-xs font-bold">
        {['RBAC Matrix', 'Policy & SLA Sliders', 'Masters & Categories', 'Notification Templates'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 transition-colors ${
              activeTab === tab
                ? 'bg-[#161616] text-[#f5b400]'
                : 'bg-[#f4f3f1] text-[#747878] hover:text-[#161616]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* RBAC Matrix Tab */}
      {activeTab === 'RBAC Matrix' && (
        <div className="bg-white border border-[#3a3a3a] p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e3e2e0]">
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#161616]">
                Role-Based Permission Matrix (RBAC)
              </h3>
              <p className="text-xs text-[#747878]">Least-privilege scoping across 6 platform roles</p>
            </div>
            <span className="text-xs text-[#1e8a5f] font-bold">✓ Multi-Tenant Isolation Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-bold font-['Space_Grotesk']">System Capability</th>
                  <th className="p-3 font-bold text-center">Super Admin</th>
                  <th className="p-3 font-bold text-center">Branch Admin</th>
                  <th className="p-3 font-bold text-center">Finance User</th>
                  <th className="p-3 font-bold text-center">Operations</th>
                  <th className="p-3 font-bold text-center">Client Admin</th>
                  <th className="p-3 font-bold text-center">Security</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e0]">
                {permissionsMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#f8f7f5]">
                    <td className="p-3 font-semibold text-[#161616]">{row.module}</td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={row.superAdmin} readOnly className="text-[#f5b400] rounded-none" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={row.branchAdmin} readOnly className="text-[#f5b400] rounded-none" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={row.finance} readOnly className="text-[#f5b400] rounded-none" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={row.ops} readOnly className="text-[#f5b400] rounded-none" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={row.clientAdmin} readOnly className="text-[#f5b400] rounded-none" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={row.security} readOnly className="text-[#f5b400] rounded-none" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Policy & SLA Sliders Tab */}
      {activeTab === 'Policy & SLA Sliders' && (
        <div className="bg-white border border-[#3a3a3a] p-8 space-y-6 text-xs">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
            Operational Policy & Algorithm Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 bg-[#f8f7f5] p-4 border border-[#e3e2e0]">
              <label className="block font-bold text-[#161616]">Meeting Room Temporary Hold Duration</label>
              <div className="flex items-center gap-3">
                <input type="range" min="3" max="15" defaultValue="5" className="w-full accent-[#f5b400]" />
                <span className="font-bold text-sm font-['Space_Grotesk'] text-[#161616]">5 Minutes</span>
              </div>
              <p className="text-[10px] text-[#747878]">Releases lock automatically on expiry countdown.</p>
            </div>

            <div className="space-y-2 bg-[#f8f7f5] p-4 border border-[#e3e2e0]">
              <label className="block font-bold text-[#161616]">Free Entitlement Hours Factor</label>
              <div className="flex items-center gap-3">
                <input type="range" min="0.5" max="3" step="0.5" defaultValue="1" className="w-full accent-[#f5b400]" />
                <span className="font-bold text-sm font-['Space_Grotesk'] text-[#161616]">1.0 hr / seat</span>
              </div>
              <p className="text-[10px] text-[#747878]">Calculates monthly wallet quota = seats × factor.</p>
            </div>

            <div className="space-y-2 bg-[#f8f7f5] p-4 border border-[#e3e2e0]">
              <label className="block font-bold text-[#161616]">Dual Finance Approval Threshold</label>
              <div className="flex items-center gap-3">
                <input type="range" min="50000" max="250000" step="25000" defaultValue="100000" className="w-full accent-[#f5b400]" />
                <span className="font-bold text-sm font-['Space_Grotesk'] text-[#161616]">₹1,00,000</span>
              </div>
              <p className="text-[10px] text-[#747878]">Expenses above this value require Finance sign-off.</p>
            </div>

            <div className="space-y-2 bg-[#f8f7f5] p-4 border border-[#e3e2e0]">
              <label className="block font-bold text-[#161616]">Contract Expiry Reminder Trigger</label>
              <div className="flex items-center gap-3">
                <input type="range" min="15" max="60" step="5" defaultValue="30" className="w-full accent-[#f5b400]" />
                <span className="font-bold text-sm font-['Space_Grotesk'] text-[#161616]">30 Days</span>
              </div>
              <p className="text-[10px] text-[#747878]">Initiates automated renewal reminder notifications.</p>
            </div>
          </div>
        </div>
      )}

      {/* Masters & Categories Tab */}
      {activeTab === 'Masters & Categories' && (
        <div className="bg-white border border-[#3a3a3a] p-6 space-y-4 text-xs">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
            Configurable Platform Masters
          </h3>
          <p className="text-[#747878]">No code changes required to add new centres, categories, or amenity lists.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0]">
              <div className="font-bold text-[#161616] mb-2">11 Physical Centres</div>
              <div className="text-[11px] text-[#747878] space-y-1">
                <div>• Hitec City (Hyderabad)</div>
                <div>• Guindy Cybervale (Chennai)</div>
                <div>• Millers Road (Bangalore)</div>
                <div>• BKC One (Mumbai)</div>
              </div>
            </div>

            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0]">
              <div className="font-bold text-[#161616] mb-2">5 Expense Categories</div>
              <div className="text-[11px] text-[#747878] space-y-1">
                <div>• Facility Expenses</div>
                <div>• Office / Operational</div>
                <div>• Vendor Expenses</div>
                <div>• Asset-Related</div>
                <div>• Other / Emergency</div>
              </div>
            </div>

            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0]">
              <div className="font-bold text-[#161616] mb-2">6 Ticket Categories</div>
              <div className="text-[11px] text-[#747878] space-y-1">
                <div>• Internet & Wi-Fi</div>
                <div>• Maintenance & AC</div>
                <div>• Housekeeping</div>
                <div>• Utilities & Power</div>
                <div>• Pantry Services</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Templates Tab */}
      {activeTab === 'Notification Templates' && (
        <div className="bg-white border border-[#3a3a3a] p-6 space-y-4 text-xs">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
            Automated Notification Templates
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] flex justify-between items-center">
              <div>
                <div className="font-bold text-[#161616]">Meeting Room Hold Expiry Countdown</div>
                <div className="text-[11px] text-[#747878]">Channels: In-App Banner • Trigger: Hold &lt; 60 seconds</div>
              </div>
              <button className="text-xs text-[#7b5900] font-bold hover:underline">Edit Template</button>
            </div>

            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] flex justify-between items-center">
              <div>
                <div className="font-bold text-[#161616]">Monthly Tax Invoice Released</div>
                <div className="text-[11px] text-[#747878]">Channels: Email + WhatsApp • Trigger: Finance Approval</div>
              </div>
              <button className="text-xs text-[#7b5900] font-bold hover:underline">Edit Template</button>
            </div>

            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] flex justify-between items-center">
              <div>
                <div className="font-bold text-[#161616]">Visitor Gate Pass QR Dispatch</div>
                <div className="text-[11px] text-[#747878]">Channels: SMS + Email • Trigger: Client Pre-Registration</div>
              </div>
              <button className="text-xs text-[#7b5900] font-bold hover:underline">Edit Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
