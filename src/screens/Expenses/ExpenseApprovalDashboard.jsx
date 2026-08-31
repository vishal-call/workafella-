import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ExpenseApprovalDashboard = () => {
  const { expenses, setExpenses, setCurrentScreen } = useApp();
  const [filterCategory, setFilterCategory] = useState('All');

  const handleApprove = (id, amount) => {
    setExpenses(
      expenses.map((e) => {
        if (e.id === id) {
          if (amount > 100000 && e.status === 'Branch Admin Review') {
            return { ...e, status: 'Finance Review' };
          }
          return { ...e, status: 'Approved' };
        }
        return e;
      })
    );
    if (amount > 100000) {
      alert('Approved at Branch Admin level. Forwarded to Finance Controller for threshold sign-off.');
    } else {
      alert('Expense approved successfully and committed to branch ledger.');
    }
  };

  const handleReject = (id) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e)));
  };

  const filtered = filterCategory === 'All'
    ? expenses
    : expenses.filter((e) => e.category === filterCategory);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Governance & Financial Approvals
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Branch Expense Approvals Queue
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Multi-tier sign-off for facility, vendor, and asset expenses across branch and enterprise finance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('branch_expenses_analytics')}
            className="px-4 py-2 bg-[#161616] text-[#f5b400] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#2f3130] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">pie_chart</span>
            <span>Expense Analytics & Donut</span>
          </button>
          <button
            onClick={() => setCurrentScreen('log_expense')}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Log New Expense</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#3a3a3a] p-4 flex flex-wrap justify-between items-center gap-3 text-xs">
        <div className="flex flex-wrap gap-2">
          {['All', 'Facility', 'Vendor', 'Asset-Related', 'Office / Operational'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 font-semibold transition-colors ${
                filterCategory === cat
                  ? 'bg-[#161616] text-[#f5b400]'
                  : 'bg-[#f4f3f1] text-[#747878] hover:text-[#161616]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-[#747878]">
          Threshold: Expenses &gt; ₹1,00,000 require dual Branch Admin + Finance Sign-off
        </span>
      </div>

      {/* Approvals Table */}
      <div className="bg-white border border-[#3a3a3a] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Expense ID</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Date</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Category / Line-Item</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Submitted By</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Amount</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Receipt</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Approval Status</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk'] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2e0]">
            {filtered.map((exp) => {
              const isPending = exp.status === 'Branch Admin Review' || exp.status === 'Finance Review' || exp.status === 'Submitted';

              return (
                <tr key={exp.id} className="hover:bg-[#f8f7f5] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#7b5900]">{exp.id}</td>
                  <td className="p-3.5 text-[#747878]">{exp.date}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#161616]">{exp.subcategory}</div>
                    <div className="text-[10px] text-[#747878]">{exp.category} • {exp.centre}</div>
                  </td>
                  <td className="p-3.5 text-[#444748]">{exp.submittedBy}</td>
                  <td className="p-3.5 font-['Space_Grotesk'] font-bold text-sm text-[#161616]">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => alert(`Viewing attached supporting receipt for ${exp.id}...`)}
                      className="text-[#7b5900] font-bold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">attachment</span>
                      <span>Receipt.pdf</span>
                    </button>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold ${
                        exp.status === 'Approved'
                          ? 'bg-[#e7f5ed] text-[#1e8a5f]'
                          : exp.status === 'Finance Review'
                          ? 'bg-[#fff4e5] text-[#c77800]'
                          : 'bg-[#f4f3f1] text-[#161616]'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {isPending ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleReject(exp.id)}
                          className="px-2.5 py-1 bg-[#ffdad6] text-[#ba1a1a] font-bold text-[11px] hover:bg-[#ffb5a1]"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(exp.id, exp.amount)}
                          className="px-3 py-1 bg-[#f5b400] text-[#161616] font-bold text-[11px] hover:bg-[#ffdea4]"
                        >
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#1e8a5f] font-bold">✓ Approved</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
