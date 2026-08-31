import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const InvoiceManagement = () => {
  const { invoices, setInvoices, setCurrentScreen, setPreviewInvoice, addToast } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);

  const toggleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((i) => i !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const handleBulkSend = () => {
    setInvoices(
      invoices.map((inv) =>
        selectedInvoices.includes(inv.id) ? { ...inv, status: 'Sent' } : inv
      )
    );
    addToast(`Dispatched ${selectedInvoices.length} invoices to client billing portals.`, 'success', 'Invoices Sent');
    setSelectedInvoices([]);
  };

  const filtered = filterStatus === 'All'
    ? invoices
    : invoices.filter((i) => i.status === filterStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Finance & Billing Operations
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Invoice Management & Review
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Automated monthly recurring seat billing, conference room overage rollups, and invoice release controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedInvoices.length > 0 && (
            <button
              onClick={handleBulkSend}
              className="px-4 py-2 bg-[#161616] text-[#f5b400] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#2f3130] rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Send Selected ({selectedInvoices.length})</span>
            </button>
          )}

          <button
            onClick={() => setCurrentScreen('invoice_review')}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">fact_check</span>
            <span>Batch Invoice Review</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e3e2e0] p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-all luxury-card">
          <div className="text-[11px] uppercase font-bold text-[#747878] mb-1">Total Receivables MTD</div>
          <div className="font-['Space_Grotesk'] font-mono tabular-nums text-3xl font-bold text-[#161616]">
            ₹{(totalOutstanding / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-[#747878] mt-1">Across 8 verified tenant accounts</div>
        </div>

        <div className="bg-white border border-[#e3e2e0] p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-all luxury-card">
          <div className="text-[11px] uppercase font-bold text-[#747878] mb-1">Ready for Release</div>
          <div className="font-['Space_Grotesk'] font-mono tabular-nums text-3xl font-bold text-[#1e8a5f]">
            {invoices.filter((i) => i.status === 'Approved').length} Invoices
          </div>
          <div className="text-xs text-[#1e8a5f] font-semibold mt-1">Audit reconciliation passed</div>
        </div>

        <div className="bg-white border border-[#e3e2e0] p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-all luxury-card">
          <div className="text-[11px] uppercase font-bold text-[#747878] mb-1">Pending Approval</div>
          <div className="font-['Space_Grotesk'] font-mono tabular-nums text-3xl font-bold text-[#c77800]">
            {invoices.filter((i) => i.status === 'Finance Review').length} Invoices
          </div>
          <div className="text-xs text-[#747878] mt-1">Meeting room overages require sign-off</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-[#e3e2e0] rounded-3xl p-6 shadow-sm space-y-4">
        {/* Table Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#e3e2e0]">
          <div className="flex items-center gap-2">
            {['All', 'Approved', 'Finance Review', 'Sent'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filterStatus === status
                    ? 'bg-[#161616] text-[#f5b400]'
                    : 'bg-[#f4f3f1] text-[#747878] hover:text-[#161616]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#747878] font-mono">
            Showing {filtered.length} invoice records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === invoices.length}
                    onChange={toggleSelectAll}
                    className="rounded-md border-[#747878] text-[#f5b400] focus:ring-0"
                  />
                </th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Invoice #</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Client Org</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Billing Centre</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Due Date</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Grand Total</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Status</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk'] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e0]">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#f8f7f5] transition-colors">
                  <td className="p-3.5">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(inv.id)}
                      onChange={() => toggleSelectOne(inv.id)}
                      className="rounded-md border-[#747878] text-[#f5b400] focus:ring-0"
                    />
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#7b5900]">{inv.id}</td>
                  <td className="p-3.5 font-bold text-[#161616]">{inv.client}</td>
                  <td className="p-3.5 text-[#444748]">{inv.centre}</td>
                  <td className="p-3.5 text-[#747878] font-mono">{inv.dueDate}</td>
                  <td className="p-3.5 font-['Space_Grotesk'] font-mono tabular-nums font-bold text-sm text-[#161616]">
                    ₹{inv.grandTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ring-1 ring-inset ${
                        inv.status === 'Approved'
                          ? 'bg-[#e7f5ed] text-[#1e8a5f] ring-emerald-600/20'
                          : inv.status === 'Finance Review'
                          ? 'bg-[#fff4e5] text-[#c77800] ring-amber-600/20'
                          : 'bg-[#f4f3f1] text-[#161616] ring-gray-600/20'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => setPreviewInvoice({ id: inv.id, client: inv.client, amount: inv.grandTotal, dueDate: inv.dueDate })}
                      className="px-3 py-1 bg-white border border-[#e3e2e0] text-[#161616] font-bold text-[11px] hover:border-[#f5b400] rounded-lg shadow-xs transition-colors"
                      title="Preview Printable Tax Invoice"
                    >
                      View Invoice
                    </button>
                    <button
                      onClick={() => setCurrentScreen('invoice_review')}
                      className="px-3 py-1 bg-[#161616] text-[#f5b400] font-bold text-[11px] hover:bg-[#2f3130] rounded-lg shadow-xs transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
