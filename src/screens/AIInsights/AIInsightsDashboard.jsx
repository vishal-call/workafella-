import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AIInsightsDashboard = () => {
  const { clients } = useApp();
  const [activeTab, setActiveTab] = useState('Renewal & Churn');

  const [approvedRecommendations, setApprovedRecommendations] = useState([]);

  const handleApproveAction = (recId) => {
    setApprovedRecommendations([...approvedRecommendations, recId]);
    alert(`AI Recommendation [${recId}] approved. Task dispatched to account executive.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Machine Learning & Predictive Intelligence
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            AI Decision Support & Predictive Analytics
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Explainable retention signals, revenue forecasting confidence intervals, and operational anomaly detection.
          </p>
        </div>

        <span className="text-xs bg-[#161616] text-[#f5b400] px-3.5 py-1.5 font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">psychology</span>
          <span>Model v2.4 Active</span>
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#e3e2e0] pb-2 text-xs font-bold">
        {['Renewal & Churn', 'Revenue Forecast', 'Room Demand', 'SLA Risk', 'Expansion Signals'].map((tab) => (
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

      {/* Main AI Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Churn & Renewal Risk */}
        <div className="bg-white border border-[#3a3a3a] p-6 space-y-4 relative">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7b5900]">Predictive Retention</span>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                Zenith Systems & AI (Risk: 78/100)
              </h3>
            </div>
            <span className="bg-[#ffdad6] text-[#ba1a1a] px-2.5 py-1 text-[10px] font-bold">
              High Churn Risk
            </span>
          </div>

          <div className="text-xs bg-[#f8f7f5] p-4 border border-[#e3e2e0] space-y-2">
            <div className="font-bold text-[#161616] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#f5b400]">info</span>
              <span>Why this recommendation? Contributing Drivers:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[#444748]">
              <li>Contract expiring in 32 days (Sept 30, 2026).</li>
              <li>Meeting room overage increased by ₹10,000 without contract seat expansion.</li>
              <li>2 unresolved ticket inquiries regarding Zone 7B HVAC comfort.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#e3e2e0]">
            <span className="text-[11px] text-[#747878] font-semibold">
              Proposed Action: Offer 15% discount on 1-year renewal with 10 free meeting hours.
            </span>
            <button
              onClick={() => handleApproveAction('REC-01')}
              disabled={approvedRecommendations.includes('REC-01')}
              className={`px-4 py-2 font-bold text-xs ${
                approvedRecommendations.includes('REC-01')
                  ? 'bg-[#e7f5ed] text-[#1e8a5f]'
                  : 'bg-[#f5b400] text-[#161616] hover:bg-[#ffdea4]'
              }`}
            >
              {approvedRecommendations.includes('REC-01') ? '✓ Approved' : 'Approve Action'}
            </button>
          </div>
        </div>

        {/* Card 2: Expansion Opportunity Signal */}
        <div className="bg-white border border-[#3a3a3a] p-6 space-y-4 relative">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1e8a5f]">Account Upsell Signal</span>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                Acme Innovations Pvt Ltd
              </h3>
            </div>
            <span className="bg-[#e7f5ed] text-[#1e8a5f] px-2.5 py-1 text-[10px] font-bold">
              Expansion Opportunity
            </span>
          </div>

          <div className="text-xs bg-[#f8f7f5] p-4 border border-[#e3e2e0] space-y-2">
            <div className="font-bold text-[#161616] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#f5b400]">info</span>
              <span>Why this recommendation? Contributing Drivers:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[#444748]">
              <li>Seat occupancy consistently at 100% across Suite 704 & 705.</li>
              <li>3 new biometric employee onboarding requests submitted this week.</li>
              <li>Adjacent Suite 706 (15 Desks) is currently vacant on Floor 7.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#e3e2e0]">
            <span className="text-[11px] text-[#747878] font-semibold">
              Proposed Action: Propose Suite 706 annex lease amendment to Client Admin.
            </span>
            <button
              onClick={() => handleApproveAction('REC-02')}
              disabled={approvedRecommendations.includes('REC-02')}
              className={`px-4 py-2 font-bold text-xs ${
                approvedRecommendations.includes('REC-02')
                  ? 'bg-[#e7f5ed] text-[#1e8a5f]'
                  : 'bg-[#f5b400] text-[#161616] hover:bg-[#ffdea4]'
              }`}
            >
              {approvedRecommendations.includes('REC-02') ? '✓ Approved' : 'Dispatch Proposal'}
            </button>
          </div>
        </div>

        {/* Card 3: Revenue Forecast Model */}
        <div className="bg-white border border-[#3a3a3a] p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7b5900]">Revenue Forecasting</span>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                Q4 2026 Projected Enterprise Billing
              </h3>
            </div>
            <span className="text-xs font-bold text-[#1e8a5f]">94% Confidence</span>
          </div>

          <div className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            ₹15.4 Cr <span className="text-xs text-[#747878] font-normal">± ₹45 Lakhs Range</span>
          </div>

          <p className="text-xs text-[#444748] leading-relaxed">
            Forecasting incorporates historical 87.4% retention, BKC Mumbai Floor 7 expansion intake, and 12 contracted pipeline conversions across Hyderabad and Bangalore.
          </p>
        </div>

        {/* Card 4: Meeting Room Demand Anomaly */}
        <div className="bg-white border border-[#3a3a3a] p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7b5900]">Space Utilization Model</span>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                Peak Meeting Room Demand Shift
              </h3>
            </div>
            <span className="text-xs font-bold text-[#c77800]">Optimization</span>
          </div>

          <div className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Tuesdays & Thursdays (02:00 PM - 05:00 PM)
          </div>

          <p className="text-xs text-[#444748] leading-relaxed">
            The Boardroom 7A exhibits 95% concurrent demand conflicts on mid-week afternoons. Recommendation: Enable dynamic pricing or suggest Creator Pod Alpha as alternative for &lt; 4 attendees.
          </p>
        </div>
      </div>
    </div>
  );
};
