'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const ManageWorkspace = () => {
  const {
    activeBranch,
    floors,
    rooms,
    seats,
    clients,
    addFloor,
    updateFloor,
    deleteFloor,
    addRoom,
    updateRoom,
    deleteRoom,
    addSeat,
    bulkAddSeats,
    updateSeat,
    deleteSeat,
    setCurrentScreen,
    addToast
  } = useApp();

  const [selectedFloorId, setSelectedFloorId] = useState(floors[1]?.id || floors[0]?.id || 'FL-07');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [seatFilter, setSeatFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);

  const [isBulkSeatModalOpen, setIsBulkSeatModalOpen] = useState(false);

  // Form States
  const [floorForm, setFloorForm] = useState({
    name: '',
    level: 7,
    totalArea: '15,000 sq.ft',
    description: '',
    status: 'Operational'
  });

  const [roomForm, setRoomForm] = useState({
    name: '',
    floorId: selectedFloorId,
    type: 'Private Office',
    capacity: 15,
    area: '1,000 sq.ft',
    baseRatePerSeat: 14500,
    status: 'Available',
    client: 'Vacant Space',
    amenities: ['Power Sockets', 'LAN Connectivity', 'Executive Chairs']
  });

  const [seatForm, setSeatForm] = useState({
    seatNumber: '',
    deskType: 'Ergonomic Standing Desk',
    status: 'Available',
    assignedTo: 'Unassigned',
    powerLanStatus: 'Active'
  });

  const [bulkForm, setBulkForm] = useState({
    count: 10,
    prefix: 'D-',
    deskType: 'Ergonomic Standing Desk',
    status: 'Available'
  });

  const activeFloor = floors.find((f) => f.id === selectedFloorId) || floors[0];
  const floorRooms = rooms.filter((r) => r.floorId === selectedFloorId || r.floor === activeFloor?.name);
  const activeRoom = rooms.find((r) => r.id === selectedRoomId);
  const roomSeats = seats.filter((s) => s.roomId === selectedRoomId);

  // Stats Calculations
  const totalBranchDesks = seats.length;
  const occupiedBranchDesks = seats.filter((s) => s.status === 'Occupied').length;
  const availableBranchDesks = seats.filter((s) => s.status === 'Available').length;
  const branchOccupancyRate = totalBranchDesks > 0 ? Math.round((occupiedBranchDesks / totalBranchDesks) * 100) : 0;

  // Floor Stats
  const floorSeats = seats.filter((s) => {
    const r = rooms.find((rm) => rm.id === s.roomId);
    return r && (r.floorId === activeFloor?.id || r.floor === activeFloor?.name);
  });
  const floorOccupiedSeats = floorSeats.filter((s) => s.status === 'Occupied').length;
  const floorOccupancyRate = floorSeats.length > 0 ? Math.round((floorOccupiedSeats / floorSeats.length) * 100) : 0;

  // Floor Handlers
  const handleOpenAddFloor = () => {
    soundFx.playClick();
    setEditingFloor(null);
    setFloorForm({
      name: `Floor ${floors.length + 6}`,
      level: floors.length + 6,
      totalArea: '14,500 sq.ft',
      description: 'Enterprise Suites & Collaborative Workspaces',
      status: 'Operational'
    });
    setIsFloorModalOpen(true);
  };

  const handleOpenEditFloor = (floor) => {
    soundFx.playClick();
    setEditingFloor(floor);
    setFloorForm({
      name: floor.name,
      level: floor.level,
      totalArea: floor.totalArea || '15,000 sq.ft',
      description: floor.description || '',
      status: floor.status || 'Operational'
    });
    setIsFloorModalOpen(true);
  };

  const handleSaveFloor = (e) => {
    e.preventDefault();
    soundFx.playSuccess();
    if (editingFloor) {
      updateFloor(editingFloor.id, floorForm);
    } else {
      addFloor(floorForm);
    }
    setIsFloorModalOpen(false);
  };

  // Room Handlers
  const handleOpenAddRoom = (floorId = selectedFloorId) => {
    soundFx.playClick();
    setEditingRoom(null);
    const targetFloor = floors.find((f) => f.id === floorId) || activeFloor;
    const floorNum = targetFloor?.level || 7;
    setRoomForm({
      name: `Suite ${floorNum}0${floorRooms.length + 1}`,
      floorId: targetFloor?.id,
      floor: targetFloor?.name,
      type: 'Private Office',
      capacity: 15,
      area: '1,000 sq.ft',
      baseRatePerSeat: 14500,
      status: 'Available',
      client: 'Vacant Space',
      amenities: ['Power Sockets', 'LAN Connectivity', 'Executive Chairs']
    });
    setIsRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room) => {
    soundFx.playClick();
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      floorId: room.floorId || activeFloor?.id,
      floor: room.floor || activeFloor?.name,
      type: room.type,
      capacity: room.capacity,
      area: room.area || '1,000 sq.ft',
      baseRatePerSeat: room.baseRatePerSeat || 14500,
      status: room.status,
      client: room.client || 'Vacant Space',
      amenities: room.amenities || ['Power Sockets', 'LAN Connectivity']
    });
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e) => {
    e.preventDefault();
    soundFx.playSuccess();
    if (editingRoom) {
      updateRoom(editingRoom.id, roomForm);
    } else {
      addRoom(roomForm);
    }
    setIsRoomModalOpen(false);
  };

  // Seat Handlers
  const handleOpenAddSeat = () => {
    soundFx.playClick();
    setEditingSeat(null);
    const prefix = `D-${activeRoom?.name.replace(/[^0-9]/g, '') || 'R'}`;
    setSeatForm({
      seatNumber: `${prefix}-${roomSeats.length + 1 < 10 ? '0' + (roomSeats.length + 1) : roomSeats.length + 1}`,
      deskType: 'Ergonomic Standing Desk',
      status: activeRoom?.status === 'Occupied' ? 'Occupied' : 'Available',
      assignedTo: activeRoom?.client || 'Unassigned',
      powerLanStatus: 'Active'
    });
    setIsSeatModalOpen(true);
  };

  const handleOpenEditSeat = (seat) => {
    soundFx.playClick();
    setEditingSeat(seat);
    setSeatForm({
      seatNumber: seat.seatNumber,
      deskType: seat.deskType || 'Standard Dedicated Desk',
      status: seat.status || 'Available',
      assignedTo: seat.assignedTo || 'Unassigned',
      powerLanStatus: seat.powerLanStatus || 'Active'
    });
    setIsSeatModalOpen(true);
  };

  const handleSaveSeat = (e) => {
    e.preventDefault();
    soundFx.playSuccess();
    if (editingSeat) {
      updateSeat(editingSeat.id, seatForm);
    } else {
      addSeat({ ...seatForm, roomId: selectedRoomId });
    }
    setIsSeatModalOpen(false);
  };

  const handleToggleSeatStatus = (seat) => {
    soundFx.playClick();
    const statusCycle = {
      Available: 'Occupied',
      Occupied: 'Reserved',
      Reserved: 'Maintenance',
      Maintenance: 'Available'
    };
    const nextStatus = statusCycle[seat.status] || 'Available';
    updateSeat(seat.id, {
      status: nextStatus,
      assignedTo: nextStatus === 'Occupied' ? activeRoom?.client || 'Assigned' : 'Unassigned'
    });
  };

  const handleBulkGenerate = (e) => {
    e.preventDefault();
    soundFx.playChime();
    bulkAddSeats(
      selectedRoomId,
      Number(bulkForm.count),
      bulkForm.prefix || `D-${activeRoom?.name.replace(/[^0-9]/g, '')}-`,
      bulkForm.deskType,
      bulkForm.status
    );
    setIsBulkSeatModalOpen(false);
  };

  const filteredSeats = roomSeats.filter((s) => {
    const matchesFilter = seatFilter === 'All' || s.status === seatFilter;
    const matchesSearch =
      s.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.assignedTo && s.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.deskType && s.deskType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Physical Space Governance • {activeBranch.city}
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#161616] dark:text-white">
            Workspace Structure & Inventory Manager
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Manage complete 3-tier physical hierarchy: Floors, Rooms & Workstation Desks at {activeBranch.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentScreen('workspace_allocation');
            }}
            className="px-4 py-2 bg-white dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] text-[#161616] dark:text-white font-['Space_Grotesk'] font-bold text-xs rounded-xl hover:bg-[#f4f3f1] dark:hover:bg-[#252528] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Allocation Board</span>
          </button>

          <button
            onClick={handleOpenAddFloor}
            className="px-3.5 py-2 bg-[#161616] dark:bg-[#202024] hover:bg-[#333] text-white font-['Space_Grotesk'] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-[#f5b400]">layers</span>
            <span>+ Add Floor</span>
          </button>

          <button
            onClick={() => handleOpenAddRoom(selectedFloorId)}
            className="px-4 py-2 bg-[#f5b400] hover:bg-[#ffdea4] text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_business</span>
            <span>+ Add Room</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa] flex items-center justify-between">
            <span>Total Floors</span>
            <span className="material-symbols-outlined text-[#f5b400] text-sm">domain</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-1">
            {floors.length} Floors
          </div>
          <div className="text-[10px] text-[#747878] mt-0.5">{rooms.length} Suites / Rooms Configured</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa] flex items-center justify-between">
            <span>Workstation Desks</span>
            <span className="material-symbols-outlined text-[#1e8a5f] text-sm">desk</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-1">
            {totalBranchDesks} Desks
          </div>
          <div className="text-[10px] text-[#1e8a5f] mt-0.5 font-semibold">
            {availableBranchDesks} Available • {occupiedBranchDesks} Occupied
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa] flex items-center justify-between">
            <span>Branch Fill Rate</span>
            <span className="material-symbols-outlined text-[#f5b400] text-sm">pie_chart</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-1">
            {branchOccupancyRate}%
          </div>
          <div className="text-[10px] text-[#747878] mt-0.5">Physical Capacity Occupancy</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa] flex items-center justify-between">
            <span>Super Built-up Area</span>
            <span className="material-symbols-outlined text-[#3b82f6] text-sm">square_foot</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-1">
            45,500 sq.ft
          </div>
          <div className="text-[10px] text-[#747878] mt-0.5">Across {floors.length} Commercial Floors</div>
        </div>
      </div>

      {/* Main Workspace Management Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Floor Hierarchy Navigator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e2e0] dark:border-[#27272a]">
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#161616] dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#f5b400] text-base">layers</span>
                <span>1. Floor Hierarchy</span>
              </h3>
              <button
                onClick={handleOpenAddFloor}
                className="text-xs text-[#7b5900] dark:text-[#f5b400] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ New</span>
              </button>
            </div>

            {/* Floor Cards List */}
            <div className="space-y-3">
              {floors.map((floor) => {
                const isSelected = selectedFloorId === floor.id;
                const fRooms = rooms.filter((r) => r.floorId === floor.id || r.floor === floor.name);
                const fSeats = seats.filter((s) => {
                  const r = rooms.find((rm) => rm.id === s.roomId);
                  return r && (r.floorId === floor.id || r.floor === floor.name);
                });
                const fOccupied = fSeats.filter((s) => s.status === 'Occupied').length;
                const fRate = fSeats.length > 0 ? Math.round((fOccupied / fSeats.length) * 100) : 0;

                return (
                  <div
                    key={floor.id}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedFloorId(floor.id);
                      setSelectedRoomId(null);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-[#fffdf7] dark:bg-[#201c13] border-[#f5b400] ring-1 ring-[#f5b400] shadow-md'
                        : 'bg-[#f8f7f5] dark:bg-[#1a1b1d] border-[#e3e2e0] dark:border-[#27272a] hover:border-[#f5b400]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-mono font-bold text-xs flex items-center justify-center">
                          L{floor.level}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-[#161616] dark:text-white leading-tight">
                            {floor.name}
                          </div>
                          <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa] mt-0.5">
                            {floor.totalArea} • {fRooms.length} Rooms
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditFloor(floor);
                          }}
                          className="p-1 text-[#747878] hover:text-[#161616] dark:hover:text-white rounded-md hover:bg-black/5"
                          title="Edit Floor"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        {floors.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete ${floor.name}? This will remove all associated rooms & desks.`)) {
                                deleteFloor(floor.id);
                              }
                            }}
                            className="p-1 text-[#ef4444] hover:bg-[#fee2e2] rounded-md"
                            title="Delete Floor"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#444748] dark:text-[#a1a1aa] line-clamp-1">
                      {floor.description}
                    </p>

                    {/* Floor Capacity Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#747878]">{fOccupied}/{fSeats.length} Desks Occupied</span>
                        <span className="font-bold text-[#1e8a5f]">{fRate}%</span>
                      </div>
                      <div className="w-full bg-[#e3e2e0] dark:bg-[#2e2f33] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#f5b400] rounded-full transition-all duration-300"
                          style={{ width: `${fRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Rooms & Seat Management for Selected Floor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Floor Banner */}
          <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e3e2e0] dark:border-[#27272a]">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Active Selected Level • {activeBranch.name}
                </div>
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-0.5">
                  {activeFloor?.name}: {activeFloor?.description}
                </h2>
                <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-0.5">
                  {floorRooms.length} Configured Rooms • {floorSeats.length} Total Workstations • {floorOccupancyRate}% Occupied
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddRoom(selectedFloorId)}
                  className="px-3.5 py-2 bg-[#f5b400] hover:bg-[#ffdea4] text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Room to {activeFloor?.name}</span>
                </button>
              </div>
            </div>

            {/* Room List on Active Floor */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#747878] dark:text-[#a1a1aa] uppercase tracking-wider">
                2. Configured Rooms & Suites on {activeFloor?.name}:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {floorRooms.map((room) => {
                  const isRoomSelected = selectedRoomId === room.id;
                  const rSeats = seats.filter((s) => s.roomId === room.id);
                  const rOccupied = rSeats.filter((s) => s.status === 'Occupied').length;
                  const rRate = rSeats.length > 0 ? Math.round((rOccupied / rSeats.length) * 100) : 0;

                  return (
                    <div
                      key={room.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedRoomId(room.id);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isRoomSelected
                          ? 'bg-[#fffdf7] dark:bg-[#201c13] border-[#f5b400] ring-2 ring-[#f5b400]/40 shadow-md'
                          : 'bg-[#f8f7f5] dark:bg-[#1a1b1d] border-[#e3e2e0] dark:border-[#27272a] hover:border-[#f5b400]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#161616] dark:text-white">
                              {room.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                room.status === 'Occupied'
                                  ? 'bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 text-[#1e8a5f]'
                                  : room.status === 'Available'
                                  ? 'bg-[#f0fdf4] text-[#15803d] border border-[#22c55e]/40'
                                  : 'bg-[#faf5ff] text-[#7e22ce]'
                              }`}
                            >
                              {room.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#747878] dark:text-[#a1a1aa] mt-0.5">
                            {room.type} • {room.area} • ₹{room.baseRatePerSeat?.toLocaleString('en-IN')}/seat
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditRoom(room);
                            }}
                            className="p-1 text-[#747878] hover:text-[#161616] dark:hover:text-white rounded-md hover:bg-black/5"
                            title="Edit Room"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete ${room.name} and all its desks?`)) {
                                deleteRoom(room.id);
                                if (selectedRoomId === room.id) setSelectedRoomId(null);
                              }
                            }}
                            className="p-1 text-[#ef4444] hover:bg-[#fee2e2] rounded-md"
                            title="Delete Room"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-[#444748] dark:text-[#d4d4d8] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#f5b400]">business</span>
                        <span>Tenant: <span className="font-bold text-[#161616] dark:text-white">{room.client || 'Vacant Space'}</span></span>
                      </div>

                      {/* Amenities pills */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="text-[9px] bg-white dark:bg-[#27272a] text-[#747878] dark:text-[#a1a1aa] px-2 py-0.5 rounded-md border border-[#e3e2e0] dark:border-[#333]">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Button: Manage Seats */}
                      <div className="pt-2 border-t border-[#e3e2e0] dark:border-[#2e2f33] flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#747878]">
                          🪑 {rSeats.length} Desks ({rOccupied} Occupied)
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playClick();
                            setSelectedRoomId(room.id);
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                            isRoomSelected
                              ? 'bg-[#f5b400] text-[#161616]'
                              : 'bg-[#161616] dark:bg-[#27272a] text-white hover:bg-[#f5b400] hover:text-[#161616]'
                          }`}
                        >
                          <span>Manage Desks →</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. SEAT & WORKSTATION INVENTORY MATRIX (When a Room is Selected) */}
          {activeRoom && (
            <div className="bg-white dark:bg-[#17181a] border-2 border-[#f5b400]/40 rounded-3xl p-6 shadow-lg space-y-5 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e3e2e0] dark:border-[#27272a]">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                    3. Individual Workstation Desk Inventory
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-0.5 flex items-center gap-2">
                    <span>{activeRoom.name} Desks ({roomSeats.length} Total)</span>
                    <span className="text-xs font-normal text-[#747878]">({activeRoom.type})</span>
                  </h3>
                  <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-0.5">
                    Click any desk to toggle status (Available ↔ Occupied ↔ Reserved ↔ Maintenance) or edit specifications.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      const prefix = `D-${activeRoom.name.replace(/[^0-9]/g, '') || 'R'}-`;
                      setBulkForm({
                        count: 10,
                        prefix,
                        deskType: 'Ergonomic Standing Desk',
                        status: activeRoom.status === 'Occupied' ? 'Occupied' : 'Available'
                      });
                      setIsBulkSeatModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#161616] dark:bg-[#202024] hover:bg-[#333] text-white font-['Space_Grotesk'] font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-[#f5b400]">auto_awesome</span>
                    <span>⚡ Bulk Add Desks</span>
                  </button>

                  <button
                    onClick={handleOpenAddSeat}
                    className="px-3.5 py-1.5 bg-[#f5b400] hover:bg-[#ffdea4] text-[#161616] font-['Space_Grotesk'] font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>+ Add Single Desk</span>
                  </button>
                </div>
              </div>

              {/* Seat Status Filter & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                  {['All', 'Available', 'Occupied', 'Reserved', 'Maintenance'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        soundFx.playClick();
                        setSeatFilter(st);
                      }}
                      className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                        seatFilter === st
                          ? 'bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-bold'
                          : 'bg-[#f4f3f1] dark:bg-[#202024] text-[#747878] dark:text-[#a1a1aa]'
                      }`}
                    >
                      {st} ({st === 'All' ? roomSeats.length : roomSeats.filter((s) => s.status === st).length})
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-56">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747878] text-sm">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search desk code..."
                    className="w-full pl-8 pr-3 py-1 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] text-xs rounded-xl outline-none text-[#161616] dark:text-white"
                  />
                </div>
              </div>

              {/* Visual Desk Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[440px] overflow-y-auto pr-1">
                {filteredSeats.length === 0 ? (
                  <div className="col-span-full p-8 text-center border border-dashed border-[#e3e2e0] dark:border-[#27272a] rounded-2xl text-xs text-[#747878]">
                    No desks match the filter. Click "+ Add Single Desk" or "⚡ Bulk Add Desks" above to populate!
                  </div>
                ) : (
                  filteredSeats.map((seat) => {
                    const statusColor =
                      seat.status === 'Occupied'
                        ? 'bg-[#ffffff] dark:bg-[#1f2023] border-[#161616] dark:border-[#3a3a3a] text-[#161616] dark:text-white'
                        : seat.status === 'Available'
                        ? 'bg-[#f0fdf4] dark:bg-[#14231b] border-[#22c55e] text-[#15803d] dark:text-[#4ade80]'
                        : seat.status === 'Reserved'
                        ? 'bg-[#fffdf0] dark:bg-[#232014] border-[#f5b400] text-[#7b5900] dark:text-[#f5b400]'
                        : 'bg-[#f4f3f1] dark:bg-[#202024] border-[#747878] text-[#747878]';

                    return (
                      <div
                        key={seat.id}
                        className={`p-3 rounded-xl border-2 transition-all shadow-2xs hover:shadow-md space-y-2 relative group ${statusColor}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs">{seat.seatNumber}</span>
                          <span
                            onClick={() => handleToggleSeatStatus(seat)}
                            title="Click to toggle status"
                            className="w-2.5 h-2.5 rounded-full cursor-pointer hover:scale-150 transition-transform"
                            style={{
                              backgroundColor:
                                seat.status === 'Occupied'
                                  ? '#161616'
                                  : seat.status === 'Available'
                                  ? '#22c55e'
                                  : seat.status === 'Reserved'
                                  ? '#f5b400'
                                  : '#747878'
                            }}
                          ></span>
                        </div>

                        <div className="text-[10px] truncate leading-tight font-medium opacity-90">
                          {seat.deskType}
                        </div>

                        <div className="text-[10px] font-bold truncate">
                          {seat.status === 'Occupied' ? `👤 ${seat.assignedTo}` : seat.status}
                        </div>

                        {/* Hover Quick Edit / Delete */}
                        <div className="pt-1.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px]">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSeat(seat)}
                            className="text-[#7b5900] dark:text-[#f5b400] font-bold hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSeat(seat.id)}
                            className="text-[#ef4444] font-bold hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Add / Edit Floor Modal */}
      {isFloorModalOpen && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Floor Management
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-0.5">
                  {editingFloor ? `Edit ${editingFloor.name}` : 'Add New Commercial Floor'}
                </h3>
              </div>
              <button
                onClick={() => setIsFloorModalOpen(false)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveFloor} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Floor Name</label>
                  <input
                    type="text"
                    required
                    value={floorForm.name}
                    onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
                    placeholder="Floor 9"
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Level Number</label>
                  <input
                    type="number"
                    required
                    value={floorForm.level}
                    onChange={(e) => setFloorForm({ ...floorForm, level: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Total Floor Space (sq.ft)</label>
                <input
                  type="text"
                  required
                  value={floorForm.totalArea}
                  onChange={(e) => setFloorForm({ ...floorForm, totalArea: e.target.value })}
                  placeholder="15,000 sq.ft"
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Zone Description / Wing Purpose</label>
                <textarea
                  rows={2}
                  required
                  value={floorForm.description}
                  onChange={(e) => setFloorForm({ ...floorForm, description: e.target.value })}
                  placeholder="Executive Penthouse Suites, AI Research Labs & Meeting Hub"
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e3e2e0] dark:border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setIsFloorModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl text-[#161616] dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold rounded-xl hover:bg-[#ffdea4] transition-all cursor-pointer shadow-sm"
                >
                  {editingFloor ? 'Update Floor' : 'Create Floor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Room & Suite Management
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-0.5">
                  {editingRoom ? `Edit ${editingRoom.name}` : 'Add New Room / Suite'}
                </h3>
              </div>
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Room / Suite Name</label>
                  <input
                    type="text"
                    required
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    placeholder="Suite 707"
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Floor Assignment</label>
                  <select
                    value={roomForm.floorId}
                    onChange={(e) => {
                      const fl = floors.find((f) => f.id === e.target.value);
                      setRoomForm({ ...roomForm, floorId: e.target.value, floor: fl?.name });
                    }}
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  >
                    {floors.map((f) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.totalArea})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Room Type</label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  >
                    <option>Private Office</option>
                    <option>Enterprise Wing</option>
                    <option>Meeting Room</option>
                    <option>Custom Built Lab</option>
                    <option>Hot Desk Bay</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Desk Capacity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Floor Area</label>
                  <input
                    type="text"
                    required
                    value={roomForm.area}
                    onChange={(e) => setRoomForm({ ...roomForm, area: e.target.value })}
                    placeholder="1,200 sq.ft"
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Base Rate / Seat (₹/mo)</label>
                  <input
                    type="number"
                    required
                    value={roomForm.baseRatePerSeat}
                    onChange={(e) => setRoomForm({ ...roomForm, baseRatePerSeat: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Status</label>
                  <select
                    value={roomForm.status}
                    onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Assigned Tenant / Client</label>
                <select
                  value={roomForm.client}
                  onChange={(e) => setRoomForm({ ...roomForm, client: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                >
                  <option value="Vacant Space">Vacant Space (No Tenant)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e3e2e0] dark:border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl text-[#161616] dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold rounded-xl hover:bg-[#ffdea4] transition-all cursor-pointer shadow-sm"
                >
                  {editingRoom ? 'Save Room Changes' : 'Create Room & Generate Seats'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add / Edit Single Desk */}
      {isSeatModalOpen && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Seat & Desk Configuration
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-0.5">
                  {editingSeat ? `Edit Desk ${editingSeat.seatNumber}` : `Add Desk to ${activeRoom?.name}`}
                </h3>
              </div>
              <button
                onClick={() => setIsSeatModalOpen(false)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveSeat} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Desk / Seat Number</label>
                <input
                  type="text"
                  required
                  value={seatForm.seatNumber}
                  onChange={(e) => setSeatForm({ ...seatForm, seatNumber: e.target.value })}
                  placeholder="D-704-15"
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Desk Type</label>
                <select
                  value={seatForm.deskType}
                  onChange={(e) => setSeatForm({ ...seatForm, deskType: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                >
                  <option>Ergonomic Standing Desk</option>
                  <option>Executive Leather Desk</option>
                  <option>Dual-Monitor Developer Bay</option>
                  <option>Standard Dedicated Desk</option>
                  <option>Lab Workstation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Status</label>
                  <select
                    value={seatForm.status}
                    onChange={(e) => setSeatForm({ ...seatForm, status: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Assigned Occupant</label>
                  <input
                    type="text"
                    value={seatForm.assignedTo}
                    onChange={(e) => setSeatForm({ ...seatForm, assignedTo: e.target.value })}
                    placeholder="Tenant or Employee name"
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e3e2e0] dark:border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setIsSeatModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl text-[#161616] dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold rounded-xl hover:bg-[#ffdea4] transition-all cursor-pointer shadow-sm"
                >
                  {editingSeat ? 'Update Desk' : 'Add Desk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Bulk Add Desks Modal */}
      {isBulkSeatModalOpen && (
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#17181a] border-2 border-[#161616] dark:border-[#3a3a3a] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-[#e3e2e0] dark:border-[#27272a] pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900] dark:text-[#f5b400]">
                  Batch Generation Engine
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] dark:text-white mt-0.5">
                  Bulk Generate Desks in {activeRoom?.name}
                </h3>
              </div>
              <button
                onClick={() => setIsBulkSeatModalOpen(false)}
                className="text-[#747878] hover:text-[#161616] dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleBulkGenerate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Quantity of Desks</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={bulkForm.count}
                    onChange={(e) => setBulkForm({ ...bulkForm, count: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#161616] dark:text-white mb-1">Code Prefix</label>
                  <input
                    type="text"
                    required
                    value={bulkForm.prefix}
                    onChange={(e) => setBulkForm({ ...bulkForm, prefix: e.target.value })}
                    placeholder="D-704-"
                    className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Workstation Hardware Tier</label>
                <select
                  value={bulkForm.deskType}
                  onChange={(e) => setBulkForm({ ...bulkForm, deskType: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                >
                  <option>Ergonomic Standing Desk</option>
                  <option>Executive Leather Desk</option>
                  <option>Dual-Monitor Developer Bay</option>
                  <option>Standard Dedicated Desk</option>
                  <option>Lab Workstation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#161616] dark:text-white mb-1">Initial Allocation Status</label>
                <select
                  value={bulkForm.status}
                  onChange={(e) => setBulkForm({ ...bulkForm, status: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none focus:border-[#f5b400] text-[#161616] dark:text-white"
                >
                  <option value="Available">Available (Ready for Lease)</option>
                  <option value="Occupied">Occupied (Assigned to {activeRoom?.client})</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <div className="p-3 bg-[#f8f7f5] dark:bg-[#202024] rounded-2xl border border-[#e3e2e0] dark:border-[#2e2f33] text-[11px] text-[#747878] dark:text-[#a1a1aa]">
                ⚡ Will generate {bulkForm.count} structured desks in {activeRoom?.name} starting from index #{roomSeats.length + 1}.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e3e2e0] dark:border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setIsBulkSeatModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl text-[#161616] dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold rounded-xl hover:bg-[#ffdea4] transition-all cursor-pointer shadow-sm"
                >
                  Generate {bulkForm.count} Desks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
