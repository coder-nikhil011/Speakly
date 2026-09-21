import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../assets/navbar_logo.png";
import { getMyProfile } from "../services/profileService";
import { getTodayLearning, getLearningProgress } from "../services/learningService";
import { logoutUser } from "../services/authService";

// Helper function for dynamic greeting
const getGreeting = (name = "") => {
  const hour = new Date().getHours();
  let timeOfDay = "morning";

  if (hour >= 12 && hour < 17) {
    timeOfDay = "afternoon";
  } else if (hour >= 17) {
    timeOfDay = "evening";
  }

  const formattedName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
  return `Good ${timeOfDay}${formattedName ? `, ${formattedName}` : ""} 👋`;
};

function StudentDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [todayLearning, setTodayLearning] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, learning, prog] = await Promise.all([
          getMyProfile(),
          getTodayLearning(),
          getLearningProgress(),
        ]);
        setUser(profile);
        setTodayLearning(learning);
        setProgress(prog);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userName = user?.name || "";
  const userPlan = user?.plan || "Basic";

  const handleLogout = () => {
    logoutUser();
  };
  const hasPlan = (requiredPlan) => {
    if (import.meta.env.VITE_DEVELOPER_MODE === "true") return true;
    const hierarchy = { "Basic": 0, "Premium": 1, "Advance": 2 };
    return hierarchy[userPlan] >= hierarchy[requiredPlan];
  };

return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100">
      <div className="flex w-full">
        {/* Minimal Sidebar */}
        <aside
          className={`hidden min-h-screen shrink-0 border-r border-slate-100 bg-white p-6 transition-all duration-300 md:block ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="space-y-1.5">
            <SidebarItem to="/student" active icon="⌂" text="Home" isOpen={isSidebarOpen} />
            <SidebarItem to="/learn" icon="📖" text="Learn" isOpen={isSidebarOpen} />
            {hasPlan("Premium") ? <SidebarItem to="/my-teachers" icon="👨‍🏫" text="My Teachers" isOpen={isSidebarOpen} /> : <SidebarItem to="/pricing" icon="🔒" text="My Teachers · Premium" isOpen={isSidebarOpen} />}
            <SidebarItem to="/student/teacher-lessons" icon="📚" text="Teacher's Lessons" isOpen={isSidebarOpen} locked={!hasPlan("Premium")} requiredPlan="Premium" />
            <SidebarItem to="/social/community" icon="👥" text="Community" isOpen={isSidebarOpen} />
            <SidebarItem to="/revision-session" icon="↻" text="Revision" isOpen={isSidebarOpen} />
            
            <SidebarItem to="/speaking-practice" icon="🎙" text="Speaking Practice" isOpen={isSidebarOpen} />
            <SidebarItem to="/challenges" icon="⚡" text="Challenges" isOpen={isSidebarOpen} />
            <SidebarItem to="/contest" icon="🏆" text="Contest" isOpen={isSidebarOpen} locked={!hasPlan("Premium")} requiredPlan="Premium" />
            <SidebarItem to="/progress" icon="📊" text="Progress" isOpen={isSidebarOpen} />
          </div>

          <div className="absolute bottom-8 left-0 w-full px-6">
            <div className="mb-4 border-t border-slate-100 pt-4" />
            <button
              onClick={handleLogout}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-50 hover:text-red-500 ${
                !isSidebarOpen && "text-center !px-0"
              }`}
              title={!isSidebarOpen ? "Log out" : undefined}
            >
              {isSidebarOpen ? "↪ Log out" : "↪"}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="w-full max-w-7xl p-6 sm:p-12">
          {loading ? (
            <div className="flex h-[80vh] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"></div>
                <p className="text-sm font-medium text-slate-400">Loading your journey...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Dynamic Greeting */}
              <section className="relative mb-16">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1 w-6 bg-slate-600 rounded-full"></span>
                  <p className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                    Student Dashboard
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-slate-900">
                    {getGreeting(userName)}
                  </h1>
                  <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl text-sm font-bold shadow-sm border border-orange-100 w-fit">
                    <span>🔥</span>
                    <span>{progress?.streak || 0} Day Streak</span>
                  </div>
                </div>
                <p className="mt-4 text-lg text-slate-500 max-w-2xl">
                  Welcome back! Let's pick up where you left off and master some new English phrases today.
                </p>
              </section>

              {/* XP & Level Progress */}
              <section className="mb-16 grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                    🌟
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Level</p>
                    <h3 className="text-2xl font-bold text-slate-800">Level {progress?.currentLevel || 1}</h3>
                    <p className="text-sm text-slate-500">Keep learning to reach Level { (progress?.currentLevel || 1) + 1 }</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Experience</p>
                    <span className="text-sm font-bold text-slate-600">{progress?.totalXP || 0} XP</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 p-0.5">
                    <div 
                      className="h-full rounded-full bg-amber-400 transition-all duration-1000" 
                      style={{ width: `${((progress?.totalXP || 0) % 500) / 5}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400 text-right">
                    {500 - ((progress?.totalXP || 0) % 500)} XP to next level
                  </p>
                </div>
              </section>

              {/* Feature Cards */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Your Learning Path</h2>
                  <Link to="/progress" className="text-sm font-semibold text-slate-600 hover:text-slate-700 transition">
                    View Full Stats →
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <DashboardCard
                    icon="👥"
                    title="Community"
                    text="Connect with other students globally."
                    button="Find friends"
                    onClick={() => navigate("/social/community")}
                    locked={false} 
                  />
                  <DashboardCard
                    icon="👨‍🏫"
                    title="Teacher's Lessons"
                    text="Material from your dedicated teacher."
                    button="View lessons"
                    onClick={() => navigate("/student/teacher-lessons")}
                    locked={!hasPlan("Premium")} 
                  />
                  <DashboardCard
                    icon="↻"
                    title="Smart Revision"
                    text="Review words you've learned before."
                    button="Revise now"
                    onClick={() => navigate("/smart-revision")}
                    locked={false}
                  />
                  <DashboardCard
                    icon="🎙"
                    title="Speaking Practice"
                    text="Real conversations with AI."
                    button="Start speaking"
                    onClick={() => navigate("/speaking-practice")}
                    locked={false}
                  />
                  <DashboardCard
                    icon="⚡"
                    title="Daily Challenge"
                    text="Test yourself with a quick challenge."
                    button="Take challenge"
                    onClick={() => navigate("/challenges")}
                    locked={false}
                  />
                  <DashboardCard
                    icon="🏆"
                    title="Contest"
                    text="Join a LeetCode-style language contest built for your level."
                    button="View contest"
                    onClick={() => navigate("/contest")}
                    locked={!hasPlan("Premium")}
                  />
                </div>
              </section>

              {/* Progress Card */}
              <section className="rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative z-10 flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Growth Tracker</p>
                    <h2 className="text-3xl font-bold text-slate-800">You're making steady progress</h2>
                    <p className="mt-2 text-slate-500">Keep going! Every word brings you closer to mastery.</p>
                  </div>
                  <div className="w-full sm:w-72">
                    <div className="mb-4 flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-600">Overall Mastery</span>
                      <span className="text-3xl font-black text-slate-600">{progress?.percentage || 0}%</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-slate-100 p-1">
                      <div
                        className="h-full rounded-full bg-slate-600 transition-all duration-1000 ease-out"
                        style={{ width: `${progress?.percentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* Reusable Sidebar Component */
function SidebarItem({ to = "#", icon, text, active = false, isOpen = true, locked = false, requiredPlan = "Premium" }) {
  const label = locked ? `${text} · ${requiredPlan}` : text;
  const content = <><span className="text-lg">{locked ? "🔒" : icon}</span>{isOpen && <span className="truncate">{label}</span>}</>;
  if (locked) {
    return <button type="button" onClick={() => window.location.href = "/pricing"} title={!isOpen ? label : `Requires ${requiredPlan}`} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 ${!isOpen ? "justify-center" : ""}`}>{content}</button>;
  }
  return <Link to={to} title={!isOpen ? text : undefined} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${active ? "bg-slate-600 text-white shadow-lg shadow-slate-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"} ${!isOpen ? "justify-center" : ""}`}>{content}</Link>;
}

/* Dashboard Card Component */
function DashboardCard({ icon, title, text, button, onClick, locked = false }) {
  return (
    <div className={`group rounded-3xl border ${locked ? 'border-slate-100 bg-slate-50/50' : 'border-slate-100 bg-white'} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-100 relative overflow-hidden ${locked ? 'opacity-80' : ''}`}>
      {locked && (
        <div className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-300 transition-colors" title="Premium Feature">
          🔒
        </div>
      )}
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition-colors duration-300 ${locked ? 'bg-slate-200' : 'bg-slate-50 text-slate-600 group-hover:bg-slate-600 group-hover:text-white'}`}>
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-bold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
      
      {locked ? (
        <button
          onClick={() => window.location.href = "/pricing"}
          className="mt-6 text-sm font-bold text-slate-600 hover:text-slate-700 transition-all flex items-center gap-1"
        >
          Unlock Premium <span className="text-lg">→</span>
        </button>
      ) : (
        <button
          onClick={onClick}
          className="mt-6 text-sm font-bold text-slate-800 hover:text-slate-600 transition-all flex items-center gap-1"
        >
          {button} <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </button>
      )}
    </div>
  );
}

export default StudentDashboard;