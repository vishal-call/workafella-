import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room360TourModal } from '../../components/Room360TourModal';
import { soundFx } from '../../utils/audioEffects';

export const MeetingRoomGallery = () => {
  const { meetingRooms, activeBranch, startRoomHold, clientWallet } = useApp();

  const [selectedDate, setSelectedDate] = useState('2026-08-30');
  const [selectedRoom, setSelectedRoom] = useState(meetingRooms[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [attendees, setAttendees] = useState(8);
  const [tourRoom, setTourRoom] = useState(null);

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM'
  ];

  const durationHours = 1;
  const remainingHours = clientWallet?.remainingHours ?? 27;
  const monthlyQuota = clientWallet?.monthlyQuota ?? 45;
  const isEntitlementCovered = remainingHours >= durationHours;
  const billableAmount = isEntitlementCovered ? 0 : durationHours * (selectedRoom?.hourlyRate || 2500);

  const handlePlaceHold = () => {
    soundFx.playLock();
    startRoomHold(selectedRoom, {
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      durationHours,
      attendees,
      entitlementHours: isEntitlementCovered ? durationHours : 0,
      billableAmount
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Client Self-Service • Room Reservations
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Meeting Rooms & Event Spaces
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Browse conference suites, check real-time day slots, inspect 360° lighting ambience, and place 5-minute temporary holds at {activeBranch.name}.
          </p>
        </div>

        {/* Free Entitlement Hours Balance Pill */}
        <div className="bg-[#161616] text-white px-5 py-3 rounded-2xl flex items-center gap-3 border border-[#3a3a3a] shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-[#f5b400] text-[#161616] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#858383] font-semibold">
              Monthly Entitlement Wallet
            </div>
            <div className="font-['Space_Grotesk'] font-mono tabular-nums text-lg font-bold text-[#f5b400]">
              {remainingHours} / {monthlyQuota} Hours Free
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Gallery Cards & Booking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Room Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {meetingRooms.map((room) => {
            const isSelected = selectedRoom.id === room.id;
            return (
              <div
                key={room.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedRoom(room);
                }}
                className={`border rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 luxury-card group flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-[#f5b400] ring-4 ring-[#f5b400]/20 shadow-xl'
                    : 'border-[#e3e2e0] bg-white hover:border-[#161616]'
                }`}
              >
                <div className="h-48 relative overflow-hidden bg-black">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                    ₹{room.hourlyRate}/hr
                  </div>

                  {/* 360° Ambience Virtual Tour Quick Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playClick();
                      setTourRoom(room);
                    }}
                    className="absolute top-3 left-3 bg-[#161616]/80 hover:bg-[#f5b400] hover:text-[#161616] text-[#f5b400] backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-md"
                    title="Open 360° Virtual Tour & Lighting Visualizer"
                  >
                    <span className="material-symbols-outlined text-sm">360</span>
                    <span>360° Tour</span>
                  </button>

                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-bold text-[#f5b400] uppercase tracking-wider block">
                      {room.type}
                    </span>
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold leading-tight">
                      {room.name}
                    </h3>
                  </div>
                </div>

                {/* Details Bar */}
                <div className="p-4 bg-white flex items-center justify-between text-xs border-t border-[#e3e2e0]">
                  <div className="flex items-center gap-1.5 text-[#444748]">
                    <span className="material-symbols-outlined text-sm text-[#7b5900]">group</span>
                    <span>Cap: {room.capacity} Persons</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#444748]">
                    <span className="material-symbols-outlined text-sm text-[#7b5900]">layers</span>
                    <span>{room.floor}</span>
                  </div>
                  <span
                    className={`font-bold px-3 py-1 rounded-full text-[10px] transition-colors ${
                      isSelected ? 'bg-[#f5b400] text-[#161616] shadow-sm' : 'bg-[#f4f3f1] text-[#747878]'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Room'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Time Slot Picker & 5-Min Hold Trigger */}
        <div className="lg:col-span-4 bg-white border border-[#e3e2e0] rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#e3e2e0] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7b5900]">
                Reservation Configuration
              </span>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                {selectedRoom.name}
              </h3>
              <p className="text-xs text-[#747878] mt-0.5">{selectedRoom.centre} • {selectedRoom.floor}</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#161616] mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-1">Expected Attendees</label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoom.capacity}
                  value={attendees}
                  onChange={(e) => setAttendees(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-2">Available Time Slots</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => {
                    const isSlotActive = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedTimeSlot(slot);
                        }}
                        className={`p-2.5 text-center text-xs font-semibold rounded-xl border transition-all ${
                          isSlotActive
                            ? 'border-2 border-[#f5b400] bg-[#fffbf2] text-[#161616] font-bold shadow-sm'
                            : 'border-[#e3e2e0] bg-[#f8f7f5] text-[#444748] hover:border-[#161616]'
                        }`}
                      >
                        {slot.split('-')[0].trim()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & 5-Minute Hold Action */}
          <div className="space-y-4 pt-4 border-t border-[#e3e2e0]">
            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] rounded-2xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#747878]">Booking Duration:</span>
                <span className="font-bold text-[#161616]">{durationHours} Hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#747878]">Entitlement Hours:</span>
                <span className="font-bold text-[#1e8a5f]">
                  {isEntitlementCovered ? '1 Hour Free (Covered)' : '0 Hours Free (Exhausted)'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#e3e2e0] text-sm font-bold">
                <span className="text-[#161616]">Amount to Charge:</span>
                <span className="font-['Space_Grotesk'] font-mono tabular-nums text-base text-[#161616]">
                  ₹{billableAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceHold}
              className="w-full py-3.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdea4] rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Place 5-Minute Temporary Hold</span>
              <span className="material-symbols-outlined text-base">lock_clock</span>
            </button>
          </div>
        </div>
      </div>

      {/* 360 Virtual Tour & Lighting Visualizer Modal */}
      <Room360TourModal
        room={tourRoom}
        onClose={() => setTourRoom(null)}
        onPlaceHold={() => {
          setSelectedRoom(tourRoom);
          handlePlaceHold();
        }}
      />
    </div>
  );
};
