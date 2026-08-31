import React from 'react';

export const VisitorQRModal = ({ visitor, onClose }) => {
  if (!visitor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#faf9f7] border-2 border-[#161616] rounded-3xl shadow-2xl p-6 relative text-center overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#747878] hover:text-[#161616] p-1.5 rounded-full hover:bg-[#e3e2e0] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="w-12 h-12 bg-[#161616] text-[#f5b400] mx-auto mb-3 flex items-center justify-center rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-2xl">qr_code_2</span>
        </div>

        <div className="text-[10px] uppercase font-bold tracking-widest text-[#7b5900]">
          Digital Visitor Gate Pass
        </div>
        <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#161616] mb-1">
          {visitor.name}
        </h3>
        <p className="text-xs text-[#747878] mb-4">{visitor.company}</p>

        {/* High-Contrast Rounded QR Box */}
        <div className="p-5 bg-white border-2 border-[#161616] rounded-2xl inline-block shadow-inner mb-4">
          <div className="w-44 h-44 bg-[#161616] p-2 rounded-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between">
              <div className="w-10 h-10 border-4 border-[#f5b400] bg-[#161616] rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#f5b400] rounded-sm"></div>
              </div>
              <div className="w-10 h-10 border-4 border-[#f5b400] bg-[#161616] rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#f5b400] rounded-sm"></div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="text-center font-['Space_Grotesk'] text-[10px] font-bold text-[#f5b400] bg-[#161616] px-2.5 py-1 rounded-md border border-[#f5b400]">
                {visitor.qrCode || 'WF-PASS-LIVE'}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="w-10 h-10 border-4 border-[#f5b400] bg-[#161616] rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#f5b400] rounded-sm"></div>
              </div>
              <div className="w-8 h-8 bg-[#f5b400] rounded-lg flex items-center justify-center text-[#161616] font-bold text-[9px]">
                WF
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f4f3f1] border border-[#e3e2e0] rounded-xl p-3 text-xs text-left mb-5 space-y-1">
          <div className="flex justify-between">
            <span className="text-[#747878]">Host Employee:</span>
            <span className="font-semibold text-[#161616]">{visitor.host}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#747878]">Date & Slot:</span>
            <span className="font-semibold text-[#161616]">{visitor.date} • {visitor.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#747878]">Purpose:</span>
            <span className="font-semibold text-[#161616]">{visitor.purpose}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#161616] text-[#f5b400] font-bold text-xs hover:bg-[#2f3130] rounded-xl transition-colors shadow-sm"
        >
          Done & Close Pass
        </button>
      </div>
    </div>
  );
};
