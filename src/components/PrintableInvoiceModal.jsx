'use client';

import React from 'react';

export const PrintableInvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const gst18 = Math.round(invoice.amount * 0.18);
  const totalWithTax = invoice.amount + gst18;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#ffffff] border-2 border-[#161616] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Modal Action Header */}
        <div className="p-4 bg-[#161616] text-white flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f5b400]">receipt_long</span>
            <span className="font-['Space_Grotesk'] text-sm font-bold">
              Official Tax Invoice Preview ({invoice.id})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#f5b400] text-[#161616] font-bold text-xs rounded-xl hover:bg-[#ffdea4] flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#858383] hover:text-white p-1 rounded-full hover:bg-[#2f3130] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Canvas */}
        <div className="p-8 overflow-y-auto bg-[#faf9f7] text-[#161616] space-y-6 text-xs print:p-0 print:bg-white">
          {/* Header Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-[#161616] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[#f5b400] rounded-sm flex items-center justify-center font-bold text-[#161616] text-xs">
                  WF
                </div>
                <span className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#161616]">
                  Workafella Co-Working Ltd
                </span>
              </div>
              <p className="text-[11px] text-[#747878] leading-tight max-w-sm">
                Corporate Office: Level 7, Western Aqua, Hitec City, Hyderabad - 500081<br />
                CIN: U70109TG2016PLC109823 • GSTIN: 36AAACW9988P1Z1
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-[#161616] text-[#f5b400] px-3 py-1 text-xs font-bold uppercase rounded-md tracking-wider mb-1">
                Original Tax Invoice
              </span>
              <div className="font-mono font-bold text-sm text-[#161616]">{invoice.id}</div>
              <div className="text-[11px] text-[#747878]">Date: {invoice.dueDate || '2026-08-01'}</div>
            </div>
          </div>

          {/* Bill To / Bill From Details */}
          <div className="grid grid-cols-2 gap-6 bg-white p-5 rounded-2xl border border-[#e3e2e0]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7b5900] tracking-wider block mb-1">
                Billed To (Client Enterprise)
              </span>
              <div className="font-bold text-sm text-[#161616]">{invoice.client}</div>
              <div className="text-[11px] text-[#444748] mt-1 leading-relaxed">
                Suite 704 & 705, Workafella Hitec City Campus<br />
                GSTIN: 36AABCN7788P1Z4 • PAN: AABCN7788P
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#7b5900] tracking-wider block mb-1">
                Billing Cycle & Terms
              </span>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span className="text-[#747878]">Billing Period:</span> <span className="font-semibold">August 2026 (Monthly)</span></div>
                <div className="flex justify-between"><span className="text-[#747878]">Payment Terms:</span> <span className="font-semibold">Net 15 Days</span></div>
                <div className="flex justify-between"><span className="text-[#747878]">Due Date:</span> <span className="font-bold text-[#ba1a1a]">Sept 05, 2026</span></div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="bg-white border border-[#e3e2e0] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-bold"># Description</th>
                  <th className="p-3 font-bold text-center">HSN/SAC</th>
                  <th className="p-3 font-bold text-center">Qty / Seats</th>
                  <th className="p-3 font-bold text-right">Unit Rate</th>
                  <th className="p-3 font-bold text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e0]">
                <tr>
                  <td className="p-3 font-semibold">
                    Private Office Suite 704 & 705 Workspace License
                    <div className="text-[10px] text-[#747878]">Includes 24/7 biometric access, high-speed leased line & power backup</div>
                  </td>
                  <td className="p-3 text-center font-mono">997212</td>
                  <td className="p-3 text-center font-bold">45 Desks</td>
                  <td className="p-3 text-right font-mono">₹14,500</td>
                  <td className="p-3 text-right font-bold font-mono">₹6,52,500</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">
                    Meeting Room Overage Charges (Beyond 45 hrs entitlement)
                    <div className="text-[10px] text-[#747878]">The Boardroom 7A (6 hours extra usage)</div>
                  </td>
                  <td className="p-3 text-center font-mono">997212</td>
                  <td className="p-3 text-center font-bold">6 Hours</td>
                  <td className="p-3 text-right font-mono">₹2,500</td>
                  <td className="p-3 text-right font-bold font-mono">₹15,000</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">
                    Dedicated High-Speed Static IP Allocation
                    <div className="text-[10px] text-[#747878]">Subnet /29 Enterprise VLAN</div>
                  </td>
                  <td className="p-3 text-center font-mono">998422</td>
                  <td className="p-3 text-center font-bold">1 Pool</td>
                  <td className="p-3 text-right font-mono">₹5,000</td>
                  <td className="p-3 text-right font-bold font-mono">₹5,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Calculation & Sign-off Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-white border border-[#e3e2e0] rounded-2xl flex flex-col justify-between">
              <div className="text-[11px] text-[#747878]">
                <strong>Bank Account Transfer Details:</strong><br />
                Bank: HDFC Bank Ltd • Branch: Hitec City<br />
                A/C No: 50200088992211 • IFSC: HDFC0000456
              </div>

              {/* Digital Verification Stamp */}
              <div className="mt-4 pt-3 border-t border-[#f4f3f1] flex items-center gap-3">
                <div className="w-12 h-12 bg-[#161616] text-[#f5b400] flex items-center justify-center rounded-lg text-[10px] font-bold font-mono">
                  QR-GST
                </div>
                <div className="text-[10px] text-[#1e8a5f] font-bold">
                  ✓ Digitally Signed & IRN Authenticated (GST Portal)
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#e3e2e0] rounded-2xl space-y-2 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-[#747878]">Taxable Subtotal:</span>
                <span className="font-bold">₹{invoice.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#747878]">CGST (9%):</span>
                <span>₹{(gst18 / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#747878]">SGST (9%):</span>
                <span>₹{(gst18 / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#161616] text-[#161616]">
                <span>Total Amount Due:</span>
                <span className="font-['Space_Grotesk'] text-base">₹{totalWithTax.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
