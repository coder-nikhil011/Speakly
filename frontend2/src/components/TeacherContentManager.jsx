import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function TeacherContentManager() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("words"); // "words" or "lessons"
  const [words, setWords] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({
    word: "",
    meaning: "",
    level: "beginner",
    partOfSpeech: "",
    hindiHint: "",
    category: "general",
  });
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    content: "",
    materials: "",
    vocabulary: [], // Array of {word, meaning}
  });
  const [vocabInput, setVocabInput] = useState({ word: "", meaning: "" });

  useEffect(() => {
    if (activeTab === "words") {
      fetchWords();
    } else {
      fetchLessons();
    }
  }, [activeTab]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher-content/words");
      setWords(response.data.words || []);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher-content/lessons");
      setLessons(response.data.lessons || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWordInputChange = (e) => {
    setNewWord({ ...newWord, [e.target.name]: e.target.value });
  };

  const handleLessonInputChange = (e) => {
    setNewLesson({ ...newLesson, [e.target.name]: e.target.value });
  };

  const handleAddVocabToLesson = () => {
    if (vocabInput.word && vocabInput.meaning) {
      setNewLesson({
        ...newLesson,
        vocabulary: [...newLesson.vocabulary, vocabInput],
      });
      setVocabInput({ word: "", meaning: "" });
    }
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    try {
      await api.post("/teacher-content/words", newWord);
      setNewWord({ word: "", meaning: "", level: "beginner", partOfSpeech: "", hindiHint: "", category: "general" });
      setShowAddForm(false);
      fetchWords();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding word");
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post("/teacher-content/lessons", newLesson);
      setNewLesson({ title: "", description: "", content: "", materials: "", vocabulary: [] });
      setShowAddForm(false);
      fetchLessons();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding lesson");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Content...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100 p-6 sm:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Content Manager</h1>
            <p className="text-slate-500 font-medium">Manage learning materials for your students.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-200 ${showAddForm ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95"}`}
          >
            {showAddForm ? "Cancel" : "+ Create New"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-slate-100">
          <button 
            onClick={() => { setActiveTab("words"); setShowAddForm(false); }}
            className={`pb-4 px-2 text-sm font-bold transition-all duration-200 ${activeTab === "words" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
          >
            Vocabulary Bank
          </button>
          <button 
            onClick={() => { setActiveTab("lessons"); setShowAddForm(false); }}
            className={`pb-4 px-2 text-sm font-bold transition-all duration-200 ${activeTab === "lessons" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
          >
            Lesson Plans
          </button>
        </div>

        {showAddForm && (
          <div className="mb-16 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold mb-8 text-slate-800">
              {activeTab === "words" ? "Add New Word/Phrase" : "Create New Lesson"}
            </h2>
            
            {activeTab === "words" ? (
              <form onSubmit={handleAddWord} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Word/Phrase</label>
                  <input name="word" value={newWord.word} onChange={handleWordInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Meaning</label>
                  <input name="meaning" value={newWord.meaning} onChange={handleWordInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Level</label>
                  <select name="level" value={newWord.level} onChange={handleWordInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50">
                    <option value="beginner">Beginner</option>
                    <option value="elementary">Elementary</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="upper-intermediate">Upper-Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select name="category" value={newWord.category} onChange={handleWordInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50">
                    <option value="general">General Word</option>
                    <option value="phrase">Phrase</option>
                    <option value="modal">Modal Verb</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Part of Speech</label>
                  <input name="partOfSpeech" value={newWord.partOfSpeech} onChange={handleWordInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50" placeholder="e.g. Verb, Noun" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Hindi Hint</label>
                  <input name="hindiHint" value={newWord.hindiHint} onChange={handleWordInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50" />
                </div>
                <button type="submit" className="md:col-span-2 bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">Save to Database</button>
              </form>
            ) : (
              <form onSubmit={handleAddLesson} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Lesson Title</label>
                    <input name="title" value={newLesson.title} onChange={handleLessonInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <input name="description" value={newLesson.description} onChange={handleLessonInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Main Content</label>
                  <textarea name="content" value={newLesson.content} onChange={handleLessonInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50 h-40" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Supporting Materials (URLs/Links)</label>
                  <input name="materials" value={newLesson.materials} onChange={handleLessonInputChange} className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50" placeholder="Links to PDFs, Videos etc." />
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <h3 className="font-bold mb-6 text-slate-800">Add Lesson Vocabulary</h3>
                  <div className="flex gap-4 mb-6">
                    <input 
                      placeholder="Word" 
                      value={vocabInput.word} 
                      onChange={(e) => setVocabInput({...vocabInput, word: e.target.value})}
                      className="flex-1 p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
                    />
                    <input 
                      placeholder="Meaning" 
                      value={vocabInput.meaning} 
                      onChange={(e) => setVocabInput({...vocabInput, meaning: e.target.value})}
                      className="flex-1 p-4 rounded-2xl border border-slate-200 bg-white outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
                    />
                    <button type="button" onClick={handleAddVocabToLesson} className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {newLesson.vocabulary.map((v, idx) => (
                      <span key={idx} className="bg-white px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600">
                        {v.word}: {v.meaning}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">Publish Lesson</button>
              </form>
            )}
          </div>
        )}

        {activeTab === "words" ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400">
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Word</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Meaning</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Category</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Level</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {words.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-5 font-bold text-slate-800">{w.word}</td>
                    <td className="px-6 py-5 text-slate-600 font-medium">{w.meaning}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">{w.category}</span>
                    </td>
                    <td className="px-6 py-5 text-sm capitalize text-slate-500 font-medium">{w.level}</td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => navigate(`/teacher/word/${w._id}`)} 
                        className="text-slate-900 font-bold text-sm hover:text-slate-600 transition underline underline-offset-4"
                      >
                        Manage Sentences
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((l) => (
              <div key={l._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 group">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-600 transition-colors">{l.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">{l.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {l.vocabulary?.length || 0} Words
                  </span>
                  <button 
                    onClick={() => navigate(`/teacher/lesson/${l._id}`)}
                    className="text-slate-900 font-bold text-sm hover:text-slate-600 transition underline underline-offset-4"
                  >
                    Edit Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherContentManager;
