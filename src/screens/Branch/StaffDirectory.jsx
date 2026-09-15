import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const StaffDirectory = () => {
  const { activeBranch, addToast } = useApp();

  const initialStaff = [
    {
      id: 'STF-01',
      name: 'Ramesh Kumar',
      designation: 'Centre General Manager / Branch Admin',
      role: 'Branch Admin',
      email: 'branchadmin@gmail.com',
      phone: '+91 98400 12345',
      shift: '09:00 AM - 06:00 PM',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 1] // 7 days check-in dots
    },
    {
      id: 'STF-02',
      name: 'Arjun Mehta',
      designation: 'Operations & Facility Manager',
      role: 'Operations / Facility',
      email: 'operationsmanager@gmail.com',
      phone: '+91 98400 54321',
      shift: '08:30 AM - 05:30 PM',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 0, 1]
    },
    {
      id: 'STF-03',
      name: 'Naveen Kumar',
      designation: 'Enterprise Network & IT Lead',
      role: 'Operations Staff',
      email: 'naveen.k@workafella.com',
      phone: '+91 98400 67890',
      shift: '10:00 AM - 07:00 PM',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 1]
    },
    {
      id: 'STF-04',
      name: 'Suresh Babu',
      designation: 'Chief HVAC & Electrical Engineer',
      role: 'Operations Staff',
      email: 'suresh.b@workafella.com',
      phone: '+91 98400 99887',
      shift: '07:00 AM - 04:00 PM',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 0]
    },
    {
      id: 'STF-05',
      name: 'Chandana Reddy',
      designation: 'Housekeeping & Pantry Services Lead',
      role: 'Operations Staff',
      email: 'chandana.r@workafella.com',
      phone: '+91 98400 77665',
      shift: '06:30 AM - 03:30 PM',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 1]
    }
  ];

  const [staffMembers, setStaffMembers] = useState(initialStaff);
  const [selectedStaff, setSelectedStaff] = useState(initialStaff[0]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Forms
  const [addForm, setAddForm] = useState({
    name: '',
    designation: '',
    role: 'Operations Staff',
    email: '',
    phone: '',
    shift: '09:00 AM - 06:00 PM'
  });

  const [editForm, setEditForm] = useState({
    name: '',
    designation: '',
    role: '',
    email: '',
    phone: '',
    shift: ''
  });

  const handleOpenEdit = () => {
    soundFx?.playClick?.();
    setEditForm({
      name: selectedStaff.name,
      designation: selectedStaff.designation,
      role: selectedStaff.role,
      email: selectedStaff.email,
      phone: selectedStaff.phone,
      shift: selectedStaff.shift
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    soundFx?.playChime?.();
    const updated = staffMembers.map((s) =>
      s.name === selectedStaff.name ? { ...s, ...editForm } : s
    );
    setStaffMembers(updated);
    setSelectedStaff({ ...selectedStaff, ...editForm });
    setIsEditModalOpen(false);
    addToast(`Profile for ${editForm.name} updated successfully!`, 'success', 'Staff Profile Saved');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    soundFx?.playChime?.();
    const newMember = {
      id: `STF-${Date.now().toString().slice(-4)}`,
      name: addForm.name,
      designation: addForm.designation,
      role: addForm.role,
      email: addForm.email,
      phone: addForm.phone,
      shift: addForm.shift,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      attendance: [1, 1, 1, 1, 1, 1, 1]
    };
    setStaffMembers([newMember, ...staffMembers]);
    setSelectedStaff(newMember);
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      designation: '',
      role: 'Operations Staff',
      email: '',
      phone: '',
      shift: '09:00 AM - 06:00 PM'
    });
    addToast(`Added ${newMember.name} to the branch roster.`, 'success', 'Team Member Added');
  };

  const handleToggleDeactivate = () => {
    soundFx?.playClick?.();
    const newStatus = selectedStaff.status === 'Active' ? 'Deactivated / On Leave' : 'Active';
    const updated = staffMembers.map((s) =>
      s.name === selectedStaff.name ? { ...s, status: newStatus } : s
    );
    setStaffMembers(updated);
    setSelectedStaff({ ...selectedStaff, status: newStatus });
    addToast(
      `${selectedStaff.name} is now marked as ${newStatus}.`,
      newStatus === 'Active' ? 'success' : 'warning',
      'Staff Status Changed'
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Internal Team & Workforce
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Branch Staff Directory & Attendance
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Role assignments, shift schedules, and gold-triangle biometric check-in attendance at {activeBranch.name}.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx?.playClick?.();
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>+ Add Team Member</span>
        </button>
      </div>

      {/* Staff Grid & Attendance View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Staff Cards Grid with Clipped Corners */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {staffMembers.map((s, idx) => {
            const isSelected = selectedStaff.name === s.name;
            return (
              <div
                key={idx}
                onClick={() => {
                  soundFx?.playClick?.();
                  setSelectedStaff(s);
                }}
                className={`bg-white border p-5 cursor-pointer relative overflow-hidden transition-all rounded-2xl ${
                  isSelected ? 'border-2 border-[#f5b400] shadow-md' : 'border-[#e3e2e0] hover:border-[#f5b400]'
                }`}
              >
                {/* Clipped Top-Right Corner */}
                <div
                  className="absolute -top-[1px] -right-[1px] w-3.5 h-3.5 bg-[#faf9f7] z-10"
                  style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                ></div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl border border-[#e3e2e0] overflow-hidden flex-shrink-0">
                    <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#161616]">
                        {s.name}
                      </h4>
                      {s.status === 'Active' ? (
                        <span className="w-2 h-2 rounded-full bg-[#1e8a5f]" title="Active"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" title="Deactivated"></span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#747878] leading-tight">{s.designation}</div>
                  </div>
                </div>

                {/* Attendance Mini-Calendar styled with gold triangles */}
                <div className="pt-3 border-t border-[#f4f3f1] flex items-center justify-between">
                  <span className="text-[10px] text-[#747878] uppercase font-bold">Week Attendance:</span>
                  <div className="flex gap-1.5">
                    {s.attendance.map((present, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 ${present ? 'bg-[#f5b400]' : 'bg-[#e3e2e0]'}`}
                        style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                        title={present ? 'Check-in Recorded' : 'Off Shift / Leave'}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Staff Profile & Shift Controls */}
        <div className="lg:col-span-5 bg-white border border-[#e3e2e0] rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-4 pb-4 border-b border-[#e3e2e0]">
            <div className="w-16 h-16 rounded-2xl border border-[#e3e2e0] overflow-hidden flex-shrink-0">
              <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                  {selectedStaff.name}
                </h3>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                  selectedStaff.status === 'Active' ? 'bg-[#e7f5ed] text-[#1e8a5f]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}>
                  {selectedStaff.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-[#747878]">{selectedStaff.designation}</p>
              <span className="inline-block mt-1 bg-[#161616] text-[#f5b400] px-2 py-0.5 text-[10px] font-bold rounded-md">
                {selectedStaff.role}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs bg-[#f8f7f5] p-4 border border-[#e3e2e0] rounded-2xl">
            <div className="flex justify-between">
              <span className="text-[#747878]">Email:</span>
              <span className="font-semibold text-[#161616]">{selectedStaff.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747878]">Mobile Phone:</span>
              <span className="font-semibold text-[#161616]">{selectedStaff.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747878]">Standard Shift:</span>
              <span className="font-bold text-[#161616]">{selectedStaff.shift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747878]">Hardware Biometrics:</span>
              <span className="font-bold text-[#1e8a5f]">Enrolled & Verified</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#161616]">Role & Permission Scope</label>
            <div className="p-3 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl text-xs text-[#444748]">
              Authorized for {selectedStaff.role} module capabilities and centre administration.
            </div>
          </div>

          <div className="pt-4 border-t border-[#e3e2e0] flex gap-2">
            <button
              onClick={handleOpenEdit}
              className="flex-1 py-2.5 bg-[#161616] text-[#f5b400] font-bold text-xs hover:bg-[#2f3130] rounded-xl transition-all cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              onClick={handleToggleDeactivate}
              className={`px-4 py-2.5 font-bold text-xs border rounded-xl transition-all cursor-pointer ${
                selectedStaff.status === 'Active'
                  ? 'bg-[#f4f3f1] text-[#ba1a1a] border-[#e3e2e0] hover:bg-[#ffdad6]'
                  : 'bg-[#e7f5ed] text-[#1e8a5f] border-[#1e8a5f]/40 hover:bg-[#c2ebd5]'
              }`}
            >
              {selectedStaff.status === 'Active' ? 'Deactivate' : 'Reactivate'}
            </button>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#161616] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-[#e3e2e0] pb-3">
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#161616]">
                + Add New Team Member
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#747878] hover:text-[#161616] p-1 text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Anand Mahindra"
                  className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={addForm.designation}
                  onChange={(e) => setAddForm({ ...addForm, designation: e.target.value })}
                  placeholder="e.g. Lead Facility Officer"
                  className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Department Role</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                  >
                    <option>Operations Staff</option>
                    <option>Operations / Facility</option>
                    <option>Branch Admin</option>
                    <option>Security Lead</option>
                    <option>Front Desk Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Shift Schedule</label>
                  <select
                    value={addForm.shift}
                    onChange={(e) => setAddForm({ ...addForm, shift: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                  >
                    <option>09:00 AM - 06:00 PM</option>
                    <option>08:30 AM - 05:30 PM</option>
                    <option>07:00 AM - 04:00 PM</option>
                    <option>06:30 AM - 03:30 PM</option>
                    <option>10:00 AM - 07:00 PM</option>
                    <option>02:00 PM - 11:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="name@workafella.com"
                    className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="+91 98400 00000"
                    className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#e3e2e0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f1] font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5b400] text-[#161616] font-bold rounded-xl"
                >
                  Register Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#161616] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-[#e3e2e0] pb-3">
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#161616]">
                Edit Staff Profile: {selectedStaff.name}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#747878] hover:text-[#161616] p-1 text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={editForm.designation}
                  onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Department Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                  >
                    <option>Operations Staff</option>
                    <option>Operations / Facility</option>
                    <option>Branch Admin</option>
                    <option>Security Lead</option>
                    <option>Front Desk Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Shift Schedule</label>
                  <select
                    value={editForm.shift}
                    onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                  >
                    <option>09:00 AM - 06:00 PM</option>
                    <option>08:30 AM - 05:30 PM</option>
                    <option>07:00 AM - 04:00 PM</option>
                    <option>06:30 AM - 03:30 PM</option>
                    <option>10:00 AM - 07:00 PM</option>
                    <option>02:00 PM - 11:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl outline-none focus:border-[#f5b400]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#e3e2e0]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f1] font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5b400] text-[#161616] font-bold rounded-xl"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

