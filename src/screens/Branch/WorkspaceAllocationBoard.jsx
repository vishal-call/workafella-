import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveFloorMap } from '../../components/InteractiveFloorMap';

export const WorkspaceAllocationBoard = () => {
  const { clients, activeBranch, setCurrentScreen, addToast } = useApp();
  const [selectedFloor, setSelectedFloor] = useState('All Floors');
  const [isNewAllocModalOpen, setIsNewAllocModalOpen] = useState(false);
  const [selectedSuites, setSelectedSuites] = useState([]);

  // New Allocation Modal Form State
  const [allocForm, setAllocForm] = useState({
    clientId: 'CL-101',
    roomNumber: '706',
    seatsRequested: 10,
    contractType: '1-Year Amendment'
  });

  const roomsData = [
    { room: 'Suite 704', floor: 'Floor 7', capacity: 25, occupied: 25, client: 'Acme Innovations Pvt Ltd', type: 'Private Office' },
    { room: 'Suite 705', floor: 'Floor 7', capacity: 20, occupied: 20, client: 'Acme Innovations Pvt Ltd', type: 'Private Office' },
    { room: 'Suite 706', floor: 'Floor 7', capacity: 15, occupied: 0, client: 'Available', type: 'Private Office' },
    { room: 'Wing 708', floor: 'Floor 7', capacity: 20, occupied: 20, client: 'Zenith Systems & AI', type: 'Dedicated Wing' },
    { room: 'Lab 601', floor: 'Floor 6', capacity: 30, occupied: 30, client: 'Quantum BioLabs', type: 'Custom Built' },
    { room: 'Lab 602', floor: 'Floor 6', capacity: 30, occupied: 30, client: 'Quantum BioLabs', type: 'Custom Built' },
    { room: 'Suite 604', floor: 'Floor 6', capacity: 18, occupied: 12, client: 'FinEdge Capital', type: 'Private Office' },
    { room: 'Suite 801', floor: 'Floor 8', capacity: 20, occupied: 0, client: 'Available', type: 'Private Office' },
    { room: 'Suite 802', floor: 'Floor 8', capacity: 15, occupied: 0, client: 'Available', type: 'Private Office' }
  ];

  const filteredRooms = selectedFloor === 'All Floors'
    ? roomsData
    : roomsData.filter((r) => r.floor === selectedFloor);

  const handleCreateAllocation = (e) => {
    e.preventDefault();
    const targetClient = clients.find((c) => c.id === allocForm.clientId) || clients[0];
    const ratePerSeat = targetClient?.ratePerSeat || 15000;
    const currentDay = 16; // Mid-cycle day 16
    const totalDaysInMonth = 31;
    const daysRemaining = totalDaysInMonth - currentDay + 1; // 16 days
    const fullMonthlyAmount = allocForm.seatsRequested * ratePerSeat;
    const proRataCharge = Math.round((fullMonthlyAmount * daysRemaining) / totalDaysInMonth);

    // Update clients state dynamically
    if (targetClient) {
      targetClient.seats += Number(allocForm.seatsRequested);
      if (!targetClient.rooms.includes(allocForm.roomNumber)) {
        targetClient.rooms.push(allocForm.roomNumber);
      }
    }

    addToast(
      `Allocated ${allocForm.seatsRequested} seats in Room ${allocForm.roomNumber}. Pro-rata billing adjustment of ₹${proRataCharge.toLocaleString('en-IN')} (16/31 days) queued.`,
      'success',
      'Contract Amendment Saved'
    );
    setIsNewAllocModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Physical Space Inventory • {activeBranch.city}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Workspace Allocation & Capacity Board
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Real-time visual floor blueprint, occupancy fill rates, and client room allocation at {activeBranch.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
          >
            <option>All Floors</option>
            <option>Floor 6</option>
            <option>Floor 7</option>
            <option>Floor 8</option>
          </select>

          <button
            onClick={() => setIsNewAllocModalOpen(true)}
            className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Allocate Room / Seats</span>
          </button>
        </div>
      </div>

      {/* Visual Architectural Floor Blueprint Component */}
      <div>
        <InteractiveFloorMap
          selectedRooms={selectedSuites}
          onToggleRoom={(suiteLabel) => {
            if (selectedSuites.includes(suiteLabel)) {
              setSelectedSuites(selectedSuites.filter((s) => s !== suiteLabel));
            } else {
              setSelectedSuites([...selectedSuites, suiteLabel]);
              addToast(`Selected ${suiteLabel} on Floor Plan`, 'info');
            }
          }}
        />
      </div>

      {/* Rooms Capacity Table */}
      <div className="bg-white border border-[#e3e2e0] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#e3e2e0]">
          <div>
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#161616]">
              Detailed Room Inventory ({filteredRooms.length} Spaces)
            </h3>
            <p className="text-xs text-[#747878]">Capacity, assigned legal entities, and format types</p>
          </div>

          <span className="text-xs font-bold text-[#1e8a5f] bg-[#e7f5ed] px-3 py-1 rounded-full ring-1 ring-inset ring-emerald-600/20">
            {activeBranch.occupancy}% Centre Occupancy
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Room / Suite</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Floor Level</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Format Type</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Assigned Client</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Occupancy Rate</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk'] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e0]">
              {filteredRooms.map((r, idx) => {
                const fillPercent = Math.round((r.occupied / r.capacity) * 100);
                const isVacant = r.occupied === 0;

                return (
                  <tr key={idx} className="hover:bg-[#f8f7f5] transition-colors">
                    <td className="p-3.5 font-bold text-[#161616] flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#f5b400]">meeting_room</span>
                      <span>{r.room}</span>
                    </td>
                    <td className="p-3.5 text-[#444748]">{r.floor}</td>
                    <td className="p-3.5 text-[#747878]">{r.type}</td>
                    <td className="p-3.5 font-semibold text-[#161616]">{r.client}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#f4f3f1] h-2 rounded-full overflow-hidden border border-[#e3e2e0]">
                          <div
                            className={`h-full rounded-full ${
                              fillPercent === 100
                                ? 'bg-[#161616]'
                                : fillPercent > 0
                                ? 'bg-[#f5b400]'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${fillPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[#161616]">
                          {r.occupied}/{r.capacity} ({fillPercent}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ring-1 ring-inset ${
                          isVacant
                            ? 'bg-[#e7f5ed] text-[#1e8a5f] ring-emerald-600/20'
                            : fillPercent === 100
                            ? 'bg-[#f4f3f1] text-[#161616] ring-gray-600/20'
                            : 'bg-[#fff4e5] text-[#c77800] ring-amber-600/20'
                        }`}
                      >
                        {isVacant ? 'Available' : fillPercent === 100 ? 'Fully Occupied' : 'Partial'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Allocation Modal */}
      {isNewAllocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#faf9f7] border-2 border-[#161616] rounded-3xl shadow-2xl p-6 relative overflow-hidden animate-fade-in-up">
            <div className="flex items-start justify-between border-b border-[#e3e2e0] pb-3 mb-4">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900]">
                  Room & Seat Assignment
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                  Allocate Workspace Seats
                </h3>
              </div>

              <button
                onClick={() => setIsNewAllocModalOpen(false)}
                className="text-[#747878] hover:text-[#161616] p-1.5 rounded-full hover:bg-[#e3e2e0] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAllocation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#161616] mb-1">Target Client Organization</label>
                <select
                  value={allocForm.clientId}
                  onChange={(e) => setAllocForm({ ...allocForm, clientId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl font-medium"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.centre})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#161616] mb-1">Room / Suite Number</label>
                  <input
                    type="text"
                    required
                    value={allocForm.roomNumber}
                    onChange={(e) => setAllocForm({ ...allocForm, roomNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#161616] mb-1">Seats to Allocate</label>
                  <input
                    type="number"
                    required
                    value={allocForm.seatsRequested}
                    onChange={(e) => setAllocForm({ ...allocForm, seatsRequested: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between text-[#747878] dark:text-[#a1a1aa] text-[11px]">
                  <span>Contract Rate:</span>
                  <span className="font-mono font-bold text-[#161616] dark:text-white">
                    ₹{(clients.find((c) => c.id === allocForm.clientId)?.ratePerSeat || 15000).toLocaleString()}/seat/mo
                  </span>
                </div>
                <div className="flex justify-between text-[#747878] dark:text-[#a1a1aa] text-[11px]">
                  <span>Cycle Days Remaining (Mid-Cycle):</span>
                  <span className="font-mono font-bold text-[#161616] dark:text-white">16 of 31 Days (Aug 16–31)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#e3e2e0] dark:border-[#27272a] text-xs font-bold">
                  <span>Pro-Rata Invoice Addition:</span>
                  <span className="text-[#1e8a5f] font-mono">
                    ₹{Math.round((allocForm.seatsRequested * (clients.find((c) => c.id === allocForm.clientId)?.ratePerSeat || 15000) * 16) / 31).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e3e2e0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAllocModalOpen(false)}
                  className="px-4 py-2.5 bg-[#f4f3f1] text-[#161616] font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold rounded-xl hover:bg-[#ffdea4] shadow-sm transition-all"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
