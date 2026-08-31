import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const AssetRegister = () => {
  const { activeBranch, addToast, assets, setAssets } = useApp();
  const [qrModalAsset, setQrModalAsset] = useState(null);
  const [serviceNote, setServiceNote] = useState('');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(assets[0] || null);

  // New Asset Registration Form State
  const [newAssetForm, setNewAssetForm] = useState({
    name: '',
    category: 'IT & Networking',
    location: 'Floor 7 Server Room',
    assignedTo: 'Naveen Kumar',
    condition: 'Good',
    purchaseValue: '450000',
    warrantyExpiry: '2029-12-31',
    amcVendor: 'Cisco SmartNet Premium'
  });

  const handleRegisterAsset = (e) => {
    e.preventDefault();
    if (!newAssetForm.name.trim()) return;

    soundFx.playChime();

    const categoryPrefix = {
      'HVAC & Climate': 'AC',
      'IT & Networking': 'NET',
      'Power & Utilities': 'GEN',
      'Audio / Visual': 'AV',
      'Security & Biometrics': 'SEC'
    }[newAssetForm.category] || 'AST';

    const pValue = Number(newAssetForm.purchaseValue) || 100000;

    const newAsset = {
      id: `WF-${categoryPrefix}-${Math.floor(700 + Math.random() * 200)}`,
      name: newAssetForm.name,
      category: newAssetForm.category,
      location: newAssetForm.location,
      assignedTo: newAssetForm.assignedTo,
      condition: newAssetForm.condition,
      purchaseValue: pValue,
      currentValue: Math.round(pValue * 0.95),
      warrantyExpiry: newAssetForm.warrantyExpiry,
      amcVendor: newAssetForm.amcVendor,
      amcDueDays: 365,
      purchaseDate: new Date().toISOString().split('T')[0],
      timeline: [
        {
          date: 'Today',
          event: `Registered in Workafella Enterprise Asset Registry. Initial barcode & QR tag generated.`,
          cost: '₹0'
        }
      ]
    };

    setAssets([newAsset, ...assets]);
    setSelectedAsset(newAsset);
    setIsNewAssetModalOpen(false);
    setNewAssetForm({
      name: '',
      category: 'IT & Networking',
      location: 'Floor 7 Server Room',
      assignedTo: 'Naveen Kumar',
      condition: 'Good',
      purchaseValue: '450000',
      warrantyExpiry: '2029-12-31',
      amcVendor: 'Cisco SmartNet Premium'
    });

    addToast(`Successfully registered ${newAsset.name} (#${newAsset.id})`, 'success', 'Asset Registered');
  };

  const handleAddServiceLog = (e) => {
    e.preventDefault();
    if (!serviceNote.trim()) return;

    soundFx.playChime();
    const newLog = {
      date: 'Today',
      event: serviceNote,
      cost: '₹0 (Warranty AMC)'
    };

    const updatedAssets = assets.map((a) =>
      a.id === selectedAsset.id
        ? { ...a, timeline: [newLog, ...a.timeline] }
        : a
    );

    setAssets(updatedAssets);
    setSelectedAsset({ ...selectedAsset, timeline: [newLog, ...selectedAsset.timeline] });
    setServiceNote('');
    setIsServiceModalOpen(false);
    addToast(`Logged preventative maintenance action for ${selectedAsset.name}`, 'success', 'Service Logged');
  };

  const totalBookValue = assets.reduce((sum, a) => sum + a.currentValue, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Physical Infrastructure & Capital Equipment • {activeBranch.city}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616] dark:text-white">
            Asset Register & Maintenance Lifecycle
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Track hardware conditions, QR asset tags, AMC warranty countdowns, and maintenance logs at {activeBranch.name}.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsNewAssetModalOpen(true);
          }}
          className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>+ Register New Asset</span>
        </button>
      </div>

      {/* Two Column Layout: Asset Table & Detail Timeline Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Asset Registry Table */}
        <div className="lg:col-span-7 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-[#e3e2e0] dark:border-[#27272a]">
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#161616] dark:text-white">
                Registered Capital Assets ({assets.length})
              </h3>
              <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-0.5">Click any asset to inspect lifecycle log</p>
            </div>

            <span className="text-xs font-mono font-bold text-[#1e8a5f] bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 px-3 py-1 rounded-full">
              ₹{(totalBookValue / 100000).toFixed(1)}L Net Book Value
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-bold font-['Space_Grotesk']">Asset Tag / QR</th>
                  <th className="p-3 font-bold font-['Space_Grotesk']">Equipment Name</th>
                  <th className="p-3 font-bold font-['Space_Grotesk']">Location</th>
                  <th className="p-3 font-bold font-['Space_Grotesk']">AMC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e0] dark:divide-[#27272a]">
                {assets.map((ast) => {
                  const isSelected = selectedAsset.id === ast.id;
                  return (
                    <tr
                      key={ast.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedAsset(ast);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#fffbf2] dark:bg-[#f5b400]/15 border-l-4 border-l-[#f5b400]'
                          : 'hover:bg-[#f8f7f5] dark:hover:bg-[#202024]'
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundFx.playClick();
                              setQrModalAsset(ast);
                            }}
                            className="p-1 bg-[#161616] text-[#f5b400] rounded-md hover:scale-110 transition-all cursor-pointer"
                            title="Inspect QR Asset Tag"
                          >
                            <span className="material-symbols-outlined text-xs">qr_code_2</span>
                          </button>
                          <span className="font-mono font-bold text-[#7b5900] dark:text-[#f5b400] text-[10px]">
                            {ast.id}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-[#161616] dark:text-white">
                        <div>{ast.name}</div>
                        <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa] font-normal">{ast.category}</div>
                      </td>
                      <td className="p-3 text-[#444748] dark:text-[#d4d4d8] text-[11px]">{ast.location}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold text-[#1e8a5f] bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 px-2 py-0.5 rounded-full">
                          {ast.amcDueDays}d AMC Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Asset Deep-Dive & Timeline */}
        <div className="lg:col-span-5 bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex justify-between items-start pb-3 border-b border-[#e3e2e0] dark:border-[#27272a]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5b400]">
                  {selectedAsset.id}
                </span>
                <span className="text-[9px] font-bold bg-[#e6f4ea] text-[#1e8a5f] dark:bg-[#1e8a5f]/20 px-2 py-0.5 rounded-md">
                  Condition: {selectedAsset.condition}
                </span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616] dark:text-white mt-1">
                {selectedAsset.name}
              </h3>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                setQrModalAsset(selectedAsset);
              }}
              className="p-2 bg-[#f4f3f1] dark:bg-[#222326] hover:bg-[#f5b400] text-[#161616] dark:text-white hover:text-[#161616] rounded-xl transition-all cursor-pointer"
              title="View Digital QR Tag"
            >
              <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
            </button>
          </div>

          {/* Asset Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#f8f7f5] dark:bg-[#1a1b1d] p-4 rounded-2xl border border-[#e3e2e0] dark:border-[#27272a]">
            <div>
              <span className="text-[#747878] dark:text-[#a1a1aa] block text-[10px]">Purchase Value:</span>
              <strong className="text-[#161616] dark:text-white font-mono">₹{selectedAsset.purchaseValue.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[#747878] dark:text-[#a1a1aa] block text-[10px]">Current Book Value:</span>
              <strong className="text-[#1e8a5f] font-mono">₹{selectedAsset.currentValue.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[#747878] dark:text-[#a1a1aa] block text-[10px]">Warranty Expiry:</span>
              <strong className="text-[#161616] dark:text-white font-mono">{selectedAsset.warrantyExpiry}</strong>
            </div>
            <div>
              <span className="text-[#747878] dark:text-[#a1a1aa] block text-[10px]">AMC Vendor:</span>
              <strong className="text-[#161616] dark:text-white truncate block">{selectedAsset.amcVendor}</strong>
            </div>
          </div>

          {/* Maintenance Timeline */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider text-[#747878] dark:text-[#a1a1aa]">
                Preventative Maintenance Timeline
              </h4>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="text-[10px] font-bold text-[#f5b400] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">add</span>
                <span>+ Log Service</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-0.5">
              {selectedAsset.timeline.map((tm, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#faf9f7] dark:bg-[#121315] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl text-xs space-y-1"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#f5b400] font-mono">{tm.date}</span>
                    <span className="font-mono text-[#747878] dark:text-[#a1a1aa]">{tm.cost}</span>
                  </div>
                  <p className="text-xs text-[#444748] dark:text-[#d4d4d8] leading-relaxed">{tm.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Register New Asset Modal */}
      {isNewAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-[#161616] dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#e3e2e0] dark:border-[#27272a]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5b400]">
                  Capital Asset Registry
                </span>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold mt-0.5">
                  Register New Fixed Equipment
                </h3>
              </div>
              <button
                onClick={() => setIsNewAssetModalOpen(false)}
                className="p-1.5 text-[#747878] hover:text-black dark:hover:text-white rounded-full hover:bg-[#f4f3f1] dark:hover:bg-[#202024] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterAsset} className="space-y-4 text-xs">
              {/* Asset Name */}
              <div>
                <label className="block font-bold mb-1">Equipment Name / Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samsung Flip 65-inch Interactive 4K Display"
                  value={newAssetForm.name}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, name: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] focus:border-[#f5b400] rounded-xl outline-none text-[#161616] dark:text-white"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Asset Category</label>
                  <select
                    value={newAssetForm.category}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, category: e.target.value })}
                    className="w-full p-3 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none text-[#161616] dark:text-white"
                  >
                    <option>IT & Networking</option>
                    <option>HVAC & Climate</option>
                    <option>Power & Utilities</option>
                    <option>Audio / Visual</option>
                    <option>Security & Biometrics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Physical Location / Zone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Boardroom 7A / Floor 7"
                    value={newAssetForm.location}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, location: e.target.value })}
                    className="w-full p-3 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] focus:border-[#f5b400] rounded-xl outline-none text-[#161616] dark:text-white"
                  />
                </div>
              </div>

              {/* Purchase Value & Warranty Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Purchase Invoice Value (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 380000"
                    value={newAssetForm.purchaseValue}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, purchaseValue: e.target.value })}
                    className="w-full p-3 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] focus:border-[#f5b400] rounded-xl outline-none text-[#161616] dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Warranty / AMC Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newAssetForm.warrantyExpiry}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, warrantyExpiry: e.target.value })}
                    className="w-full p-3 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none text-[#161616] dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* AMC Vendor Partner & In-Charge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Contracted AMC Vendor Partner</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crestron India Pro Services"
                    value={newAssetForm.amcVendor}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, amcVendor: e.target.value })}
                    className="w-full p-3 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none text-[#161616] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Assigned Custodian / In-Charge</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Naveen Kumar (IT Ops)"
                    value={newAssetForm.assignedTo}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, assignedTo: e.target.value })}
                    className="w-full p-3 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none text-[#161616] dark:text-white"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-[#e3e2e0] dark:border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setIsNewAssetModalOpen(false)}
                  className="flex-1 py-3 bg-[#f4f3f1] dark:bg-[#202024] text-[#747878] dark:text-[#a1a1aa] font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold rounded-xl shadow-md hover:bg-[#ffdea4] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Register & Generate QR Tag</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset QR Code Modal */}
      {qrModalAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#17181a] border-2 border-[#f5b400] rounded-3xl p-6 shadow-2xl space-y-4 text-center text-[#161616] dark:text-white">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5b400]">
                Workafella Digital Asset Tag
              </span>
              <button onClick={() => setQrModalAsset(null)} className="cursor-pointer">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Generated QR Code Simulation */}
            <div className="w-44 h-44 mx-auto bg-white p-3 border-2 border-[#161616] rounded-2xl flex flex-col items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-7xl text-[#161616]">qr_code_2</span>
              <span className="text-[10px] font-mono font-extrabold text-[#161616]">{qrModalAsset.id}</span>
            </div>

            <div>
              <h4 className="font-['Space_Grotesk'] text-sm font-bold">{qrModalAsset.name}</h4>
              <p className="text-[11px] text-[#747878] dark:text-[#a1a1aa] mt-0.5">{qrModalAsset.location}</p>
              <div className="mt-2 text-[10px] text-[#1e8a5f] font-bold bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 py-1 rounded-lg">
                AMC: {qrModalAsset.amcVendor}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                addToast(`Exported printable QR tag for ${qrModalAsset.id}`, 'success');
                setQrModalAsset(null);
              }}
              className="w-full py-2.5 bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-bold text-xs rounded-xl shadow-sm cursor-pointer"
            >
              Print Equipment QR Label 🖨️
            </button>
          </div>
        </div>
      )}

      {/* Log Service Action Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-2xl space-y-4 text-[#161616] dark:text-white">
            <h3 className="font-['Space_Grotesk'] text-base font-bold">
              Log Preventative Maintenance Action
            </h3>
            <form onSubmit={handleAddServiceLog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Equipment Name</label>
                <input
                  type="text"
                  disabled
                  value={selectedAsset.name}
                  className="w-full p-2.5 bg-[#e3e2e0] dark:bg-[#202024] border border-[#c4c7c7] dark:border-[#2e2f33] rounded-xl cursor-not-allowed font-semibold text-[#161616] dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Service Action Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Quarterly ultrasonic coil wash and refrigerant pressure test..."
                  value={serviceNote}
                  onChange={(e) => setServiceNote(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none text-[#161616] dark:text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f5b400] text-[#161616] font-bold rounded-xl cursor-pointer"
                >
                  Save Maintenance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
