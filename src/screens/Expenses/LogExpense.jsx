import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LogExpense = () => {
  const { expenses, setExpenses, activeBranch, currentUser, setCurrentScreen } = useApp();

  const [category, setCategory] = useState('Facility');
  const [subcategory, setSubcategory] = useState('Electricity & Power HT Grid');
  const [amount, setAmount] = useState('185000');
  const [date, setDate] = useState('2026-08-29');
  const [isRecurring, setIsRecurring] = useState(true);
  const [description, setDescription] = useState('Monthly commercial electricity grid consumption bill.');
  const [linkedVendor, setLinkedVendor] = useState('TSSPDCL Grid Board');

  const categories = [
    { name: 'Facility', icon: 'domain', subcategories: ['Electricity & Power HT Grid', 'Water Supply & STP', 'Internet & Leased Lines', 'Generator Diesel Backup', 'Air Conditioning & Chillers', 'Repairs & Physical Maintenance'] },
    { name: 'Office / Operational', icon: 'storefront', subcategories: ['Pantry & Beverage Consumables', 'Stationery & Printing', 'Drinking Water Jars', 'Courier & Local Logistics'] },
    { name: 'Vendor', icon: 'handshake', subcategories: ['Facility Management & Housekeeping Agency', '24/7 Security Agency Guard Deployment', 'IT Network Support AMC', 'Elevator Maintenance AMC'] },
    { name: 'Asset-Related', icon: 'build', subcategories: ['Chiller Compressor Overhaul', 'Generator Alternator Service', 'Polycom AV Screen Repair', 'Turnstile Gate Replacement'] },
    { name: 'Other / Emergency', icon: 'emergency', subcategories: ['Miscellaneous Emergency Operational Expense', 'One-time Municipal License Fee'] }
  ];

  const handleCategoryChange = (catName) => {
    setCategory(catName);
    const found = categories.find((c) => c.name === catName);
    if (found && found.subcategories.length > 0) {
      setSubcategory(found.subcategories[0]);
    }
  };

  const currentSubcategories = categories.find((c) => c.name === category)?.subcategories || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExp = {
      id: `EXP-${Math.floor(900 + Math.random() * 100)}`,
      centre: activeBranch.name,
      category,
      subcategory,
      amount: Number(amount),
      date,
      submittedBy: currentUser.name,
      status: Number(amount) > 100000 ? 'Branch Admin Review' : 'Approved',
      receiptUrl: 'attached_invoice_bill.pdf',
      isRecurring,
      description,
      vendor: linkedVendor
    };

    setExpenses([newExp, ...expenses]);
    alert(`Success! Logged ₹${Number(amount).toLocaleString('en-IN')} expense under ${category}. Routed to approval workflow.`);
    setCurrentScreen('expense_approvals');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Operational Cost Ledger
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Log Branch Operational Expense
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Capture facility, vendor, asset maintenance, or operational expenses with mandatory supporting receipts.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('expense_approvals')}
          className="text-xs text-[#747878] hover:text-[#161616] font-semibold flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">fact_check</span>
          <span>View Expense Approvals Queue</span>
        </button>
      </div>

      {/* Expense Form */}
      <div className="bg-white border border-[#3a3a3a] p-8 relative">
        <div
          className="absolute -top-[1px] -right-[1px] w-4 h-4 bg-[#faf9f7] z-10"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        ></div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 5 Master Category Icon Tiles */}
          <div>
            <label className="block font-bold text-[#161616] mb-2 uppercase tracking-wider text-[11px]">
              1. Select Expense Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {categories.map((c) => {
                const isSelected = category === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleCategoryChange(c.name)}
                    className={`p-3 border flex flex-col items-center justify-center text-center transition-all min-h-[85px] ${
                      isSelected
                        ? 'border-2 border-[#f5b400] bg-[#fffbf2] shadow-sm font-bold text-[#161616]'
                        : 'border-[#e3e2e0] bg-[#f8f7f5] text-[#444748] hover:border-[#161616]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl mb-1 ${isSelected ? 'text-[#f5b400]' : 'text-[#747878]'}`}>
                      {c.icon}
                    </span>
                    <span className="text-[11px] leading-tight">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-[#161616] mb-1">Subcategory Line-Item</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none font-medium"
              >
                {currentSubcategories.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Expense Amount (₹ INR)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none font-['Space_Grotesk'] font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Expense Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Linked Vendor / Supplier</label>
              <input
                type="text"
                value={linkedVendor}
                onChange={(e) => setLinkedVendor(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#161616] mb-1">Detailed Commercial Justification</label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none text-xs"
            ></textarea>
          </div>

          {/* Recurring Expense Template Toggle */}
          <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#161616]">Recurring Monthly Expense Template</div>
              <div className="text-[11px] text-[#747878]">Auto-generates draft line-item each billing cycle</div>
            </div>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 rounded-none border-[#747878] text-[#f5b400] focus:ring-0"
            />
          </div>

          {/* Mandatory Supporting Document Upload */}
          <div className="border-2 border-dashed border-[#c4c7c7] p-5 text-center bg-[#faf9f7] hover:border-[#f5b400] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[#f5b400] text-2xl mb-1">receipt_long</span>
            <div className="text-xs font-bold text-[#161616]">Upload Mandatory Vendor Invoice / Bill / Receipt (PDF/JPG)</div>
            <div className="text-[10px] text-[#747878] mt-0.5">Attached: electricity_bill_aug.pdf (Verified)</div>
          </div>

          <div className="pt-4 border-t border-[#e3e2e0] flex items-center justify-between">
            <span className="text-[11px] text-[#747878]">
              Expenses &gt; ₹1,00,000 route automatically for Finance sign-off.
            </span>

            <button
              type="submit"
              className="px-8 py-3 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-sm hover:bg-[#ffdea4] transition-colors flex items-center gap-2 shadow-md"
            >
              <span>Submit Expense Entry</span>
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
