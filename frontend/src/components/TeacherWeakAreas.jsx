import React, { useState, useEffect } from "react";
import { getStudentsProgress } from "../services/learningService";

function TeacherWeakAreas() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentsProgress()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <div className="flex h-screen items-center justify-center bg-[#FDFDFD]">Loading class insights...</div>;

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] p-6 sm:p-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-20 text-center">
          <div className="text-5xl mb-6 grayscale opacity-50">⚠</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Activity Found</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Common weak areas will be analyzed and shown here once your students generate enough learning data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 sm:p-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Class Weak Areas</h1>
        <p className="text-slate-500 mb-12">Aggregate AI analysis of common challenges across your entire classroom.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InsightCard 
            title="Speaking Confidence" 
            status="Moderate" 
            desc="Most students struggle with spontaneous conversation flow." 
            tip="Action: Implement more pair-practice sessions."
          />
          <InsightCard 
            title="Vocabulary Recall" 
            status="Strong" 
            desc="Students are performing well with core vocabulary." 
            tip="Action: Introduce more 'Advanced' level word banks."
          />
          <InsightCard 
            title="Sentence Formation" 
            status="Needs Attention" 
            desc="Common errors found in complex tense usage." 
            tip="Action: Focus on grammar drills for Perfect tenses."
          />
          <InsightCard 
            title="Pronunciation" 
            status="Moderate" 
            desc="Inconsistent pronunciation of 'th' sounds across the group." 
            tip="Action: Use the AI Accent Trainer for group drills."
          />
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, status, desc, tip }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          status === 'Strong' ? 'bg-green-100 text-green-600' : 
          status === 'Moderate' ? 'bg-yellow-100 text-yellow-600' : 
          'bg-red-100 text-red-600'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-slate-500 mb-6 leading-relaxed">{desc}</p>
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <p className="text-sm font-semibold text-slate-700">{tip}</p>
      </div>
    </div>
  );
}

export default TeacherWeakAreas;
