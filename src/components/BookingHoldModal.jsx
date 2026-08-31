import React from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const BookingHoldModal = () => {
  const { activeHold, holdSecondsRemaining, releaseRoomHold, confirmRoomBooking, currentUser } = useApp();

  if (!activeHold) return null;

  const minutes = Math.floor(holdSecondsRemaining / 60);
  const seconds = holdSecondsRemaining % 60;
  const isUrgent = holdSecondsRemaining < 60;

  const activeTrianglesCount = Math.max(1, Math.ceil(holdSecondsRemaining / 60));

  const handleConfirm = () => {
    // Confetti celebration burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5B400', '#161616', '#FAF9F7', '#1E8A5F']
      });
    } catch (e) {
      // Fallback
    }

    const newBooking = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      room: activeHold.room.name,
      location: `${activeHold.room.floor || 'Floor 7'}, Executive Wing`,
      client: currentUser.name.includes('Acme') ? 'Acme Innovations Pvt Ltd' : currentUser.name,
      host: currentUser.name,
      date: activeHold.date,
      timeSlot: activeHold.timeSlot,
      durationHours: activeHold.durationHours,
      attendees: activeHold.attendees,
      isEntitlementUsed: activeHold.entitlementHours > 0,
      entitlementHours: activeHold.entitlementHours,
      billableAmount: activeHold.billableAmount,
      status: 'Confirmed',
      type: activeHold.entitlementHours > 0 ? 'internal' : 'external',
      amenities: activeHold.room.amenities || ['Crestron 4K Dual Displays', 'Dolby Soundbar', 'Barista Espresso & Tea Service', 'High-Speed Wi-Fi 6'],
      notes: `Executive conference reservation by ${currentUser.name} for ${activeHold.attendees} attendees.`
    };
    confirmRoomBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#faf9f7] border-2 border-[#161616] rounded-3xl shadow-2xl p-6 relative overflow-hidden animate-fade-in-up">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#e3e2e0] pb-4 mb-4">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900]">
              Temporary Reservation Lock
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616]">
              {activeHold.room.name}
            </h2>
          </div>

          <button
            onClick={releaseRoomHold}
            className="text-[#747878] hover:text-[#161616] p-1.5 rounded-full hover:bg-[#e3e2e0] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Countdown Box with Tabular-Nums Anti-Jitter */}
        <div className="bg-[#161616] text-white p-4 mb-5 rounded-2xl flex items-center justify-between shadow-sm border border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((idx) => {
                const isActive = idx <= activeTrianglesCount;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-sm transition-all duration-500 ${
                      isActive
                        ? isUrgent
                          ? 'bg-[#d9481e] animate-pulse'
                          : 'bg-[#f5b400]'
                        : 'border border-[#3a3a3a] bg-transparent'
                    }`}
                    style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                  ></div>
                );
              })}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#858383] font-semibold">
                Slot Held On Lock
              </div>
              <div className={`text-lg font-['Space_Grotesk'] font-bold font-mono tabular-nums ${isUrgent ? 'text-[#d9481e]' : 'text-[#f5b400]'}`}>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds} Remaining
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-[#a1a1aa] max-w-[140px] leading-tight">
            Confirm before the timer expires to lock your slot.
          </div>
        </div>

        {/* Details Card */}
        <div className="space-y-2.5 text-xs bg-white border border-[#e3e2e0] rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex justify-between py-1 border-b border-[#f4f3f1]">
            <span className="text-[#747878]">Centre & Floor:</span>
            <span className="font-semibold text-[#161616]">{activeHold.room.centre} ({activeHold.room.floor})</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f4f3f1]">
            <span className="text-[#747878]">Date & Time:</span>
            <span className="font-semibold text-[#161616]">{activeHold.date} • {activeHold.timeSlot}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f4f3f1]">
            <span className="text-[#747878]">Attendees:</span>
            <span className="font-semibold text-[#161616]">{activeHold.attendees} Persons (Cap: {activeHold.room.capacity})</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f4f3f1]">
            <span className="text-[#747878]">Entitlement Applied:</span>
            <span className="font-bold text-[#1e8a5f] bg-[#e7f5ed] px-2.5 py-0.5 rounded-full ring-1 ring-inset ring-emerald-600/20">
              {activeHold.entitlementHours} Hours Free (Wallet)
            </span>
          </div>
          <div className="flex justify-between py-1 text-sm pt-2">
            <span className="font-bold text-[#161616]">Projected Billable Amount:</span>
            <span className="font-bold font-['Space_Grotesk'] font-mono tabular-nums text-base text-[#161616]">
              ₹{activeHold.billableAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={releaseRoomHold}
            className="text-xs text-[#747878] hover:text-[#161616] underline font-medium px-2 py-1"
          >
            Release Hold & Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-sm hover:bg-[#ffdea4] rounded-xl transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Confirm & Lock Booking</span>
            <span className="material-symbols-outlined text-base">check_circle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
