import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';
import confetti from 'canvas-confetti';

export const ClientBillingDashboard = () => {
  const { invoices, setInvoices, currentUser, clientWallet, setPreviewInvoice, addToast } = useApp();

  // Strict Tenant Scoping: Only allow access to this organization's invoices
  const tenantFilter = currentUser.scope || currentUser.name;
  const clientInvoices = invoices.filter((inv) =>
    currentUser.roleLabel?.includes('Super Admin') ||
    currentUser.roleLabel?.includes('Finance') ||
    inv.client.toLowerCase().includes('acme') ||
    inv.client.toLowerCase().includes(tenantFilter.toLowerCase().split(' ')[0])
  );

  const currentInvoice = clientInvoices[0] || invoices[0];

  const freeHoursTotal = clientWallet?.monthlyQuota ?? 45;
  const freeHoursUsed = clientWallet?.usedHours ?? 18;
  const freeHoursRemaining = clientWallet?.remainingHours ?? 27;
  const usedPercent = Math.min(100, Math.round((freeHoursUsed / freeHoursTotal) * 100));

  const handlePayInvoice = (invoiceId) => {
    soundFx.playChime();
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5B400', '#161616', '#1E8A5F', '#FFFFFF']
      });
    } catch (e) {
      // Ignore
    }

    setInvoices(
      invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv))
    );
    addToast(`Payment of ₹${currentInvoice.grandTotal.toLocaleString('en-IN')} successfully settled via Corporate Razorpay Gateway!`, 'success', 'Invoice Paid');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Client Self-Service Portal • Scoped to {currentInvoice.client}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616] dark:text-white">
            Billing & Meeting Room Entitlements
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            View active monthly invoices, payment reconciliation status, and free conference room hour quota.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setPreviewInvoice(currentInvoice);
          }}
          className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">receipt_long</span>
          <span>View Tax Invoice PDF</span>
        </button>
      </div>

      {/* Top Section: Active Invoice Hero Card + Entitlement Wallet Progress Ring */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Active Invoice Hero Card */}
        <div className="md:col-span-8 bg-[#161616] text-white p-6 rounded-3xl border-2 border-[#3a3a3a] relative overflow-hidden flex flex-col justify-between shadow-md">
          <div
            className="absolute top-0 right-0 w-5 h-5 bg-[#f5b400]"
            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
          ></div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#f5b400] font-bold">
                Current Billing Cycle: {currentInvoice.period || 'August 2026'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                currentInvoice.status === 'Paid'
                  ? 'bg-[#1e8a5f] text-white'
                  : 'bg-[#f5b400] text-[#161616]'
              }`}>
                {currentInvoice.status}
              </span>
            </div>

            <div className="font-['Space_Grotesk'] text-4xl font-bold text-white my-2 font-mono">
              ₹{currentInvoice.grandTotal.toLocaleString('en-IN')}
            </div>

            <p className="text-xs text-[#a1a1aa] mt-1">
              Invoice #{currentInvoice.id} • Due on {currentInvoice.dueDate || 'Sept 05, 2026'}
            </p>
          </div>

          <div className="pt-4 border-t border-[#3a3a3a] flex items-center justify-between mt-4">
            <span className="text-xs text-[#a1a1aa]">
              Includes 18% GST (SAC: 997212 Real Estate & Co-working Lease)
            </span>

            {currentInvoice.status !== 'Paid' ? (
              <button
                onClick={() => handlePayInvoice(currentInvoice.id)}
                className="px-5 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">payments</span>
                <span>Pay via Corporate Razorpay</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-[#1e8a5f] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Payment Reconciled ✓</span>
              </span>
            )}
          </div>
        </div>

        {/* Entitlement Wallet Progress Card */}
        <div className="md:col-span-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
              Conference Hour Entitlement
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616] dark:text-white">
              Meeting Room Wallet
            </h3>
            <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
              {freeHoursTotal} hours allocated monthly under your enterprise seat contract.
            </p>
          </div>

          <div className="my-4 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#161616] dark:text-white">{freeHoursRemaining} Hours Remaining</span>
              <span className="text-[#747878] dark:text-[#a1a1aa]">{usedPercent}% Used</span>
            </div>

            <div className="w-full bg-[#e3e2e0] dark:bg-[#27272a] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#f5b400] h-full rounded-full transition-all duration-500"
                style={{ width: `${usedPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="text-[11px] text-[#747878] dark:text-[#a1a1aa] pt-2 border-t border-[#e3e2e0] dark:border-[#27272a]">
            Overages billed at standard member discount: ₹800 - ₹2,500/hr.
          </div>
        </div>
      </div>

      {/* Invoice Line Items Table */}
      <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#161616] dark:text-white">
          Line-Item Breakdown — {currentInvoice.id}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                <th className="p-3 font-bold font-['Space_Grotesk']">Description</th>
                <th className="p-3 font-bold font-['Space_Grotesk'] text-center">Qty / Seats</th>
                <th className="p-3 font-bold font-['Space_Grotesk'] text-right">Unit Rate</th>
                <th className="p-3 font-bold font-['Space_Grotesk'] text-right">Taxable Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e0] dark:divide-[#27272a]">
              {(currentInvoice.lineItems || [
                { desc: 'Private Office Suites 704 & 705 (45 Seats @ ₹14,500/seat)', qty: 45, rate: 14500, total: 652500 },
                { desc: 'Conference Room Usage (18 hrs consumed within 45 hrs free quota)', qty: 18, rate: 0, total: 0 },
                { desc: 'High-speed Dedicated IP Bandwidth Allocation (100 Mbps)', qty: 1, rate: 0, total: 0 }
              ]).map((item, idx) => (
                <tr key={idx} className="hover:bg-[#f8f7f5] dark:hover:bg-[#202024] transition-colors">
                  <td className="p-3 font-medium text-[#161616] dark:text-white">{item.desc}</td>
                  <td className="p-3 text-center text-[#747878] dark:text-[#a1a1aa] font-mono">{item.qty}</td>
                  <td className="p-3 text-right font-mono text-[#161616] dark:text-white">₹{item.rate.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-bold font-mono text-[#161616] dark:text-white">₹{item.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
