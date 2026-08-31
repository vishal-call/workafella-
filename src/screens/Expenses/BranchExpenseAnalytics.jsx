import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedDonutChart } from '../../components/AnimatedDonutChart';

export const BranchExpenseAnalytics = () => {
  const { activeBranch, setCurrentScreen } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

  const categoryBreakdown = [
    { category: 'Facility Expenses', spent: 385000, budget: 400000, color: 'bg-[#161616]', hexColor: '#161616', percent: 53 },
    { category: 'Vendor Expenses', spent: 210000, budget: 220000, color: 'bg-[#f5b400]', hexColor: '#f5b400', percent: 29 },
    { category: 'Asset-Related', spent: 85000, budget: 60000, color: 'bg-[#c4432b]', hexColor: '#c4432b', percent: 12, isOverBudget: true },
    { category: 'Office / Operational', spent: 42000, budget: 50000, color: 'bg-[#3a3a3a]', hexColor: '#747878', percent: 6 }
  ];

  const totalSpent = categoryBreakdown.reduce((acc, c) => acc + c.spent, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Cost Intelligence & Margins • {activeBranch.city}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Branch-Wise Expense Analytics
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Interactive visual spend donut, budget-vs-actual variance, and facility cost trends at {activeBranch.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
          >
            <option>August 2026</option>
            <option>July 2026</option>
            <option>June 2026</option>
          </select>

          <button
            onClick={() => setCurrentScreen('log_expense')}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Log Expense</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e3e2e0] p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-all luxury-card">
          <div className="text-[11px] uppercase font-bold text-[#747878] mb-1">Total Operating Spend (MTD)</div>
          <div className="font-['Space_Grotesk'] font-mono tabular-nums text-3xl font-bold text-[#161616]">
            ₹{(totalSpent / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-[#1e8a5f] font-semibold mt-1">92% of Monthly Allocated Budget</div>
        </div>

        <div className="bg-white border border-[#e3e2e0] p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-all luxury-card">
          <div className="text-[11px] uppercase font-bold text-[#747878] mb-1">Gross Operating Margin</div>
          <div className="font-['Space_Grotesk'] font-mono tabular-nums text-3xl font-bold text-[#1e8a5f]">
            88.4%
          </div>
          <div className="text-xs text-[#747878] mt-1">Revenue: ₹62.4L vs OpEx: ₹7.22L</div>
        </div>

        <div className="bg-white border border-[#ba1a1a] p-6 rounded-3xl bg-[#fff8f7] relative shadow-sm hover:shadow-md transition-all luxury-card">
          <div className="text-[11px] uppercase font-bold text-[#ba1a1a] mb-1">Budget Overrun Alert</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#ba1a1a]">
            Asset-Related (+41.6%)
          </div>
          <div className="text-xs text-[#747878] mt-1">Due to Daikin VRV compressor overhaul</div>
        </div>
      </div>

      {/* Two Column Layout: Interactive Donut Spend Breakdown & Budget-vs-Actual Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Donut & Category List */}
        <div className="lg:col-span-6 bg-white border border-[#e3e2e0] rounded-3xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616] mb-1">
              Spend Breakdown by 4 Master Groups
            </h3>
            <p className="text-xs text-[#747878]">Facility power, vendor agencies, and asset upkeep</p>
          </div>

          <AnimatedDonutChart data={categoryBreakdown} total={totalSpent} />
        </div>

        {/* Right Column: Budget vs Actual Bars */}
        <div className="lg:col-span-6 bg-white border border-[#e3e2e0] rounded-3xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616] mb-1">
              Budget vs. Actual Variance Analysis
            </h3>
            <p className="text-xs text-[#747878]">Tracking real-time variances against monthly budget caps</p>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, idx) => {
              const spentPercent = Math.round((cat.spent / cat.budget) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#161616]">{cat.category}</span>
                    <span className="font-mono text-[#747878]">
                      ₹{(cat.spent / 1000).toFixed(0)}k / ₹{(cat.budget / 1000).toFixed(0)}k ({spentPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#f4f3f1] h-3 rounded-full overflow-hidden border border-[#e3e2e0]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.isOverBudget ? 'bg-[#c4432b]' : 'bg-[#161616]'
                      }`}
                      style={{ width: `${Math.min(100, spentPercent)}%` }}
                    ></div>
                  </div>
                  {cat.isOverBudget && (
                    <div className="text-[10px] text-[#c4432b] font-bold">
                      ⚠ Over budget by ₹{((cat.spent - cat.budget) / 1000).toFixed(0)}k
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
