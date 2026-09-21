import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudentsProgress } from "../services/learningService";

function TeacherStudentProgress() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getStudentsProgress();
        setStudents(data);
      } catch (err) {
        setError("Failed to load student progress.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#F8FAF9]"><p>Loading progress...</p></div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-[#F8FAF9] text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mt-12 text-4xl font-extrabold">Student Progress</h1>
        
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-3">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Student</p>
            {students.map((student) => (
              <button
                key={student._id}
                onClick={() => setSelectedStudent(student)}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition ${
                  selectedStudent?._id === student._id 
                  ? "border-black bg-white shadow-md font-bold" 
                  : "border-slate-200 bg-white hover:border-black text-slate-600"
                }`}
              >
                {student.name}
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedStudent.name}</h2>
                    <p className="text-slate-500">{selectedStudent.level || "General Level"}</p>
                  </div>
                  <span className="text-4xl font-black text-slate-600">{selectedStudent.progress}%</span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-slate-100 mb-10">
                  <div 
                    className="h-full rounded-full bg-[#9DD8BD] transition-all duration-1000" 
                    style={{ width: `${selectedStudent.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatBox label="Words" value={selectedStudent.wordsLearned || 0} />
                  <StatBox label="Sentences" value={selectedStudent.sentencesPracticed || 0} />
                  <StatBox label="Sessions" value={selectedStudent.sessions || 0} />
                  <StatBox label="Streak" value={`${selectedStudent.streak || 0} days`} />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400 p-10 text-center">
                Select a student from the list to view their detailed progress.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 text-center">
      <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default TeacherStudentProgress;