import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

function TeacherStudentOverview() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [isAddingLoading, setIsAddingLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher-content/students/progress");
      setStudents(response.data.progress || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await api.get(`/teacher-content/students/progress`);
      const allProgress = response.data.progress;
      const details = allProgress.filter(p => p.userId._id === studentId);
      setStudentDetails(details);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    fetchStudentDetails(student.userId._id);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    
    setIsAddingLoading(true);
    try {
      // Calling the API to add student by email
      const response = await api.post("/teacher-content/add-student", { email: searchEmail });
      if (response.data.success) {
        alert("Student added successfully!");
        setIsModalOpen(false);
        setSearchEmail("");
        fetchStudents(); // Refresh list
      } else {
        alert(response.data.message || "Failed to add student.");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert(error.response?.data?.message || "An error occurred while adding the student.");
    } finally {
      setIsAddingLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Students...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100 p-6 sm:p-12 relative">
      
      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <p className="text-slate-500 text-sm mb-6">Search for a student by their registered email address to add them to your classroom.</p>
            
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isAddingLoading}
                  className="flex-1 py-4 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50 shadow-lg shadow-slate-200"
                >
                  {isAddingLoading ? "Adding..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Overview</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200"
            >
              + Add Student
            </button>
          </div>
          <button 
            onClick={() => navigate("/teacher/dashboard")}
            className="px-6 py-3 rounded-2xl font-bold transition-all duration-200 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Student List */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Your Students</h2>
            <div className="space-y-3">
              {students.length === 0 ? (
                <p className="text-slate-500 italic px-2">No students connected yet.</p>
              ) : (
                students.map((s) => (
                  <div 
                    key={s._id} 
                    onClick={() => handleStudentClick(s)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      selectedStudent?._id === s._id 
                      ? "bg-white border-slate-900 shadow-md ring-1 ring-slate-900" 
                      : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold transition-colors ${
                        selectedStudent?._id === s._id 
                        ? "bg-slate-900 text-white" 
                        : "bg-slate-100 text-slate-600"
                      }`}>
                        {s.userId?.name?.charAt(0) || "U"}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`font-bold truncate ${selectedStudent?._id === s._id ? "text-slate-900" : "text-slate-700"}`}>
                          {s.userId?.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{s.userId?.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Detail View */}
          <div className="lg:col-span-2">
           
            {selectedStudent ? (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                {/* 1. STUDENT INFORMATION */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-slate-200">
                      {selectedStudent.userId?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{selectedStudent.userId?.name}</h2>
                      <p className="text-slate-500 font-medium">{selectedStudent.userId?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-12">
                  {/* 2. STUDENT PROGRESS */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Learning Progress</h3>
                      <span className="text-2xl font-black text-slate-900">{selectedStudent.progress || "0"}%</span>
                    </div>
                    
                    <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 mb-8">
                      <div 
                        className="h-full rounded-full bg-[#9DD8BD] transition-all duration-1000" 
                        style={{ width: `${selectedStudent.progress || 0}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="p-6 rounded-3xl bg-[#FDFDFD] border border-slate-100 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Level</p>
                        <p className="text-2xl font-bold text-slate-900">{selectedStudent.wordId?.level || "N/A"}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-[#FDFDFD] border border-slate-100 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Words Mastered</p>
                        <p className="text-2xl font-bold text-slate-900">{studentDetails?.length || 0}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-[#FDFDFD] border border-slate-100 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Active</p>
                        <p className="text-2xl font-bold text-slate-900">{new Date(selectedStudent.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </section>

                  {/* 3. STUDENT WEAK AREAS */}
                  <section>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">AI Analysis: Weak Areas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </section>

                  {/* 4. WORD MASTERY HISTORY */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Word Mastery History</h3>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                        {studentDetails?.length || 0} Total
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studentDetails && studentDetails.length > 0 ? (
                        studentDetails.map((detail, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 transition-all duration-200 group">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-slate-900 group-hover:scale-125 transition-transform"></div>
                              <span className="font-bold text-slate-800">{detail.wordId?.word}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold uppercase">
                                {detail.wordId?.level}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-slate-400">
                              {new Date(detail.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-slate-500 italic text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                          No mastery data available for this student.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-[#FDFDFD] rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm">
                <div className="text-5xl mb-6 grayscale opacity-50">👤</div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Select a Student</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                  Choose a student from the sidebar to view their detailed learning progress and mastery history.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherStudentOverview;
