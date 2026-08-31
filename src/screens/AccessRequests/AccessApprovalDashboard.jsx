import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlurredIDModal } from '../../components/BlurredIDModal';

export const AccessApprovalDashboard = () => {
  const { accessRequests, setAccessRequests, activeBranch } = useApp();
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApproveStatus = (id, newStatus) => {
    setAccessRequests(
      accessRequests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    alert(`Access request ${id} updated to "${newStatus}".`);
  };

  const handleEnrollmentComplete = (id) => {
    setAccessRequests(
      accessRequests.map((r) =>
        r.id === id ? { ...r, status: 'Active', biometricStatus: 'Enrolled & Synced' } : r
      )
    );
    alert(`Biometric hardware sync confirmed for ${id}. Access is now fully ACTIVE.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Identity & Gate Clearance
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Employee Access & Biometric Approvals
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Review submitted KYC identity records, authorize building clearances, and log physical biometric captures at {activeBranch.name}.
          </p>
        </div>

        <span className="text-xs font-bold bg-[#161616] text-[#f5b400] px-3.5 py-2">
          {accessRequests.length} Total Requests Processed
        </span>
      </div>

      {/* Access Requests Table */}
      <div className="bg-white border border-[#3a3a3a] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Request ID</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Employee Name</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Employer / Client</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Floor / Suite</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Biometric Sync</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Status</th>
              <th className="p-3.5 font-bold font-['Space_Grotesk'] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2e0]">
            {accessRequests.map((req) => (
              <tr key={req.id} className="hover:bg-[#f8f7f5] transition-colors">
                <td className="p-3.5 font-mono font-bold text-[#7b5900]">{req.id}</td>
                <td className="p-3.5 font-bold text-[#161616]">
                  <div>{req.employeeName}</div>
                  <div className="text-[10px] text-[#747878] font-normal">{req.email}</div>
                </td>
                <td className="p-3.5 text-[#444748]">{req.company}</td>
                <td className="p-3.5 text-[#161616] font-medium">{req.floorRoom}</td>
                <td className="p-3.5 text-[#1e8a5f] font-semibold">{req.biometricStatus}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold ${
                      req.status === 'Active'
                        ? 'bg-[#e7f5ed] text-[#1e8a5f]'
                        : req.status === 'Enrollment Pending'
                        ? 'bg-[#fff4e5] text-[#c77800]'
                        : 'bg-[#f4f3f1] text-[#161616]'
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="px-3.5 py-1.5 bg-[#f5b400] text-[#161616] font-bold text-xs hover:bg-[#ffdea4] transition-colors"
                  >
                    Inspect & Authorize
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blurred ID & Biometric Activation Modal */}
      {selectedRequest && (
        <BlurredIDModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApproveStatus}
          onEnrollmentComplete={handleEnrollmentComplete}
        />
      )}
    </div>
  );
};
