import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const AIChatAssistant = () => {
  const { isAIChatOpen, setIsAIChatOpen, currentUser, startRoomHold, meetingRooms, setCurrentScreen } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello ${currentUser.name.split(' ')[0]}! I am your Workafella AI Workspace Assistant. How can I assist you with your space, bookings, service requests, or billing today?`,
      time: 'Just now',
      actionCard: null
    }
  ]);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Book The Boardroom tomorrow at 10 AM',
    'What is my August invoice status?',
    'Raise an urgent Wi-Fi ticket',
    'Show me today visitor expected log'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    setTimeout(() => {
      let botResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        time: 'Just now',
        text: '',
        actionCard: null
      };

      const lower = text.toLowerCase();

      if (lower.includes('boardroom') || lower.includes('book')) {
        botResponse.text = `I have verified availability for The Boardroom 7A (16 seats) at Hitec City. Here is your proposed reservation with free entitlement calculation:`;
        botResponse.actionCard = {
          type: 'booking_proposal',
          title: 'Proposed Room Booking',
          room: 'The Boardroom 7A',
          centre: 'Hitec City, Floor 7',
          timeSlot: 'Aug 30, 2026 • 10:00 AM - 12:00 PM (2 hrs)',
          entitlementStatus: '2 hrs Free Entitlement (₹0 Billable)',
          actionLabel: 'Initiate 5-Min Hold',
          onAction: () => {
            startRoomHold(meetingRooms[0], {
              date: '2026-08-30',
              timeSlot: '10:00 AM - 12:00 PM',
              durationHours: 2,
              attendees: 12,
              entitlementHours: 2,
              billableAmount: 0
            });
            setCurrentScreen('book_room');
            setIsAIChatOpen(false);
          }
        };
      } else if (lower.includes('invoice') || lower.includes('billing')) {
        botResponse.text = `Your August 2026 invoice (INV-2026-08-01) for ₹7,69,950 has been approved and released. Due date is Sept 5, 2026.`;
        botResponse.actionCard = {
          type: 'view_invoice',
          title: 'Invoice INV-2026-08-01',
          room: 'Acme Innovations Pvt Ltd',
          centre: 'Status: Approved & Released',
          timeSlot: 'Total: ₹7,69,950 (Includes 18% GST)',
          entitlementStatus: '45 Seats + 18 hrs Meeting Room',
          actionLabel: 'View Invoice Detail',
          onAction: () => {
            setCurrentScreen('client_billing');
            setIsAIChatOpen(false);
          }
        };
      } else if (lower.includes('ticket') || lower.includes('wi-fi') || lower.includes('internet')) {
        botResponse.text = `I can instantly open an Urgent priority ticket for your dedicated leased line. Please review the ticket summary:`;
        botResponse.actionCard = {
          type: 'create_ticket',
          title: 'Support Ticket Draft',
          room: 'Category: Internet / Wi-Fi',
          centre: 'Location: Suite 705, Hitec City',
          timeSlot: 'Priority: Urgent • SLA: 4 Hours',
          entitlementStatus: 'Assignee: Network Operations Lead',
          actionLabel: 'Go to Ticket Submission',
          onAction: () => {
            setCurrentScreen('raise_ticket');
            setIsAIChatOpen(false);
          }
        };
      } else if (lower.includes('visitor') || lower.includes('log')) {
        botResponse.text = `There are currently 3 visitors scheduled for today at Hitec City, including 1 Checked-In and 1 Expected.`;
        botResponse.actionCard = {
          type: 'view_visitors',
          title: 'Visitor Front-Desk Queue',
          room: 'Ravi Teja Varma (Sequoia)',
          centre: 'Host: Ananya Sharma',
          timeSlot: '11:00 AM - 01:00 PM • Expected',
          entitlementStatus: 'Pass QR: WF-QR-889021',
          actionLabel: 'Open Gate Pass View',
          onAction: () => {
            setCurrentScreen('visitor_history');
            setIsAIChatOpen(false);
          }
        };
      } else {
        botResponse.text = `I have consulted the Workafella Workspace Policy and operational database. All centres are active with standard 24/7 biometric access, cafeteria operations, and high-speed enterprise redundancy. Would you like me to book a room, log an issue, or check billing?`;
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  if (!isAIChatOpen) {
    return (
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#f5b400] text-[#161616] font-bold p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 border-2 border-[#161616] animate-gold-glow cursor-pointer"
        title="Open Workafella AI Assistant"
      >
        <span className="material-symbols-outlined text-2xl">psychology</span>
        <span className="text-xs tracking-wider uppercase font-extrabold pr-1">AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-[#ffffff] border-2 border-[#161616] rounded-3xl shadow-2xl flex flex-col h-[560px] animate-fade-in-up duration-300 overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#161616] text-[#ffffff] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#f5b400] text-[#161616] flex items-center justify-center font-bold rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-lg">psychology</span>
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white">
              Workafella AI Assistant
            </h3>
            <span className="text-[10px] text-[#f5b400] tracking-wider uppercase font-semibold block">
              Autonomous Decision Support
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAIChatOpen(false)}
          className="text-[#858383] hover:text-white transition-colors p-1 rounded-full hover:bg-[#2f3130]"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf9f7]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 text-xs leading-relaxed rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-[#161616] text-white rounded-br-none'
                  : 'bg-[#ffffff] text-[#161616] border border-[#e3e2e0] shadow-sm rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>

              {/* Action Confirmation Card if triggered */}
              {msg.actionCard && (
                <div className="mt-3 p-3 bg-[#f4f3f1] border border-[#3a3a3a] rounded-xl text-left">
                  <div className="text-[11px] font-bold text-[#161616] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#f5b400] text-sm">bolt</span>
                    {msg.actionCard.title}
                  </div>
                  <div className="text-[11px] text-[#444748] mt-1">
                    <div className="font-semibold text-[#161616]">{msg.actionCard.room}</div>
                    <div>{msg.actionCard.centre}</div>
                    <div>{msg.actionCard.timeSlot}</div>
                    <div className="text-[#1e8a5f] font-bold mt-0.5">{msg.actionCard.entitlementStatus}</div>
                  </div>
                  <button
                    onClick={msg.actionCard.onAction}
                    className="w-full mt-2.5 py-2 bg-[#f5b400] text-[#161616] font-bold text-xs hover:bg-[#ffdea4] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>{msg.actionCard.actionLabel}</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
            <span className="text-[9px] text-[#747878] mt-1 px-1">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 bg-[#f4f3f1] border-t border-[#e3e2e0] flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap text-[10px] bg-white border border-[#c4c7c7] px-3 py-1 rounded-full text-[#161616] hover:border-[#f5b400] hover:text-[#7b5900] transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-[#ffffff] border-t border-[#e3e2e0] flex gap-2">
        <input
          type="text"
          placeholder="Ask AI or command an action..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 text-xs px-3.5 py-2 bg-[#f4f3f1] border border-[#e3e2e0] focus:border-[#f5b400] focus:bg-white outline-none rounded-xl"
        />
        <button
          onClick={() => handleSend()}
          className="px-3.5 bg-[#161616] text-[#f5b400] hover:bg-[#2f3130] rounded-xl transition-colors flex items-center justify-center font-bold shadow-sm"
        >
          <span className="material-symbols-outlined text-base">send</span>
        </button>
      </div>
    </div>
  );
};
