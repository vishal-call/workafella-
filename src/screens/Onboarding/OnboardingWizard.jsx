import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { InteractiveFloorMap } from '../../components/InteractiveFloorMap';

export const OnboardingWizard = () => {
  const { clients, setClients, setCurrentScreen, activeBranch, addToast } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State across Steps
  const [formData, setFormData] = useState({
    clientName: 'Nexora Health Technologies Pvt Ltd',
    legalEntityName: 'Nexora Health India Private Limited',
    pan: 'AABCN7788P',
    gstin: '36AABCN7788P1Z4',
    parentGroup: 'Nexora Global Holdings',
    billingContactEmail: 'finance@nexorahealth.com',
    billingContactPhone: '+91 98450 11223',
    contractStart: '2026-09-01',
    contractEnd: '2027-08-31',
    billingModel: 'Monthly Seat-Based',
    seatsRequested: 35,
    ratePerSeat: 15500,
    selectedRooms: ['Suite 801 (20 Seats)', 'Suite 802 (15 Seats)'],
    adminName: 'Dr. Siddharth Sen',
    adminEmail: 'siddharth@nexorahealth.com',
    sendActivationEmail: true
  });

  const toggleRoomSelection = (roomLabel) => {
    if (formData.selectedRooms.includes(roomLabel)) {
      setFormData({
        ...formData,
        selectedRooms: formData.selectedRooms.filter((r) => r !== roomLabel)
      });
    } else {
      setFormData({
        ...formData,
        selectedRooms: [...formData.selectedRooms, roomLabel]
      });
    }
  };

  const handleFinalActivation = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F5B400', '#161616', '#1E8A5F', '#FFDEA4']
      });
    } catch (e) {
      // Ignore
    }

    const newClient = {
      id: `CL-${Date.now().toString().slice(-3)}`,
      name: formData.clientName,
      legalEntity: formData.legalEntityName,
      pan: formData.pan,
      gstin: formData.gstin,
      parentGroup: formData.parentGroup,
      centre: activeBranch.name,
      rooms: formData.selectedRooms.map((r) => (r.includes(' ') ? r.split(' ')[1] : r)),
      seats: Number(formData.seatsRequested),
      ratePerSeat: Number(formData.ratePerSeat),
      contractStart: formData.contractStart,
      contractEnd: formData.contractEnd,
      status: 'Active',
      freeHoursEntitlement: Number(formData.seatsRequested),
      freeHoursUsed: 0,
      riskScore: 10,
      churnRisk: 'Low'
    };

    setClients([newClient, ...clients]);
    addToast(`Client "${formData.clientName}" successfully onboarded! Activation sent to ${formData.adminEmail}.`, 'success', 'Client Activated');
    setCurrentScreen('workspace_allocation');
  };

  const steps = [
    { num: 1, label: 'Legal & Entity' },
    { num: 2, label: 'Contract & Pricing' },
    { num: 3, label: 'Floor Allocation' },
    { num: 4, label: 'Client Admin' },
    { num: 5, label: 'Review & Activate' }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Customer Lifecycle & Commercial Setup
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            New Client Onboarding Wizard
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Provision legal entities, contracts, workspace allocations, and client admin accounts in one unified flow.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="text-xs text-[#747878] hover:text-[#161616] font-semibold flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">close</span>
          <span>Cancel Onboarding</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white border border-[#e3e2e0] rounded-2xl p-4 shadow-sm flex flex-wrap justify-between items-center gap-3">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          return (
            <div
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                isCurrent
                  ? 'text-[#161616] font-bold'
                  : isDone
                  ? 'text-[#1e8a5f] font-semibold'
                  : 'text-[#858383]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-['Space_Grotesk'] font-bold ${
                  isCurrent
                    ? 'bg-[#f5b400] text-[#161616]'
                    : isDone
                    ? 'bg-[#1e8a5f] text-white'
                    : 'bg-[#f4f3f1] text-[#858383]'
                }`}
              >
                {isDone ? '✓' : step.num}
              </div>
              <span className="text-xs">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step Container Form */}
      <div className="bg-white border border-[#e3e2e0] rounded-3xl p-8 shadow-sm relative">
        {/* Step 1: Legal Entity & Identity KYC */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                1. Legal Entity & Tax KYC
              </h2>
              <p className="text-xs text-[#747878] mt-1">
                Enter official legal registered company name, PAN, and state GSTIN credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#161616] mb-1">Trade Brand Name</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-1">Registered Legal Entity Name</label>
                <input
                  type="text"
                  value={formData.legalEntityName}
                  onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-1">Corporate PAN (Permanent Account Number)</label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-1">GSTIN Number (15-Digit)</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl font-mono uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contract Terms & Commercial Pricing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                2. Contract Terms & Seat Pricing
              </h2>
              <p className="text-xs text-[#747878] mt-1">
                Configure lease duration, seat quotas, and monthly billing per desk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#161616] mb-1">Contract Start Date</label>
                <input
                  type="date"
                  value={formData.contractStart}
                  onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-1">Contract End Date</label>
                <input
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-1">Total Contracted Seats</label>
                <input
                  type="number"
                  value={formData.seatsRequested}
                  onChange={(e) => setFormData({ ...formData, seatsRequested: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl font-bold font-['Space_Grotesk']"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-1">Monthly Rate per Seat (₹)</label>
                <input
                  type="number"
                  value={formData.ratePerSeat}
                  onChange={(e) => setFormData({ ...formData, ratePerSeat: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl font-bold font-['Space_Grotesk']"
                />
              </div>
            </div>

            <div className="p-5 bg-[#f8f7f5] border border-[#e3e2e0] rounded-2xl text-xs space-y-1">
              <div className="font-bold text-[#161616]">Monthly Billing Projection:</div>
              <div className="font-['Space_Grotesk'] font-mono tabular-nums text-2xl font-bold text-[#161616]">
                ₹{(formData.seatsRequested * formData.ratePerSeat).toLocaleString('en-IN')}{' '}
                <span className="text-xs text-[#747878] font-normal">+ 18% GST</span>
              </div>
              <p className="text-[11px] text-[#1e8a5f] font-bold">
                ✓ Entitlement: {formData.seatsRequested} Free Meeting Room Hours / month included.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Interactive Visual Floor Allocation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                3. Interactive Floor Plan & Room Selection
              </h2>
              <p className="text-xs text-[#747878] mt-1">
                Select available suites from the blueprint to fulfill the {formData.seatsRequested} contracted seats.
              </p>
            </div>

            <InteractiveFloorMap
              selectedRooms={formData.selectedRooms}
              onToggleRoom={toggleRoomSelection}
            />

            <div className="p-4 bg-[#f8f7f5] border border-[#e3e2e0] rounded-2xl text-xs flex justify-between items-center">
              <div>
                <span className="text-[#747878]">Currently Selected Rooms:</span>
                <div className="font-bold text-[#161616] mt-0.5">
                  {formData.selectedRooms.join(' • ') || 'None selected'}
                </div>
              </div>
              <span className="font-['Space_Grotesk'] font-bold text-sm text-[#1e8a5f] bg-[#e7f5ed] px-3 py-1 rounded-full ring-1 ring-inset ring-emerald-600/20">
                {formData.selectedRooms.length} Rooms Allocated
              </span>
            </div>
          </div>
        )}

        {/* Step 4: Client Admin Corporate Account */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                4. Client Administrator Account
              </h2>
              <p className="text-xs text-[#747878] mt-1">
                Designate primary corporate admin for self-service portal, billing, and biometric access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#161616] mb-1">Admin Full Name</label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#161616] mb-1">Corporate Work Email</label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] outline-none rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Activate */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
                5. Review Commercial Summary & Activate
              </h2>
              <p className="text-xs text-[#747878] mt-1">
                Verify all contract terms and committed rooms before releasing workspace credentials.
              </p>
            </div>

            <div className="p-5 bg-[#f8f7f5] border border-[#e3e2e0] rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#e3e2e0] pb-2">
                <span className="text-[#747878]">Client Entity:</span>
                <span className="font-bold text-[#161616]">{formData.clientName} ({formData.legalEntityName})</span>
              </div>
              <div className="flex justify-between border-b border-[#e3e2e0] pb-2">
                <span className="text-[#747878]">Allocated Suites:</span>
                <span className="font-bold text-[#161616]">{formData.selectedRooms.join(', ')}</span>
              </div>
              <div className="flex justify-between border-b border-[#e3e2e0] pb-2">
                <span className="text-[#747878]">Contract Duration:</span>
                <span className="font-bold text-[#161616]">{formData.contractStart} to {formData.contractEnd}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1">
                <span className="text-[#161616]">Monthly Billing:</span>
                <span className="font-['Space_Grotesk'] font-mono tabular-nums text-base text-[#161616]">
                  ₹{(formData.seatsRequested * formData.ratePerSeat).toLocaleString('en-IN')} + GST
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="pt-6 border-t border-[#e3e2e0] flex justify-between items-center mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2.5 bg-[#f4f3f1] border border-[#e3e2e0] text-[#161616] font-bold text-xs hover:bg-[#e3e2e0] rounded-xl transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-7 py-3 bg-[#161616] text-[#f5b400] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#2f3130] rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Continue Step {currentStep + 1}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalActivation}
              className="px-8 py-3.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-sm hover:bg-[#ffdea4] rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Activate & Commit Contract</span>
              <span className="material-symbols-outlined text-base">verified</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
