import React, { useState, useEffect } from "react";
import { getStudentsProgress } from "../services/learningService";

function TeacherStudentWeakAreas() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsProgress();
        setStudents(data);
      } catch (err) {
        setError("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#F8FAF9]"><p>Loading data...</p></div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-[#F8FAF9] text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mt-12 text-4xl font-extrabold">Student Weak Areas</h1>
        
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
                <div className="mb-8">
                  <h2 className="text-3xl font-bold">{selectedStudent.name}</h2>
                  <p className="text-slate-500">AI Analysis of Weak Areas</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <AreaCard 
                    title="Speaking Confidence" 
                    progress={selectedStudent.speakingConfidence || "0%"} 
                    description={selectedStudent.speakingDesc || "Needs more real-time conversation practice."}
                    tip="Recommend: Daily 10-min AI Partner sessions."
                  />
                  <AreaCard 
                    title="Vocabulary Recall" 
                    progress={selectedStudent.vocabRecall || "0%"} 
                    description={selectedStudent.vocabDesc || "Struggles with advanced adjectives."}
                    tip="Recommend: Focus on 'Advanced' word sets."
                  />
                  <AreaCard 
                    title="Sentence Formation" 
                    progress={selectedStudent.sentenceFormation || "0%"} 
                    description={selectedStudent.sentenceDesc || "Tense consistency issues in long paragraphs."}
                    tip="Recommend: Focus on 'Present Perfect' drills."
                  />
                  <AreaCard 
                    title="Pronunciation" 
                    progress={selectedStudent.pronunciation || "0%"} 
                    description={selectedStudent.pronunciationDesc || "Work on 'th' and 'sh' sounds."}
                    tip="Recommend: Using the AI Accent Trainer."
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400 p-10 text-center">
                Select a student from the list to see their weak areas and AI insights.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AreaCard({ title, progress, description, tip }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="text-sm font-extrabold text-slate-600">{progress}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100">
        <div 
          className="h-full rounded-full bg-[#9DD8BD]" 
          style={{ width: progress }}
        />
      </div>
      <p className="mt-4 text-sm text-slate-500 leading-6">{description}</p>
      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold text-slate-700">{tip}</p>
      </div>
    </div>
  );
}

export default TeacherStudentWeakAreas;