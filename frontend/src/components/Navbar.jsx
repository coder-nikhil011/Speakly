1|import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import logo from "../assets/navbar_logo.png";
2|import { Link } from "react-router-dom";
3|import React from "react";
4|
5|
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
6|  return (
7|    <nav className="border-b border-slate-100 bg-white">
8|      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
9|
10|        {/* Logo */}
11|        <Link to="#top" className="flex items-center">
12|          <img
13|            src={logo}
14|            alt="Speakly"
15|            className="h-14 w-auto object-contain"
16|          />
17|        </Link>
18|
19|        <NotificationBell />
        {/* Navigation */}
20|        <div className="hidden items-center gap-8 md:flex">
21|          <a
22|            href="#how"
23|            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
24|          >
25|            How it works
26|          </a>
27|
28|          <a
29|            href="#learn"
30|            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
31|          >
32|            What you learn
33|          </a>
34|
35|          <a
36|            href="#features"
37|            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
38|          >
39|            Features
40|          </a>
41|
42|          <a
43|            href="#student"
44|            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
45|          >
46|            For Students
47|          </a>
48|          <a
49|            href="#teacher"
50|            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
51|          >
52|            For Teachers
53|          </a>
54|
55|          <a
56|            href="#pricing"
57|            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
58|          >
59|            Pricing
60|          </a>
61|        </div>
62|
63|        {/* Buttons */}
64|        <div className="flex items-center gap-3">
65|          <Link to="/login" className="hidden px-4 py-2 text-sm font-semibold text-slate-700 sm:block">
66|            Log in
67|          </Link>
68|
69|          <Link to="/signup" className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-600">
70|            Get Started
71|          </Link>
72|        </div>
73|
74|      </div>
75|    </nav>
76|  );
77|}
78|
79|export default Navbar;