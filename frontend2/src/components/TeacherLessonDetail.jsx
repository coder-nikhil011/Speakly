import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function TeacherLessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/teacher-content/lessons/${id}`);
      setLesson(response.data.lesson);
      setEditForm(response.data.lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      alert("Failed to load lesson details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/teacher-content/lessons/${id}`, editForm);
      setLesson(editForm);
      setIsEditing(false);
      alert("Lesson updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error updating lesson");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await api.delete(`/teacher-content/lessons/${id}`);
      alert("Lesson deleted successfully");
      navigate("/teacher/content-manager");
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting lesson");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Lesson...</div>;
  if (!lesson) return <div className="flex h-screen items-center justify-center">Lesson not found</div>;

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <button 
          onClick={() => navigate("/teacher/content-manager")}
          className="mb-6 text-slate-500 font-bold hover:text-black transition flex items-center gap-2"
        >
          ← Back to Manager
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h1 className="text-3xl font-extrabold">{lesson.title}</h1>
              <p className="text-slate-500">{lesson.description}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold hover:bg-slate-100 transition"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button 
                onClick={handleDelete}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Title</label>
                  <input 
                    value={editForm.title} 
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Description</label>
                  <input 
                    value={editForm.description} 
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Main Content</label>
                  <textarea 
                    value={editForm.content} 
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 h-64" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Materials</label>
                  <input 
                    value={editForm.materials} 
                    onChange={(e) => setEditForm({...editForm, materials: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200" 
                  />
                </div>
                <button type="submit" className="w-full bg-slate-600 text-white p-3 rounded-xl font-bold hover:bg-slate-700 transition">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold mb-3 text-slate-400 uppercase tracking-wider">Lesson Content</h3>
                  <div className="prose max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {lesson.content}
                  </div>
                </section>

                {lesson.materials && (
                  <section>
                    <h3 className="text-lg font-bold mb-3 text-slate-400 uppercase tracking-wider">Materials</h3>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <a href={lesson.materials} target="_blank" rel="noopener noreferrer" className="text-slate-600 font-bold hover:underline">
                        View Supporting Material →
                      </a>
                    </div>
                  </section>
                )}

                {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold mb-3 text-slate-400 uppercase tracking-wider">Target Vocabulary</h3>
                    <div className="flex flex-wrap gap-3">
                      {lesson.vocabulary.map((v, idx) => (
                        <div key={idx} className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                          <span className="font-bold text-black">{v.word}</span>
                          <span className="mx-2 text-slate-300">|</span>
                          <span className="text-slate-600">{v.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherLessonDetail;
