import React from "react";

function Settings() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100 p-6 sm:p-12">
      <div className="mx-auto max-w-3xl">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Settings
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Manage your account and learning experience.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">General Preferences</h2>
            <Setting title="Notifications" description="Receive updates on new content and progress" />
            <Setting title="Speaking practice reminders" description="Get daily nudges to keep your streak alive" />
            <Setting title="Learning preferences" description="Customize how you interact with AI tutors" />
          </div>
        </div>

      </div>
    </div>
  );
}

function Setting({ title, description }) {
  return (
    <div className="group flex items-center justify-between rounded-3xl bg-white p-6 border border-slate-100 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
      <div className="space-y-1">
        <span className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
          {title}
        </span>
        <p className="text-sm text-slate-400 font-medium">
          {description}
        </p>
      </div>

      <button className="relative h-7 w-12 rounded-full bg-slate-200 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-slate-200">
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 group-hover:scale-110" />
      </button>
    </div>
  );
}

export default Settings;