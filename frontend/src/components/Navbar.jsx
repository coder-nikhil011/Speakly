import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import logo from "../assets/navbar_logo.png";
import { Link } from "react-router-dom";
import React from "react";

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (e) { console.error(e); }
  };

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
        await notificationService.markAllAsRead();
        setUnreadCount(0);
      } catch (e) { console.error(e); }
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative p-2">
        🔔 
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 w-80 bg-white shadow-xl rounded-lg border mt-2 z-50">
          <div className="p-3 border-b font-bold">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications yet</div>
            ) : (
              notifications.map(n => (
                <div key={n._id} className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!n.isRead ? 'bg-blue-50' : ''}`}>
                  <div className="font-semibold text-sm">{n.title}</div>
                  <div className="text-xs text-gray-600">{n.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  return (
     <nav className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="#top" className="flex items-center">
          <img
            src={logo}
            alt="Speakly"
            className="h-14 w-auto object-contain"
         />
        </Link>

        <NotificationBell />
        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#how"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            How it works
         </a>

         <a
            href="#learn"
           className="text-sm font-medium text-slate-600 transition hover:text-slate-600"          >
           What you learn
          </a>

         <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
         >
            Features
          </a>
          <a
            href="#student"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            For Students
         </a>
          <a
            href="#teacher"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
           For Teachers
         </a>

         <a
            href="#pricing"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            Pricing
          </a>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden px-4 py-2 text-sm font-semibold text-slate-700 sm:block">
            Log in
          </Link>

          <Link to="/signup" className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-600">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}
export default Navbar;