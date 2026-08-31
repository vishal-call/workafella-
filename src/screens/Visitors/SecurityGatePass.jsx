import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SecurityGatePass = () => {
  const { visitors, setVisitors, activeBranch } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [scannedMessage, setScannedMessage] = useState(null);

  const handleCheckIn = (id) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors(
      visitors.map((v) => (v.id === id ? { ...v, status: 'Checked In', checkInTime: timeNow } : v))
    );
    setScannedMessage('Check-in confirmed. Turnstile barrier unlatched.');
    setTimeout(() => setScannedMessage(null), 3000);
  };

  const handleCheckOut = (id) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors(
      visitors.map((v) => (v.id === id ? { ...v, status: 'Checked Out', checkOutTime: timeNow } : v))
    );
    setScannedMessage('Check-out recorded. Pass deactivated.');
    setTimeout(() => setScannedMessage(null), 3000);
  };

  const handleSimulateScan = () => {
    const target = visitors.find((v) => v.status === 'Expected');
    if (target) {
      handleCheckIn(target.id);
    } else {
      alert('All active visitors in queue are already checked in!');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Front-Desk Security Kiosk Banner */}
      <div className="bg-[#161616] text-white p-6 border-2 border-[#3a3a3a] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#f5b400] font-bold">
            Front Desk Turnstile Terminal • {activeBranch.name}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mt-1">
            Gate Pass Execution & Scanner
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Scan visitor QR passes or search pass token reference for rapid entry clearance.
          </p>
        </div>

        {/* Big QR Scanner Simulation Trigger */}
        <button
          onClick={handleSimulateScan}
          className="px-6 py-3.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-sm hover:bg-[#ffdea4] transition-colors flex items-center gap-2 shadow-xl"
        >
          <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
          <span>Simulate QR Turnstile Scan</span>
        </button>
      </div>

      {scannedMessage && (
        <div className="p-4 bg-[#e7f5ed] border-2 border-[#1e8a5f] text-[#1e8a5f] font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined">verified</span>
          <span>{scannedMessage}</span>
        </div>
      )}

      {/* Quick Search */}
      <div className="bg-white border border-[#3a3a3a] p-4 flex gap-3">
        <input
          type="text"
          placeholder="Search by Visitor Name, Company or QR Code (e.g. WF-QR-889021)..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="flex-1 text-xs px-3.5 py-2 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none"
        />
      </div>

      {/* Live Expected & Active Visitor Cards Queue */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
            Today's Visitors Queue ({visitors.length})
          </h2>
          <span className="text-xs text-[#747878] font-bold">Real-Time Access Sync</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visitors
            .filter((v) =>
              searchCode
                ? v.name.toLowerCase().includes(searchCode.toLowerCase()) ||
                  v.company.toLowerCase().includes(searchCode.toLowerCase()) ||
                  v.qrCode.toLowerCase().includes(searchCode.toLowerCase())
                : true
            )
            .map((vis) => {
              const isExpected = vis.status === 'Expected';
              const isCheckedIn = vis.status === 'Checked In';
              const isCheckedOut = vis.status === 'Checked Out';

              return (
                <div
                  key={vis.id}
                  className={`bg-white border-2 p-5 relative transition-all ${
                    isExpected
                      ? 'border-[#f5b400] shadow-sm'
                      : isCheckedIn
                      ? 'border-[#1e8a5f]'
                      : 'border-[#e3e2e0] opacity-75'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-['Space_Grotesk'] font-bold text-base text-[#161616]">
                        {vis.name}
                      </div>
                      <div className="text-xs text-[#747878] font-medium">{vis.company}</div>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold ${
                        isExpected
                          ? 'bg-[#fff4e5] text-[#c77800]'
                          : isCheckedIn
                          ? 'bg-[#e7f5ed] text-[#1e8a5f]'
                          : 'bg-[#f4f3f1] text-[#747878]'
                      }`}
                    >
                      {vis.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#444748] space-y-1 my-3 bg-[#f8f7f5] p-3 border border-[#e3e2e0]">
                    <div>
                      <span className="text-[#747878]">Host:</span> <strong>{vis.host}</strong>
                    </div>
                    <div>
                      <span className="text-[#747878]">Slot:</span> {vis.timeSlot}
                    </div>
                    <div>
                      <span className="text-[#747878]">Purpose:</span> {vis.purpose}
                    </div>
                    <div className="font-mono text-[11px] text-[#7b5900] font-bold pt-1">
                      Pass Token: {vis.qrCode}
                    </div>
                    {vis.checkInTime && (
                      <div className="text-[11px] text-[#1e8a5f] font-semibold">
                        Checked in at: {vis.checkInTime}
                      </div>
                    )}
                    {vis.checkOutTime && (
                      <div className="text-[11px] text-[#747878]">
                        Checked out at: {vis.checkOutTime}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {isExpected && (
                      <button
                        onClick={() => handleCheckIn(vis.id)}
                        className="w-full py-2 bg-[#161616] text-[#f5b400] font-bold text-xs hover:bg-[#2f3130] flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">login</span>
                        <span>Confirm Check In</span>
                      </button>
                    )}

                    {isCheckedIn && (
                      <button
                        onClick={() => handleCheckOut(vis.id)}
                        className="w-full py-2 bg-[#c4432b] text-white font-bold text-xs hover:bg-[#93000a] flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span>Log Check Out</span>
                      </button>
                    )}

                    {isCheckedOut && (
                      <div className="w-full text-center py-1.5 text-[11px] text-[#747878] font-bold bg-[#f4f3f1]">
                        Visit Completed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
