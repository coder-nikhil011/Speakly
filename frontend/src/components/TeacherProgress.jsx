import React, { useEffect, useState } from "react";
import { getStudentsProgress } from "../services/learningService";

function TeacherProgress() {
  const [students, setStudents] = useState([]);
  useEffect(() => { getStudentsProgress().then(setStudents).catch(() => setStudents([])); }, []);
  const average = students.length ? Math.round(students.reduce((sum, student) => sum + Number(student.progress || 0), 0) / students.length) : 0;
  return <section className="rounded-3xl bg-white p-8"><p className="text-sm font-bold text-[#65B891]">STUDENT ANALYTICS</p><h2 className="mt-3 text-3xl font-extrabold">Class progress</h2><div className="mt-8 h-4 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#9DD8BD] transition-all" style={{ width: `${average}%` }} /></div><p className="mt-3 text-sm text-slate-500">{students.length ? `Average class progress: ${average}% across ${students.length} connected students.` : "No connected student data yet."}</p></section>;

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] p-6 sm:p-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-20 text-center">
          <div className="text-5xl mb-6 grayscale opacity-50">📊</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Activity Found</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Student progress data will appear here once your students start their learning journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 sm:p-12">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-[#65B891]">STUDENT ANALYTICS</p>
          <h2 className="mt-3 text-3xl font-extrabold">Class progress</h2>
          <div className="mt-8 h-4 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#9DD8BD] transition-all" style={{ width: `${average}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Average class progress: {average}% across {students.length} connected students.
          </p>
        </section>
      </div>
    </div>
  );

}
export default TeacherProgress;