import React, { useState, useEffect } from "react";
import api from "../services/api";
import { getStudentAssignments } from "../services/assignmentService";

function StudentTeacherLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher-content/my-teacher-lessons");
      setLessons(response.data.lessons || []);
      try { setAssignments(await getStudentAssignments()); } catch (_) { setAssignments([]); }
    } catch (error) {
      console.error("Error fetching teacher lessons:", error);
      setError(error.response?.data?.message || "You are not connected to any teacher or there are no lessons available.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading your teacher's lessons...</div>;
  if (error) return (
    <div className="flex h-screen items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold mb-2">No Lessons Found</h2>
        <p className="text-slate-500">{error}</p>{error.toLowerCase().includes("premium") && <a href="/pricing" className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-bold text-white">View plans</a>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold mb-2">My Teacher's Lessons</h1>
          <p className="text-slate-500">Study the custom material provided by your language teacher.</p>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">Your teacher hasn't uploaded any lessons yet.</p>
          </div>
        ) : (
          <>
          {assignments.length > 0 && <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#65B891]">ASSIGNED WORK</p><h2 className="mt-2 text-xl font-extrabold">Your teacher's tasks</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{assignments.map((assignment) => <div key={assignment._id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-bold">{assignment.title}</h3><span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold">{assignment.status}</span></div><p className="mt-2 text-sm text-slate-600">{assignment.description || "No instructions provided."}</p>{assignment.dueDate && <p className="mt-3 text-xs font-semibold text-slate-400">Due {new Date(assignment.dueDate).toLocaleDateString()}</p>}</div>)}</div></section>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lesson List */}
            <div className="lg:col-span-1 space-y-4">
              {lessons.map((lesson) => (
                <div 
                  key={lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-5 rounded-2xl border cursor-pointer transition ${
                    selectedLesson?._id === lesson._id 
                    ? "bg-slate-50 border-slate-200 shadow-sm" 
                    : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <h3 className={`font-bold ${selectedLesson?._id === lesson._id ? "text-slate-700" : "text-black"}`}>
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{lesson.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {lesson.vocabulary?.length || 0} Words
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lesson Viewer */}
            <div className="lg:col-span-2">
              {selectedLesson ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-10">
                  <div className="p-8 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-2xl font-extrabold mb-2">{selectedLesson.title}</h2>
                    <p className="text-slate-600">{selectedLesson.description}</p>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    <section>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Lesson Content</h3>
                      <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">
                        {selectedLesson.content}
                      </div>
                    </section>

                    {selectedLesson.materials && (
                      <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Supporting Material</h3>
                        <a 
                          href={selectedLesson.materials} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 text-slate-600 font-bold hover:underline"
                        >
                          Open Material Link →
                        </a>
                      </section>
                    )}

                    {selectedLesson.vocabulary && selectedLesson.vocabulary.length > 0 && (
                      <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Vocabulary to Focus On</h3>
                        <div className="flex flex-wrap gap-3">
                          {selectedLesson.vocabulary.map((v, idx) => (
                            <div key={idx} className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                              <span className="font-bold text-slate-800">{v.word}</span>
                              <span className="mx-2 text-slate-300">|</span>
                              <span className="text-slate-600">{v.meaning}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="text-4xl mb-4">📖</div>
                  <h3 className="text-xl font-bold mb-2">Select a lesson to start learning</h3>
                  <p className="text-slate-500">Pick a lesson from the list on the left to view the content provided by your teacher.</p>
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentTeacherLessons;
