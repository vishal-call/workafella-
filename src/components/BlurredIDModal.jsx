import React, { useState } from 'react';

export const BlurredIDModal = ({ request, onClose, onApprove, onEnrollmentComplete }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#faf9f7] border-2 border-[#161616] rounded-3xl shadow-2xl p-6 relative overflow-hidden">
        <div className="flex items-start justify-between border-b border-[#e3e2e0] pb-3 mb-4">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900]">
              Identity & Access Verification
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616]">
              {request.employeeName}
            </h3>
            <p className="text-xs text-[#747878]">{request.company} • {request.floorRoom}</p>
          </div>

          <button
            onClick={onClose}
            className="text-[#747878] hover:text-[#161616] p-1.5 rounded-full hover:bg-[#e3e2e0] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Blurred Sensitive ID Box */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-[#161616] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#c77800]">lock</span>
              Confidential KYC Document: {request.idDocument}
            </span>
            <span className="text-[10px] text-[#747878]">Audit Logged</span>
          </div>

          <div className="relative border border-[#3a3a3a] bg-[#161616] p-6 text-center rounded-2xl overflow-hidden shadow-inner">
            <div
              className={`p-6 bg-[#2f3130] text-white border border-[#444748] rounded-xl transition-all duration-300 ${
                isRevealed ? 'filter-none' : 'filter blur-md select-none'
              }`}
            >
              <div className="text-xs font-bold text-[#f5b400] uppercase mb-1">Government ID Proof</div>
              <div className="text-sm font-['Space_Grotesk'] font-bold">XXXX - XXXX - 8921</div>
              <div className="text-[11px] text-[#dadad8] mt-1">{request.employeeName}</div>
              <div className="text-[10px] text-[#9ca3af] mt-2">Verified against Employer KYC Registry</div>
            </div>

            {!isRevealed && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
                <span className="material-symbols-outlined text-[#f5b400] text-3xl mb-1">visibility_off</span>
                <p className="text-xs text-white font-medium mb-3">Sensitive PII is masked by default</p>
                <button
                  onClick={() => setIsRevealed(true)}
                  className="px-4 py-2 bg-[#f5b400] text-[#161616] font-bold text-xs hover:bg-[#ffdea4] rounded-xl transition-colors shadow-sm"
                >
                  Authorize & View Document
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Access Scopes */}
        <div className="bg-white border border-[#e3e2e0] rounded-xl p-3 text-xs mb-5 space-y-1.5">
          <div className="font-bold text-[#161616]">Requested Access Permissions:</div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {request.scope.map((s, idx) => (
              <span key={idx} className="bg-[#f4f3f1] border border-[#e3e2e0] px-2.5 py-1 text-[11px] rounded-lg text-[#161616] font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {request.status === 'Under Review' && (
            <>
              <button
                onClick={() => {
                  onApprove(request.id, 'Rejected');
                  onClose();
                }}
                className="px-4 py-2.5 bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs hover:bg-[#ffb5a1] rounded-xl transition-colors"
              >
                Reject Request
              </button>
              <button
                onClick={() => {
                  onApprove(request.id, 'Enrollment Pending');
                  onClose();
                }}
                className="px-5 py-2.5 bg-[#f5b400] text-[#161616] font-bold text-xs hover:bg-[#ffdea4] rounded-xl transition-colors flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                <span>Approve for Biometric Enrollment</span>
              </button>
            </>
          )}

          {request.status === 'Enrollment Pending' && (
            <button
              onClick={() => {
                onEnrollmentComplete(request.id);
                onClose();
              }}
              className="w-full py-3 bg-[#1e8a5f] text-white font-bold text-xs hover:bg-[#161616] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">fingerprint</span>
              <span>Confirm Hardware Biometric Capture & Activate</span>
            </button>
          )}

          {request.status === 'Active' && (
            <div className="w-full text-center text-xs text-[#1e8a5f] font-bold py-2 bg-[#e7f5ed] rounded-xl">
              ✓ Access is Active & Synchronized with Front Gates
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
