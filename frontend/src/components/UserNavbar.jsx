import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import { logoutUser, getStoredUser } from "../services/authService";
import { getNotifications, getUnreadCount, markNotificationRead } from "../services/notificationService";

function UserNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const user = getStoredUser();

  React.useEffect(() => {
    let active = true;
    Promise.all([getNotifications(), getUnreadCount()])
      .then(([list, count]) => {
        if (!active) return;
        setNotifications(list?.data || list?.notifications || list || []);
        setUnreadCount(count?.count ?? count?.data?.count ?? 0);
      })
      .catch(() => {
        if (active) { setNotifications([]); setUnreadCount(0); }
      });
    return () => { active = false; };
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="border-b border-slate-100 bg-white sticky top-0 z-50 font-sans">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to={user?.role === "teacher" ? "/teacher" : "/student"} className="flex items-center group">
          <img src={logo} alt="Speakly" className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {/* Premium Badge (Shown only for Basic users) */}
          {user?.plan === "Basic" && (
            <Link 
              to="/pricing" 
              className="hidden sm:flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-[10px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-95"
            >
              <span className="text-xs">⭐</span>
              <span className="uppercase tracking-widest">Upgrade to Premium</span>
            </Link>
          )}

          {/* Notification Pop-up */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-200 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white ring-2 ring-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="font-bold text-slate-900 mb-4 text-sm tracking-tight">Notifications</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center"><p className="text-sm text-slate-400 font-medium">No new notifications</p></div>
                  ) : notifications.slice(0, 5).map((notification) => (
                    <button key={notification._id || notification.id} onClick={async () => { if (!(notification.read || notification.isRead)) { try { await markNotificationRead(notification._id || notification.id); } catch {} } setNotifications((items) => items.map((item) => (item._id || item.id) === (notification._id || notification.id) ? { ...item, read: true, isRead: true } : item)); setUnreadCount((count) => Math.max(0, count - (notification.read || notification.isRead ? 0 : 1))); }} className={`w-full rounded-xl p-3 text-left hover:bg-slate-50 ${notification.read || notification.isRead ? "" : "bg-slate-50"}`}>
                      <p className="text-sm font-semibold text-slate-700">{notification.title || notification.message || "Notification"}</p>
                      {notification.message && notification.title && <p className="mt-1 text-xs text-slate-400 line-clamp-2">{notification.message}</p>}
                    </button>
                  ))}
                </div>
                <Link to="/notifications" onClick={() => setIsNotifOpen(false)} className="mt-3 block text-center text-xs font-bold text-slate-500 hover:text-slate-900">View all notifications →</Link>
              </div>
            )}
          </div>

          {/* Dynamic Profile Icon */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-bold transition-all duration-200 hover:bg-slate-800 border-2 border-white shadow-sm active:scale-95"
            >
              {firstLetter}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-4 border-b border-slate-50">
                  <p className="text-sm font-bold text-slate-900">{user?.name || "User Name"}</p>
                  <p className="text-xs text-slate-400 font-medium truncate">{user?.email || "user@example.com"}</p>
                </div>
                <div className="py-2">
                  <Link 
                    to={user?.role === 'teacher' ? "/teacher-profile" : "/student-profile"} 
                    className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                  >
                    Profile
                  </Link>
                  <Link to="/settings" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-medium">
                    Account Settings
                  </Link>
                  <div className="my-1 border-t border-slate-50" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
