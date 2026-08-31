import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisitorQRModal } from '../../components/VisitorQRModal';

export const VisitorPreRegistration = () => {
  const { visitors, setVisitors, currentUser, activeBranch, setCurrentScreen } = useApp();
  const [createdVisitor, setCreatedVisitor] = useState(null);

  const [form, setForm] = useState({
    name: 'Siddharth Varma',
    phone: '+91 98490 88776',
    email: 'siddharth.v@matrixpartners.in',
    company: 'Matrix Partners India',
    host: currentUser.name,
    date: '2026-08-30',
    timeSlot: '03:00 PM - 04:30 PM',
    purpose: 'Series B Board Sync'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVis = {
      id: `VIS-${Date.now().toString().slice(-4)}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      company: form.company,
      host: form.host,
      date: form.date,
      timeSlot: form.timeSlot,
      purpose: form.purpose,
      qrCode: `WF-QR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Expected',
      checkInTime: null,
      checkOutTime: null,
      isWatchlisted: false
    };

    setVisitors([newVis, ...visitors]);
    setCreatedVisitor(newVis);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Front Desk & Access Control
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Pre-register a Visitor
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Generate an instant, signed digital gate-pass with a secure QR code sent to the guest.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('visitor_history')}
          className="text-xs text-[#747878] hover:text-[#161616] font-semibold flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">history</span>
          <span>View Visitor History</span>
        </button>
      </div>

      {/* Pre-Registration Form */}
      <div className="bg-white border border-[#3a3a3a] p-8 relative">
        {/* Top-Right Clipped Flag */}
        <div
          className="absolute -top-[1px] -right-[1px] w-4 h-4 bg-[#faf9f7] z-10"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        ></div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-[#161616] mb-1">Visitor Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Visitor Organization / Firm</label>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Phone Number (For SMS Gate Pass)</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Email Address (For QR Pass Delivery)</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Host Employee</label>
              <input
                type="text"
                required
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Visit Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Expected Time Window</label>
              <input
                type="text"
                required
                value={form.timeSlot}
                onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
                placeholder="e.g. 02:00 PM - 04:00 PM"
              />
            </div>

            <div>
              <label className="block font-bold text-[#161616] mb-1">Purpose of Visit</label>
              <input
                type="text"
                required
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
                placeholder="e.g. Client meeting, Interview, Delivery"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#e3e2e0] flex items-center justify-between">
            <span className="text-[11px] text-[#747878]">
              Automated pass issuance with 24-hr token TTL.
            </span>

            <button
              type="submit"
              className="px-8 py-3 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-sm hover:bg-[#ffdea4] transition-colors flex items-center gap-2 shadow-md"
            >
              <span>Issue Digital Gate Pass</span>
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </div>
        </form>
      </div>

      {/* Visitor QR Pass Confirmation Modal */}
      {createdVisitor && (
        <VisitorQRModal
          visitor={createdVisitor}
          onClose={() => {
            setCreatedVisitor(null);
            setCurrentScreen('visitor_history');
          }}
        />
      )}
    </div>
  );
};
