import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../assets/navbar_logo.png";
import { getMyProfile } from "../services/profileService";
import { getStudentsProgress } from "../services/learningService";
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

function TeacherDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, progress] = await Promise.all([
          getMyProfile(),
          getStudentsProgress(),
        ]);
        setUser(profile);
        setStudentsProgress(progress);
      } catch (error) {
        console.error("Error fetching teacher dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userName = user?.name || "";

  const handleLogout = () => {
    logoutUser();
  };

  return (
      <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100">

        {/* Main Layout */}
        <div className="flex w-full">

          {/* Sidebar */}
          <aside
            className={`hidden min-h-screen shrink-0 border-r border-slate-100 bg-white p-6 transition-all duration-300 md:block ${
              isSidebarOpen ? "w-64" : "w-20"
            }`}
          >
          
            <div className="space-y-1.5">
            <TeacherSidebarItem to="/teacher" active icon="⌂" text="Overview" isOpen={isSidebarOpen} />
            <TeacherSidebarItem to="/teacher/student-overview" icon="👥" text="Student Overview" isOpen={isSidebarOpen} />
            <TeacherSidebarItem to="/assignments" icon="📝" text="Assignments" isOpen={isSidebarOpen} />
            <TeacherSidebarItem to="/teacher/teacher-progress" icon="📊" text="Progress" isOpen={isSidebarOpen} />
            <TeacherSidebarItem to="/teacher/teacher-weak-areas" icon="⚠" text="Weak Areas" isOpen={isSidebarOpen} />
            <TeacherSidebarItem to="/teacher/ai-assistant" icon="🤖" text="AI Assistant" isOpen={isSidebarOpen} />
          </div>

            <div className="absolute bottom-8 left-0 w-full px-6">
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
                  <p className="text-sm font-medium text-slate-400">Loading dashboard...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Dynamic Greeting */}
                <section className="relative mb-16">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-1 w-6 bg-slate-900 rounded-full"></span>
                    <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                      Teacher Dashboard
                    </p>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-slate-900">
                    {getGreeting(userName)}
                  </h1>
                  <p className="mt-4 text-lg text-slate-500 max-w-2xl">
                    Here's a snapshot of your students' growth and learning milestones.
                  </p>
                </section>

                {/* Stats */}
                <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
                  <StatCard title="Students" value={studentsProgress.length} change="+4 this month" />
                  <StatCard title="Assignments" value="—" change="Live assignment data" />
                  <StatCard title="Avg. progress" value={studentsProgress.length ? `${Math.round(studentsProgress.reduce((sum, student) => sum + Number(student?.progress || 0), 0) / studentsProgress.length)}%` : "—"} change="Across loaded students" />
                  <StatCard title="Active Now" value="—" change="Real-time data unavailable" />
                </section>

                {/* Main Grid */}
                <section className="mt-10 grid gap-8 lg:grid-cols-3">

                  {/* Student Progress */}
                  <div className="rounded-[2rem] border border-slate-100 bg-white p-8 lg:col-span-2 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student Progress</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-800">Your students</h2>
                      </div>
                      <button
                    onClick={() => navigate("/teacher/student-overview")}
                    className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition underline underline-offset-4"
                      >
                    View all
                      </button>
                    </div>

                    <div className="space-y-6">
                      {studentsProgress && studentsProgress.length > 0 ? (
                    studentsProgress.map((student, index) => (
                      <StudentRow 
                        key={student?._id || index} 
                        name={student?.name} 
                        level={student?.level} 
                        progress={student?.progress ? `${student.progress}%` : "0%"} 
                      />
                    ))
                      ) : (
                    <p className="text-sm text-slate-500 italic">No student data available.</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Actions</p>
                    <h2 className="text-2xl font-bold mb-8">Command Center</h2>

                    <div className="space-y-4">
                    <button
                    onClick={() => navigate("/teacher/ai-assistant")}
                    className="w-full rounded-2xl bg-white px-5 py-4 text-left text-sm font-bold text-slate-900 transition hover:bg-slate-100 shadow-sm"
                    >
                    🤖 AI Teaching Assistant
                    </button>
                    <button
                    onClick={() => navigate("/create-assignment")}
                    className="w-full rounded-2xl border border-white/20 px-5 py-4 text-left text-sm font-bold text-white transition hover:bg-white/10"
                    >
                    + Create assignment
                    </button>
                    <button
                    onClick={() => navigate("/teacher-content")}
                    className="w-full rounded-2xl border border-white/20 px-5 py-4 text-left text-sm font-bold text-white transition hover:bg-white/10"
                    >
                    + Manage Word Bank
                    </button>
                    <button
                    onClick={() => navigate("/teacher/student-overview")}
                    className="w-full rounded-2xl border border-white/20 px-5 py-4 text-left text-sm font-bold text-white transition hover:bg-white/10"
                    >
                    + Student Overview
                    </button>
                      <button
                    onClick={() => navigate("/teacher/teacher-progress")}
                    className="w-full rounded-2xl border border-white/20 px-5 py-4 text-left text-sm font-bold text-white transition hover:bg-white/10"
                      >
                    View analytics
                      </button>
                    </div>
                  </div>
                </section>

                {/* Weak Areas */}
                <section className="mt-16 rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Insights</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-800">Common weak areas</h2>
                      </div>
                      <button
                    onClick={() => navigate("/teacher/teacher-weak-areas")}
                    className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition underline underline-offset-4"
                      >
                    View insights
                      </button>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                      AI insights will appear here once enough student activity has been collected.
                    </div>
                  </div>
                </section>

                {/* Assignments */}
                <section className="mt-16">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Recent assignments</h2>
                    <button
                      onClick={() => navigate("/assignments")}
                      className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition underline underline-offset-4"
                    >
                      View all
                    </button>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                    <p className="font-semibold text-slate-700">No live assignment data loaded yet.</p>
                    <p className="mt-2 text-sm text-slate-500">Create or manage assignments to see real activity here.</p>
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    );
  }

  /* Sub-components */
  function StatCard({ title, value, change }) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <p className="text-sm font-semibold text-slate-400">{title}</p>
        <p className="mt-3 text-4xl font-bold text-slate-900">{value}</p>
        <p className="mt-2 text-xs font-bold text-slate-500">{change}</p>
      </div>
    );
  }

  function StudentRow({ name, level, progress }) {
    return (
      <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 font-bold">
          {name?.charAt(0) || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-3">
            <div>
              <p className="font-bold text-slate-800">{name || "Unknown"}</p>
              <p className="text-xs text-slate-400">{level || "N/A"}</p>
            </div>
            <span className="text-sm font-bold text-slate-900">{progress}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-slate-900 transition-all duration-500" style={{ width: progress }} />
          </div>
        </div>
      </div>
    );
  }

  function TeacherSidebarItem({ to = "#", icon, text, active = false, isOpen = true }) {
    return (
      <Link
        to={to}
        title={!isOpen ? text : undefined}
        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        } ${!isOpen ? "justify-center" : ""}`}
      >
        <span className="text-lg">{icon}</span>
        {isOpen && <span className="truncate">{text}</span>}
      </Link>
    );
  }

  function InsightCard({ title, value, text }) {
    return (
      <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800">{title}</h3>
        <span className="text-xl font-bold text-slate-900">{value}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{text}</p>
      </div>
    );
  }

  function AssignmentCard({ title, students, status, onClick }) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{students}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              status === "Active"
                ? "bg-slate-100 text-slate-600"
                : "bg-slate-50 text-slate-400"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    );
  }

  export default TeacherDashboard;