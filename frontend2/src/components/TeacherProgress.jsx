import React, { useEffect, useState } from "react";
import { getStudentsProgress } from "../services/learningService";

function TeacherProgress() {
  const [students, setStudents] = useState([]);
  useEffect(() => { getStudentsProgress().then(setStudents).catch(() => setStudents([])); }, []);
  const average = students.length ? Math.round(students.reduce((sum, student) => sum + Number(student.progress || 0), 0) / students.length) : 0;
  return <section className="rounded-3xl bg-white p-8"><p className="text-sm font-bold text-[#65B891]">STUDENT ANALYTICS</p><h2 className="mt-3 text-3xl font-extrabold">Class progress</h2><div className="mt-8 h-4 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#9DD8BD] transition-all" style={{ width: `${average}%` }} /></div><p className="mt-3 text-sm text-slate-500">{students.length ? `Average class progress: ${average}% across ${students.length} connected students.` : "No connected student data yet."}</p></section>;
}
export default TeacherProgress;
