import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const NotificationPreferences = () => {
  const { setCurrentScreen } = useApp();

  const [preferences, setPreferences] = useState([
    { event: 'Meeting Room Hold Expiry Warning (< 1 min)', email: true, sms: false, whatsapp: false, inApp: true },
    { event: 'Monthly GST Invoice Released / Generated', email: true, sms: true, whatsapp: true, inApp: true },
    { event: 'Support Ticket SLA Breach Warning', email: true, sms: true, whatsapp: false, inApp: true },
    { event: 'Visitor Pre-Registration & Gate Pass Issued', email: true, sms: true, whatsapp: true, inApp: true },
    { event: 'Employee Biometric Access Request Approval', email: true, sms: false, whatsapp: false, inApp: true },
    { event: 'Branch Operational Expense Dual Sign-off Required', email: true, sms: false, whatsapp: false, inApp: true }
  ]);

  const toggleChannel = (idx, channel) => {
    const updated = [...preferences];
    updated[idx][channel] = !updated[idx][channel];
    setPreferences(updated);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] font-bold mb-1">
            Communication Channels & Alerts
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616]">
            Notification Preferences
          </h1>
          <p className="text-xs text-[#747878] mt-1">
            Configure multi-channel dispatch rules across In-App, Email, SMS, and WhatsApp.
          </p>
        </div>

        <button
          onClick={() => {
            alert('Notification preferences saved successfully.');
            setCurrentScreen('dashboard');
          }}
          className="px-5 py-2.5 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-base">save</span>
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Preferences Table */}
      <div className="bg-white border border-[#3a3a3a] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
              <th className="p-3.5 font-bold font-['Space_Grotesk']">Event Trigger</th>
              <th className="p-3.5 font-bold text-center">In-App</th>
              <th className="p-3.5 font-bold text-center">Email</th>
              <th className="p-3.5 font-bold text-center">SMS</th>
              <th className="p-3.5 font-bold text-center">WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2e0]">
            {preferences.map((p, idx) => (
              <tr key={idx} className="hover:bg-[#f8f7f5]">
                <td className="p-3.5 font-semibold text-[#161616]">{p.event}</td>
                <td className="p-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={p.inApp}
                    onChange={() => toggleChannel(idx, 'inApp')}
                    className="text-[#f5b400] rounded-none focus:ring-0"
                  />
                </td>
                <td className="p-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={p.email}
                    onChange={() => toggleChannel(idx, 'email')}
                    className="text-[#f5b400] rounded-none focus:ring-0"
                  />
                </td>
                <td className="p-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={p.sms}
                    onChange={() => toggleChannel(idx, 'sms')}
                    className="text-[#f5b400] rounded-none focus:ring-0"
                  />
                </td>
                <td className="p-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={p.whatsapp}
                    onChange={() => toggleChannel(idx, 'whatsapp')}
                    className="text-[#f5b400] rounded-none focus:ring-0"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
