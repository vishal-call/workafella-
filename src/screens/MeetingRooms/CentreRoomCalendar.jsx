import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const CentreRoomCalendar = () => {
  const { bookings, setBookings, meetingRooms, activeBranch, currentUser, addToast, clientWallet, setClientWallet } = useApp();
  const [selectedView, setSelectedView] = useState('Month View');
  const [filterRoom, setFilterRoom] = useState('All Rooms');
  const [activeBookingModal, setActiveBookingModal] = useState(null);
  const [quickBookSlot, setQuickBookSlot] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState(meetingRooms[0]?.name || 'The Boardroom 7A');
  const [quickAttendees, setQuickAttendees] = useState(8);
  const [quickAgenda, setQuickAgenda] = useState('');

  // Active Date State (Default: August 30, 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 30));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (7 = August, 8 = September)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const hours = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM'
  ];

  // Navigation Handlers
  const handlePrev = () => {
    soundFx.playClick();
    if (selectedView === 'Month View') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (selectedView === 'Week View') {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    } else {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (selectedView === 'Month View') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (selectedView === 'Week View') {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    } else {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };

  const handleToday = () => {
    soundFx.playClick();
    setCurrentDate(new Date(2026, 7, 30));
  };

  // Helper to format Date to 'YYYY-MM-DD'
  const formatDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Compute Days for Month Grid (Mon-Sun)
  const getMonthGridDays = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Monday-based day of week (0 for Mon, 6 for Sun)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        dateStr: formatDateStr(d),
        dayNum: d.getDate(),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        dateStr: formatDateStr(d),
        dayNum: i,
        isCurrentMonth: true
      });
    }

    // Next month padding to fill complete grid of 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        dateStr: formatDateStr(d),
        dayNum: i,
        isCurrentMonth: false
      });
    }

    return days;
  };

  // Compute Days for Current Week (Mon to Sun)
  const getWeekDays = () => {
    const curr = new Date(currentDate);
    let dayOfWeek = curr.getDay() - 1;
    if (dayOfWeek === -1) dayOfWeek = 6;

    const monday = new Date(curr);
    monday.setDate(curr.getDate() - dayOfWeek);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push({
        date: d,
        label: `${dayNamesShort[i]}, ${monthNames[d.getMonth()].slice(0, 3)} ${String(d.getDate()).padStart(2, '0')}`,
        dateStr: formatDateStr(d)
      });
    }
    return week;
  };

  // Bookings filtering helpers
  const getBookingsForDate = (dateStr) => {
    return bookings.filter((b) => {
      if (filterRoom !== 'All Rooms' && b.room !== filterRoom) return false;
      return (b.date || '').toLowerCase() === dateStr.toLowerCase();
    });
  };

  const getBookingsForCell = (dayObj, hour) => {
    return bookings.filter((b) => {
      if (filterRoom !== 'All Rooms' && b.room !== filterRoom) return false;

      const bDate = (b.date || '').toLowerCase();
      const targetDateStr = dayObj.dateStr.toLowerCase();
      if (bDate !== targetDateStr) return false;

      const bSlot = (b.timeSlot || '').toUpperCase();
      const targetHour = hour.toUpperCase();
      const targetPrefix = targetHour.split(' ')[0];
      const targetAmPm = targetHour.split(' ')[1];

      return (
        bSlot.startsWith(targetHour) ||
        bSlot.startsWith(targetPrefix) ||
        (bSlot.includes(targetPrefix) && bSlot.includes(targetAmPm))
      );
    });
  };

  const handleCancelBooking = (bookingId) => {
    soundFx.playChime();
    const targetBooking = bookings.find((b) => b.id === bookingId);
    const restoredHours = targetBooking?.entitlementHours || (targetBooking?.isEntitlementUsed ? targetBooking?.durationHours || 2 : 0);

    if (restoredHours > 0 && setClientWallet) {
      setClientWallet((prev) => ({
        ...prev,
        usedHours: Math.max(0, prev.usedHours - restoredHours),
        remainingHours: prev.remainingHours + restoredHours
      }));
    }

    setBookings(bookings.filter((b) => b.id !== bookingId));
    addToast(
      `Reservation #${bookingId} released.${restoredHours > 0 ? ` Restored ${restoredHours} hrs to client entitlement wallet.` : ''}`,
      'info',
      'Booking Cancelled'
    );
    setActiveBookingModal(null);
  };

  const handleQuickBookSubmit = (e) => {
    e.preventDefault();
    soundFx.playChime();

    const targetRoomObj = meetingRooms.find((r) => r.name === selectedRoomName) || meetingRooms[0];

    const newBooking = {
      id: `BK-${Math.floor(8000 + Math.random() * 1000)}`,
      room: selectedRoomName,
      location: `${targetRoomObj?.floor || 'Floor 7'}, Executive Wing`,
      client: currentUser.name.includes('Acme') ? 'Acme Innovations Pvt Ltd' : currentUser.name,
      host: currentUser.name,
      date: quickBookSlot.dateStr || formatDateStr(currentDate),
      timeSlot: `${quickBookSlot.hour || '10:00 AM'} - ${(quickBookSlot.hour || '10:00 AM').replace('09', '10').replace('10', '11').replace('11', '12').replace('12', '01').replace('01', '02').replace('02', '03').replace('03', '04').replace('04', '05').replace('05', '06')}`,
      durationHours: 1,
      attendees: Number(quickAttendees) || 8,
      isEntitlementUsed: true,
      entitlementHours: 1,
      billableAmount: 0,
      status: 'Confirmed',
      type: 'internal',
      amenities: targetRoomObj?.amenities || ['Crestron 4K Dual Displays', 'Dolby Soundbar', 'Barista Espresso & Tea Service', 'High-Speed Wi-Fi 6'],
      notes: quickAgenda || `Conference reservation by ${currentUser.name} for ${quickAttendees} attendees.`
    };

    setBookings([newBooking, ...bookings]);
    addToast(`Reserved ${selectedRoomName} for ${quickBookSlot.label || quickBookSlot.dateStr} at ${quickBookSlot.hour || '10:00 AM'}!`, 'success', 'Room Reserved');
    setQuickBookSlot(null);
    setQuickAgenda('');
  };

  const weekDays = getWeekDays();
  const monthGridDays = getMonthGridDays();

  // Header Title String based on View
  const getHeaderTitle = () => {
    if (selectedView === 'Month View') {
      return `${monthNames[month]} ${year}`;
    } else if (selectedView === 'Week View') {
      const first = weekDays[0].date;
      const last = weekDays[6].date;
      return `${monthNames[first.getMonth()].slice(0, 3)} ${first.getDate()} – ${monthNames[last.getMonth()].slice(0, 3)} ${last.getDate()}, ${year}`;
    } else {
      return `${dayNamesShort[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}, ${monthNames[month]} ${currentDate.getDate()}, ${year}`;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Operations & Facility Management • {activeBranch.city}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616] dark:text-white">
            Centre-Wide Room Booking Calendar
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Real-time live synchronization across all meeting spaces at {activeBranch.name} • Internal client and guest reservations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl p-1 text-xs font-bold">
            {['Day View', 'Week View', 'Month View'].map((v) => (
              <button
                key={v}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedView(v);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedView === v
                    ? 'bg-[#161616] dark:bg-[#f5b400] text-[#f5b400] dark:text-[#161616] shadow-sm'
                    : 'text-[#747878] dark:text-[#a1a1aa]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setQuickBookSlot({ label: formatDateStr(currentDate), dateStr: formatDateStr(currentDate), hour: '10:00 AM' });
            }}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Manual Booking</span>
          </button>
        </div>
      </div>

      {/* Date Navigation & Room Filter Bar */}
      <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm">
        {/* Month / Week / Day Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl p-1 shadow-xs">
            <button
              onClick={handlePrev}
              title="Previous"
              className="p-1.5 hover:bg-white dark:hover:bg-[#17181a] rounded-lg transition-colors text-[#161616] dark:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>

            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-[#161616] dark:text-white hover:bg-white dark:hover:bg-[#17181a] rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>

            <button
              onClick={handleNext}
              title="Next"
              className="p-1.5 hover:bg-white dark:hover:bg-[#17181a] rounded-lg transition-colors text-[#161616] dark:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

          <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f5b400]">calendar_month</span>
            <span>{getHeaderTitle()}</span>
          </h2>
        </div>

        {/* Room Filter & Legend */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#161616] dark:text-white">Filter Room:</span>
            <select
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="px-3.5 py-1.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl font-medium outline-none text-[#161616] dark:text-white cursor-pointer"
            >
              <option>All Rooms</option>
              {meetingRooms.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#f5b400] border border-[#161616]"></span>
              <span className="text-[#161616] dark:text-white">Internal Entitlement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#27272a] border border-[#161616]"></span>
              <span className="text-[#747878] dark:text-[#a1a1aa]">External Overage</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: FULL MONTH VIEW GRID */}
      {selectedView === 'Month View' && (
        <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl overflow-hidden shadow-sm">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-[#3a3a3a] bg-[#161616] text-white text-center py-3 text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider">
            {dayNamesShort.map((day) => (
              <div key={day} className="text-[#f5b400]">
                {day}
              </div>
            ))}
          </div>

          {/* Month Matrix Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#e3e2e0] dark:divide-[#27272a]">
            {monthGridDays.map((dObj, idx) => {
              const dayBookings = getBookingsForDate(dObj.dateStr);
              const isToday = dObj.dateStr === '2026-08-30';

              return (
                <div
                  key={idx}
                  onClick={() => {
                    soundFx.playClick();
                    setQuickBookSlot({
                      label: `${monthNames[dObj.date.getMonth()]} ${dObj.dayNum}, ${dObj.date.getFullYear()}`,
                      dateStr: dObj.dateStr,
                      hour: '10:00 AM'
                    });
                  }}
                  className={`min-h-[120px] sm:min-h-[140px] p-2 flex flex-col justify-between transition-colors relative cursor-pointer group ${
                    dObj.isCurrentMonth
                      ? 'bg-white dark:bg-[#17181a] hover:bg-[#faf9f7] dark:hover:bg-[#202024]/50'
                      : 'bg-[#faf9f7] dark:bg-[#131416] opacity-40'
                  } ${isToday ? 'ring-2 ring-inset ring-[#f5b400] bg-[#fffdfa] dark:bg-[#1c1a14]' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                        isToday
                          ? 'bg-[#f5b400] text-[#161616]'
                          : dObj.isCurrentMonth
                          ? 'text-[#161616] dark:text-white'
                          : 'text-[#a1a1aa]'
                      }`}
                    >
                      {dObj.dayNum}
                    </span>

                    {dayBookings.length > 0 && (
                      <span className="text-[10px] font-bold text-[#7b5900] dark:text-[#f5b400] bg-[#fff3d6] dark:bg-[#332600] px-1.5 py-0.5 rounded-md">
                        {dayBookings.length} {dayBookings.length === 1 ? 'Booking' : 'Bookings'}
                      </span>
                    )}
                  </div>

                  {/* Scheduled Bookings in this Date */}
                  <div className="space-y-1.5 my-1.5 flex-1 overflow-y-auto max-h-[85px] scrollbar-none">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playClick();
                          setActiveBookingModal(b);
                        }}
                        className={`p-1.5 rounded-lg border text-left shadow-xs transition-all hover:scale-[1.02] cursor-pointer ${
                          b.type === 'internal'
                            ? 'bg-[#f5b400] border-[#161616] text-[#161616]'
                            : 'bg-[#27272a] border-[#3a3a3a] text-white'
                        }`}
                      >
                        <div className="font-bold text-[10px] truncate leading-tight flex items-center justify-between">
                          <span>{b.room}</span>
                          <span className="font-mono text-[9px] opacity-80">{b.timeSlot.split(' - ')[0]}</span>
                        </div>
                        <div className="text-[9px] opacity-90 truncate">{b.client}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] text-[#a1a1aa] opacity-0 group-hover:opacity-100 transition-opacity text-right">
                    + Quick Book
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: DYNAMIC WEEK VIEW GRID */}
      {selectedView === 'Week View' && (
        <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white">
                  <th className="p-3.5 font-bold w-24 border-r border-[#3a3a3a] text-center font-['Space_Grotesk'] text-[#f5b400]">
                    Time
                  </th>
                  {weekDays.map((d, i) => (
                    <th key={i} className="p-3.5 font-bold border-r border-[#3a3a3a] font-['Space_Grotesk']">
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e0] dark:divide-[#27272a]">
                {hours.map((hour, rowIdx) => (
                  <tr key={rowIdx} className="h-16">
                    <td className="p-2.5 font-semibold text-[#747878] dark:text-[#a1a1aa] bg-[#f8f7f5] dark:bg-[#121315] border-r border-[#e3e2e0] dark:border-[#27272a] text-center text-[11px] font-mono">
                      {hour}
                    </td>

                    {weekDays.map((dayObj, colIdx) => {
                      const matchedBookings = getBookingsForCell(dayObj, hour);

                      return (
                        <td
                          key={colIdx}
                          onClick={() => {
                            if (matchedBookings.length === 0) {
                              soundFx.playClick();
                              setQuickBookSlot({ label: dayObj.label, dateStr: dayObj.dateStr, hour });
                            }
                          }}
                          className="p-1.5 border-r border-[#e3e2e0] dark:border-[#27272a] align-top hover:bg-[#faf9f7] dark:hover:bg-[#202024]/50 transition-colors relative cursor-pointer group"
                        >
                          {matchedBookings.length > 0 ? (
                            <div className="space-y-1.5">
                              {matchedBookings.map((b) => (
                                <div
                                  key={b.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    soundFx.playClick();
                                    setActiveBookingModal(b);
                                  }}
                                  className={`p-2.5 rounded-xl border relative shadow-sm cursor-pointer transition-all hover:scale-[1.02] ${
                                    b.type === 'internal'
                                      ? 'bg-[#f5b400] border-[#161616] text-[#161616]'
                                      : 'bg-[#27272a] border-[#3a3a3a] text-white'
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="font-bold text-xs truncate">{b.room}</span>
                                    <span className="text-[10px] font-mono font-bold opacity-80">#{b.id}</span>
                                  </div>
                                  <div className="text-[11px] opacity-90 truncate mt-0.5">{b.client} ({b.attendees} Att)</div>
                                  <div className="text-[9px] uppercase font-bold tracking-wider opacity-80 mt-1">
                                    {b.type === 'internal' ? '• Entitlement Used' : `• Overage: ₹${b.billableAmount}`}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] text-[#747878] font-bold bg-[#f4f3f1] dark:bg-[#2e2f33] px-2 py-0.5 rounded-md">
                                + Reserve Slot
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: DAY VIEW */}
      {selectedView === 'Day View' && (
        <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#e3e2e0] dark:border-[#27272a] pb-4">
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white">
                Daily Timeline Schedule
              </h3>
              <p className="text-xs text-[#747878] dark:text-[#a1a1aa]">
                All reservations scheduled for {formatDateStr(currentDate)}
              </p>
            </div>
            <span className="text-xs font-bold bg-[#f4f3f1] dark:bg-[#202024] px-3 py-1.5 rounded-xl text-[#161616] dark:text-white">
              {getBookingsForDate(formatDateStr(currentDate)).length} Bookings on this day
            </span>
          </div>

          <div className="space-y-3">
            {hours.map((hour, hIdx) => {
              const cellBookings = getBookingsForCell({ dateStr: formatDateStr(currentDate) }, hour);

              return (
                <div
                  key={hIdx}
                  className="flex items-start gap-4 p-3.5 bg-[#f8f7f5] dark:bg-[#1a1b1d] rounded-2xl border border-[#e3e2e0] dark:border-[#27272a] hover:border-[#f5b400] transition-all"
                >
                  <div className="w-24 font-mono font-bold text-xs text-[#161616] dark:text-white pt-1">
                    {hour}
                  </div>

                  <div className="flex-1">
                    {cellBookings.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cellBookings.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => {
                              soundFx.playClick();
                              setActiveBookingModal(b);
                            }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                              b.type === 'internal'
                                ? 'bg-[#f5b400] border-[#161616] text-[#161616]'
                                : 'bg-[#27272a] border-[#3a3a3a] text-white'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm">{b.room}</span>
                              <span className="text-xs font-mono font-bold">#{b.id}</span>
                            </div>
                            <div className="text-xs mt-1">{b.client} • Host: {b.host} ({b.attendees} Attendees)</div>
                            <div className="text-[11px] mt-1 italic opacity-90">{b.notes}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          soundFx.playClick();
                          setQuickBookSlot({
                            label: formatDateStr(currentDate),
                            dateStr: formatDateStr(currentDate),
                            hour
                          });
                        }}
                        className="py-1.5 text-xs text-[#a1a1aa] hover:text-[#161616] dark:hover:text-white cursor-pointer font-medium"
                      >
                        + Click to reserve an empty slot at {hour}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pop-up Modal: Meeting Details */}
      {activeBookingModal && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-4 mb-4">
              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                    activeBookingModal.type === 'internal'
                      ? 'bg-[#f5b400] text-[#161616]'
                      : 'bg-[#27272a] text-white'
                  }`}
                >
                  {activeBookingModal.type === 'internal' ? 'Internal Free Entitlement' : 'Billable Overage'}
                </span>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-1">
                  {activeBookingModal.room}
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa]">
                  {activeBookingModal.location || 'Floor 7, Executive Wing'}
                </p>
              </div>

              <button
                onClick={() => setActiveBookingModal(null)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#f8f7f5] dark:bg-[#1a1b1d] rounded-2xl border border-[#e3e2e0] dark:border-[#27272a]">
                <div>
                  <span className="text-[#747878] dark:text-[#a1a1aa] block text-[11px]">Host / Organizer</span>
                  <span className="font-bold text-[#161616] dark:text-white">{activeBookingModal.host}</span>
                </div>
                <div>
                  <span className="text-[#747878] dark:text-[#a1a1aa] block text-[11px]">Client Entity</span>
                  <span className="font-bold text-[#161616] dark:text-white">{activeBookingModal.client}</span>
                </div>
                <div>
                  <span className="text-[#747878] dark:text-[#a1a1aa] block text-[11px]">Date & Time</span>
                  <span className="font-bold text-[#161616] dark:text-white">{activeBookingModal.date} ({activeBookingModal.timeSlot})</span>
                </div>
                <div>
                  <span className="text-[#747878] dark:text-[#a1a1aa] block text-[11px]">Attendees</span>
                  <span className="font-bold text-[#161616] dark:text-white">{activeBookingModal.attendees} Confirmed</span>
                </div>
              </div>

              {activeBookingModal.notes && (
                <div>
                  <span className="font-bold text-[#161616] dark:text-white block mb-1">Meeting Agenda / Notes:</span>
                  <p className="p-3 bg-[#f8f7f5] dark:bg-[#1a1b1d] rounded-xl text-[#444748] dark:text-[#a1a1aa] italic">
                    "{activeBookingModal.notes}"
                  </p>
                </div>
              )}

              {activeBookingModal.amenities && (
                <div>
                  <span className="font-bold text-[#161616] dark:text-white block mb-1">Provisioned Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeBookingModal.amenities.map((am, i) => (
                      <span key={i} className="bg-[#f4f3f1] dark:bg-[#2e2f33] text-[#161616] dark:text-white px-2.5 py-1 rounded-md text-[11px] font-medium">
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#e3e2e0] dark:border-[#27272a] flex items-center justify-between">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    addToast(`Exported .ICS calendar invite for ${activeBookingModal.room}.`, 'success', 'Calendar Sync');
                  }}
                  className="px-3.5 py-2 bg-[#f4f3f1] dark:bg-[#202024] hover:bg-[#e3e2e0] text-[#161616] dark:text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Export .ICS</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCancelBooking(activeBookingModal.id)}
                    className="px-4 py-2 bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                  <button
                    onClick={() => setActiveBookingModal(null)}
                    className="px-5 py-2 bg-[#161616] dark:bg-[#f5b400] text-white dark:text-[#161616] rounded-xl font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Modal: Quick Slot Booking */}
      {quickBookSlot && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Operations Quick Reservation
                </span>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-1">
                  Reserve Meeting Slot
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa]">
                  {quickBookSlot.label || quickBookSlot.dateStr} at {quickBookSlot.hour || '10:00 AM'}
                </p>
              </div>

              <button
                onClick={() => setQuickBookSlot(null)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleQuickBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Select Conference Space</label>
                <select
                  value={selectedRoomName}
                  onChange={(e) => setSelectedRoomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl font-medium outline-none text-[#161616] dark:text-white"
                >
                  {meetingRooms.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} ({r.floor} • Cap: {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Attendee Count</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={quickAttendees}
                  onChange={(e) => setQuickAttendees(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl font-medium outline-none text-[#161616] dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Meeting Agenda / Host Note</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Strategic Planning or Client Review"
                  value={quickAgenda}
                  onChange={(e) => setQuickAgenda(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl font-medium outline-none text-[#161616] dark:text-white"
                />
              </div>

              <div className="p-3 bg-[#f8f7f5] dark:bg-[#1a1b1d] rounded-xl border border-[#e3e2e0] dark:border-[#27272a] text-[11px] text-[#747878] dark:text-[#a1a1aa]">
                ✓ Automatically deducted from client entitlement wallet quota.
              </div>

              <div className="pt-4 border-t border-[#e3e2e0] dark:border-[#27272a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickBookSlot(null)}
                  className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] text-[#161616] dark:text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold rounded-xl hover:bg-[#ffdea4] shadow-sm transition-all"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
