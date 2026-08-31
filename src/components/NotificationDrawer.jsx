import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const NotificationDrawer = () => {
  const { isNotificationOpen, setIsNotificationOpen, notifications, markAllNotificationsRead, setCurrentScreen } = useApp();
  const [filter, setFilter] = useState('all');

  if (!isNotificationOpen) return null;

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => n.isUnread)
    : notifications;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay */}
      <div
        onClick={() => setIsNotificationOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#ffffff] border-l border-[#e3e2e0] shadow-2xl flex flex-col animate-slide-in-right">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#e3e2e0] bg-[#faf9f7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7b5900]">notifications</span>
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#161616]">
                Notification Center
              </h2>
            </div>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="text-[#747878] hover:text-[#161616] p-1.5 rounded-full hover:bg-[#e3e2e0] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="p-3 bg-white border-b border-[#e3e2e0] flex items-center justify-between text-xs">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-[#161616] text-[#f5b400]'
                    : 'text-[#747878] hover:bg-[#f4f3f1]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
                  filter === 'unread'
                    ? 'bg-[#161616] text-[#f5b400]'
                    : 'text-[#747878] hover:bg-[#f4f3f1]'
                }`}
              >
                Unread
              </button>
            </div>

            <button
              onClick={markAllNotificationsRead}
              className="text-[#7b5900] hover:text-[#161616] font-medium hover:underline text-xs"
            >
              Mark all as read
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf9f7] dark:bg-[#0f1011]">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-[#747878] text-xs">
                <span className="material-symbols-outlined text-4xl text-[#c4c7c7] dark:text-[#52525b] mb-2 block">
                  mark_email_read
                </span>
                No notifications to display.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border rounded-2xl transition-all ${
                    notif.isUnread
                      ? 'bg-[#fffbf2] dark:bg-[#f5b400]/10 border-[#f5b400] shadow-sm'
                      : 'bg-white dark:bg-[#17181a] border-[#e3e2e0] dark:border-[#27272a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          notif.isUnread ? 'bg-[#f5b400]' : 'bg-[#c4c7c7] dark:bg-[#52525b]'
                        }`}
                      ></span>
                      <h4 className="font-['Space_Grotesk'] text-xs font-bold text-[#161616] dark:text-white">
                        {notif.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#747878] dark:text-[#a1a1aa] whitespace-nowrap">{notif.time}</span>
                  </div>

                  <p className="text-xs text-[#444748] dark:text-[#d4d4d8] mt-1.5 leading-relaxed pl-4">
                    {notif.message}
                  </p>

                  <div className="mt-2.5 pl-4 flex items-center gap-3 text-[11px]">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#7b5900] dark:text-[#f5b400] bg-[#fff4e5] dark:bg-[#f5b400]/15 px-2 py-0.5 rounded-md">
                      {notif.channel}
                    </span>
                    {notif.actionScreen && (
                      <button
                        onClick={() => {
                          setCurrentScreen(notif.actionScreen);
                          setIsNotificationOpen(false);
                        }}
                        className="font-bold text-[#161616] dark:text-white hover:text-[#f5b400] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-white dark:bg-[#17181a] border-t border-[#e3e2e0] dark:border-[#27272a] flex items-center justify-between text-xs">
            <span className="text-[#747878] dark:text-[#a1a1aa]">Configure multi-channel alerts</span>
            <button
              onClick={() => {
                setCurrentScreen('notification_preferences');
                setIsNotificationOpen(false);
              }}
              className="text-[#7b5900] dark:text-[#f5b400] font-bold hover:underline cursor-pointer"
            >
              Notification Settings →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
