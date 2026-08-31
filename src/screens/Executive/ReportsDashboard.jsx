import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ReportsDashboard = () => {
  const [selectedReport, setSelectedReport] = useState('Revenue & Billing');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const reportCategories = [
    'Revenue & Billing',
    'Centre Occupancy',
    'Contract Pipeline',
    'Ticket SLAs',
    'Visitor Trends',
    'Branch Expenses',
    'Asset Health'
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Enterprise Intelligence & Auditing
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Management Reports & Analytics
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Exportable regulatory audits, financial performance, SLA compliance, and cross-branch benchmarking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting comprehensive CSV report...')}
            className="px-4 py-2 bg-white border border-[#3a3a3a] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#f4f3f1] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">grid_on</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => alert('Generating Board of Directors executive PDF report...')}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Export Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Left Category Nav & Right Report Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Report Categories Nav */}
        <div className="lg:col-span-3 space-y-1 bg-white border border-[#3a3a3a] p-3">
          <div className="p-2 text-[10px] uppercase font-bold text-[#747878]">Report Domain</div>
          {reportCategories.map((rc) => (
            <button
              key={rc}
              onClick={() => setSelectedReport(rc)}
              className={`w-full text-left px-3 py-2.5 text-xs font-bold transition-colors ${
                selectedReport === rc
                  ? 'bg-[#161616] text-[#f5b400]'
                  : 'text-[#444748] hover:bg-[#f4f3f1] hover:text-[#161616]'
              }`}
            >
              {rc}
            </button>
          ))}
        </div>

        {/* Right Column: Active Report Analytics & Table Canvas */}
        <div className="lg:col-span-9 bg-white border border-[#3a3a3a] p-6 space-y-6">
          <div className="flex flex-wrap justify-between items-center pb-3 border-b border-[#e3e2e0] gap-3">
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                {selectedReport} Performance Report
              </h3>
              <p className="text-xs text-[#747878]">Consolidated data covering all 11 Workafella centres</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#747878]">City Filter:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-2.5 py-1 bg-[#f4f3f1] border border-[#e3e2e0] font-semibold outline-none"
              >
                <option>All Cities</option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Bangalore</option>
                <option>Mumbai</option>
              </select>
            </div>
          </div>

          {/* KPI Snapshot Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0]">
              <div className="text-[10px] uppercase font-bold text-[#747878]">Total Volume / Billed</div>
              <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] mt-1">₹4.82 Cr</div>
            </div>
            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0]">
              <div className="text-[10px] uppercase font-bold text-[#747878]">Average Realization Rate</div>
              <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#1e8a5f] mt-1">₹14,850 / Desk</div>
            </div>
            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0]">
              <div className="text-[10px] uppercase font-bold text-[#747878]">SLA Audit Compliance</div>
              <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] mt-1">98.1% Pass</div>
            </div>
          </div>

          {/* Sample Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-bold font-['Space_Grotesk']">Metric Segment</th>
                  <th className="p-3 font-bold font-['Space_Grotesk']">Period Total</th>
                  <th className="p-3 font-bold font-['Space_Grotesk']">Budget Target</th>
                  <th className="p-3 font-bold font-['Space_Grotesk']">Variance Delta</th>
                  <th className="p-3 font-bold font-['Space_Grotesk'] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e0]">
                <tr className="hover:bg-[#f8f7f5]">
                  <td className="p-3 font-bold text-[#161616]">Dedicated Desk Billing</td>
                  <td className="p-3 font-mono">₹1.84 Cr</td>
                  <td className="p-3 font-mono text-[#747878]">₹1.75 Cr</td>
                  <td className="p-3 text-[#1e8a5f] font-bold">+5.1%</td>
                  <td className="p-3 text-right">
                    <span className="bg-[#e7f5ed] text-[#1e8a5f] px-2 py-0.5 text-[10px] font-bold">Optimal</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f8f7f5]">
                  <td className="p-3 font-bold text-[#161616]">Private Office Suites</td>
                  <td className="p-3 font-mono">₹2.45 Cr</td>
                  <td className="p-3 font-mono text-[#747878]">₹2.30 Cr</td>
                  <td className="p-3 text-[#1e8a5f] font-bold">+6.5%</td>
                  <td className="p-3 text-right">
                    <span className="bg-[#e7f5ed] text-[#1e8a5f] px-2 py-0.5 text-[10px] font-bold">Optimal</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f8f7f5]">
                  <td className="p-3 font-bold text-[#161616]">Meeting Room Overage</td>
                  <td className="p-3 font-mono">₹18.5 L</td>
                  <td className="p-3 font-mono text-[#747878]">₹15.0 L</td>
                  <td className="p-3 text-[#1e8a5f] font-bold">+23.3%</td>
                  <td className="p-3 text-right">
                    <span className="bg-[#e7f5ed] text-[#1e8a5f] px-2 py-0.5 text-[10px] font-bold">High Growth</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
