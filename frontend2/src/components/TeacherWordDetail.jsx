import React from "react";
import { Link, useParams } from "react-router-dom";

export default function TeacherWordDetail() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/teacher-content" className="text-sm font-bold text-slate-500 hover:text-slate-900">← Back to content manager</Link>
        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-[#65B891]">Vocabulary</p>
          <h1 className="mt-2 text-4xl font-extrabold">Word details</h1>
          <p className="mt-3 text-slate-500">Word ID: {id}</p>
          <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">This vocabulary item is connected to the teacher content manager. Add or edit its definition, examples and level here when the corresponding backend endpoint is available.</div>
        </div>
      </div>
    </div>
  );
}
