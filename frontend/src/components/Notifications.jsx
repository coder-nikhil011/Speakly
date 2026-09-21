import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navbar_logo.png";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../services/notificationService";




function Notifications() {

  const navigate = useNavigate();

  const [notifications, setNotifications] =
  useState([]);

  const [loading, setLoading] =
  useState(true);

  const [error, setError] =
  useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, unread: false }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };


  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          unread: false,
        }))
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };


  const handleAcceptRequest = async (requestId) => {
    try {
      await api.post(`/auth/accept-teacher`, { requestId });
      setNotifications((prev) =>
        prev.filter((n) => n._id !== requestId)
      );
      alert("Teacher request accepted!");
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request.");
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await api.post(`/auth/decline-teacher`, { requestId });
      setNotifications((prev) =>
        prev.filter((n) => n._id !== requestId)
      );
    } catch (err) {
      console.error("Error declining request:", err);
    }
  };


  const openNotification = (notification) => {

    markAsRead(notification._id);

    navigate(notification.link || "/student");

  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
        <p className="text-lg font-semibold text-slate-400">Loading notifications...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F8FAF9] text-black">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-10">

          <Link
            to="/student"
            className="text-3xl font-extrabold tracking-tight"
          >
        <img
            src={logo}
            alt="Speakly"
            className="h-14 w-auto object-contain"
        />
          </Link>

          <Link
            to="/student"
            className="text-sm font-semibold text-slate-500 transition hover:text-black"
          >
            ← Dashboard
          </Link>

        </div>

      </nav>


      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-sm font-bold tracking-[0.2em] text-[#65B891]">
              UPDATES
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Notifications
            </h1>

            <p className="mt-2 text-slate-500">
              {unreadCount === 0
                ? "You're all caught up."
                : `You have ${unreadCount} unread ${
                    unreadCount === 1
                      ? "notification"
                      : "notifications"
                  }.`}
            </p>

          </div>


          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-bold underline underline-offset-4"
            >
              Mark all as read
            </button>
          )}

        </div>


        {/* Notifications */}
        <section className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm">

          {notifications.length === 0 ? (

            <div className="px-7 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E7F5EF] text-2xl">
                ✓
              </div>

              <h2 className="mt-5 text-xl font-bold">
                You're all caught up
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                New notifications will appear here.
              </p>

            </div>

          ) : (

            <div>

              {notifications.map((notification, index) => (

                <div
                  key={notification._id}
                  className={`relative flex gap-4 p-6 transition hover:bg-[#F8FAF9] ${
                    index !== notifications.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  } ${
                    notification.unread
                      ? "bg-[#FCFEFD]"
                      : ""
                  }`}
                >

                  {/* Icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E7F5EF] text-[#477D65]">
                    <NotificationIcon
                      type={notification.type}
                    />
                  </div>


                  {/* Content */}
                  <button
                    onClick={() =>
                      openNotification(notification)
                    }
                    className="min-w-0 flex-1 text-left"
                  >

                    <div className="flex items-start gap-2">

                      <h2 className="font-bold">
                        {notification.title}
                      </h2>

                      {notification.unread && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#65B891]" />
                      )}

                    </div>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      {notification.time}
                    </p>

                  </button>


                  {/* Delete */}
                  <button
                    onClick={() =>
                      removeNotification(notification._id)
                    }
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-black"
                    aria-label="Remove notification"
                  >
                    ×
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


function NotificationIcon({ type }) {

  if (type === "revision") {
    return <span>↻</span>;
  }

  if (type === "streak") {
    return <span>🔥</span>;
  }

  if (type === "speaking") {
    return <span>◉</span>;
  }

  if (type === "challenge") {
    return <span>★</span>;
  }

  return <span>•</span>;
}


export default Notifications;