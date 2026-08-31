import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const InvoiceDetail = () => {
  const { invoices, setInvoices, setCurrentScreen } = useApp();
  const invoice = invoices[1]; // Zenith Systems (includes overage line)

  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [isApproved, setIsApproved] = useState(invoice.status === 'Approved');

  const handleApproveAndRelease = () => {
    setInvoices(
      invoices.map((inv) => (inv.id === invoice.id ? { ...inv, status: 'Approved' } : inv))
    );
    setIsApproved(true);
    alert(`Success! Invoice ${invoice.id} approved and officially released to Zenith Systems.`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Finance Line-Item Audit
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            {invoice.id} — {invoice.client}
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Billing Period: {invoice.period} • Generated: {invoice.generatedDate} • Due: {invoice.dueDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-bold ${
              isApproved ? 'bg-[#e7f5ed] text-[#1e8a5f]' : 'bg-[#fff4e5] text-[#c77800]'
            }`}
          >
            {isApproved ? 'Approved & Released' : invoice.status}
          </span>

          <button
            onClick={() => setCurrentScreen('invoices')}
            className="text-xs text-[#747878] hover:text-[#161616] font-semibold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Invoices</span>
          </button>
        </div>
      </div>

      {/* Two Column Section: Line Items & Totals Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itemized Line Items Table */}
        <div className="lg:col-span-8 bg-white border border-[#3a3a3a] p-6 space-y-6">
          <div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616] mb-1">
              Itemized Billing Schedule
            </h3>
            <p className="text-xs text-[#747878]">Contracted desks, conference room overage, and pro-rata items</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-bold font-['Space_Grotesk']">Description</th>
                  <th className="p-3 font-bold font-['Space_Grotesk'] text-center">Qty / Desks</th>
                  <th className="p-3 font-bold font-['Space_Grotesk'] text-right">Unit Rate (₹)</th>
                  <th className="p-3 font-bold font-['Space_Grotesk'] text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e0]">
                {invoice.lineItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8f7f5]">
                    <td className="p-3 font-medium text-[#161616]">{item.desc}</td>
                    <td className="p-3 text-center font-semibold">{item.qty}</td>
                    <td className="p-3 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-['Space_Grotesk'] font-bold text-[#161616]">
                      ₹{item.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Adjustments Reason Input */}
          <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] text-xs space-y-2">
            <label className="block font-bold text-[#161616]">
              Apply Commercial Adjustment / Credit Memo
            </label>
            <input
              type="text"
              placeholder="Enter approved justification / reason for deduction or waiver..."
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e3e2e0] focus:border-[#f5b400] outline-none text-xs"
            />
          </div>
        </div>

        {/* Right Column: Financial Summary Totals Card */}
        <div className="lg:col-span-4 bg-white border border-[#3a3a3a] p-6 flex flex-col justify-between">
          <div className="space-y-4 text-xs">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616] border-b border-[#e3e2e0] pb-2">
              Financial Breakdown
            </h3>

            <div className="flex justify-between py-1 text-[#444748]">
              <span>Recurring Seat Charges:</span>
              <span className="font-bold font-mono text-[#161616]">₹{invoice.seatsAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1 text-[#444748]">
              <span>Meeting Room Overage:</span>
              <span className="font-bold font-mono text-[#161616]">₹{invoice.overageAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1 text-[#444748]">
              <span>Subtotal:</span>
              <span className="font-bold font-mono text-[#161616]">₹{invoice.amount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1 text-[#444748]">
              <span>GST @ 18% (CGST 9% + SGST 9%):</span>
              <span className="font-bold font-mono text-[#161616]">₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 border-t-2 border-[#161616] text-base font-bold">
              <span>Grand Total:</span>
              <span className="font-['Space_Grotesk'] text-xl text-[#161616]">
                ₹{invoice.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e3e2e0] space-y-2 mt-6">
            {!isApproved ? (
              <button
                onClick={handleApproveAndRelease}
                className="w-full py-3.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-sm hover:bg-[#ffdea4] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Approve & Release to Client</span>
                <span className="material-symbols-outlined text-base">check_circle</span>
              </button>
            ) : (
              <div className="w-full text-center py-2.5 bg-[#e7f5ed] text-[#1e8a5f] font-bold text-xs">
                ✓ Released to Client Self-Service Portal
              </div>
            )}

            <button
              onClick={() => alert('Change request dispatched back to Branch Admin billing desk.')}
              className="w-full py-2 bg-[#f4f3f1] text-[#747878] font-bold text-xs hover:text-[#161616]"
            >
              Request Changes from Branch Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
