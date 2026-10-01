import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyTeachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/connection/my-teachers");
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTeacherRequest = async (e) => {
    e.preventDefault();
    if (!teacherEmail.trim()) return;
    setRequestStatus("Sending request...");
    try {
      const response = await api.post("/connection/request", { teacherEmail: teacherEmail.trim().toLowerCase() });
      setRequestStatus(response.data.message || "Request sent successfully.");
      setTeacherEmail("");
      await fetchTeachers();
    } catch (error) {
      setRequestStatus(error.response?.data?.message || "Could not send request.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#FDFDFD]"><p className="text-slate-400">Loading your teachers...</p></div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans p-6 sm:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Teachers</h1>
            <p className="text-slate-500 font-medium">Connect with your mentors and track your guidance.</p>
          </div>
          <button 
            onClick={() => navigate("/student")}
            className="px-6 py-3 rounded-2xl font-bold transition-all duration-200 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">ADD A TEACHER</p><h2 className="mt-1 text-xl font-extrabold">Search by teacher email</h2><p className="mt-1 text-sm text-slate-500">Send a connection request. Once the teacher accepts, their lessons appear here.</p></div>
            <form onSubmit={sendTeacherRequest} className="flex w-full max-w-xl gap-2">
              <input value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} type="email" placeholder="teacher@example.com" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-black" />
              <button className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white">Send request</button>
            </form>
          </div>
          {requestStatus && <p className="mt-3 text-sm font-semibold text-slate-500">{requestStatus}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Teacher List</h2>
            <div className="space-y-3">
              {teachers.length === 0 ? (
                <p className="text-slate-500 italic px-2">You haven't connected with any teachers yet.</p>
              ) : (
                teachers.map((t) => (
                  <div 
                    key={t._id} 
                    onClick={() => setSelectedTeacher(t)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      selectedTeacher?._id === t._id 
                      ? "bg-white border-slate-900 shadow-md ring-1 ring-slate-900" 
                      : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold transition-colors ${
                        selectedTeacher?._id === t._id 
                        ? "bg-slate-900 text-white" 
                        : "bg-slate-100 text-slate-600"
                      }`}>
                        {t.name?.charAt(0) || "T"}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`font-bold truncate ${selectedTeacher?._id === t._id ? "text-slate-900" : "text-slate-700"}`}>
                          {t.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{t.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedTeacher ? (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-slate-200">
                      {selectedTeacher.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{selectedTeacher.name}</h2>
                      <p className="text-slate-500 font-medium">{selectedTeacher.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <section>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Teacher Profile</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-6 rounded-3xl bg-[#FDFDFD] border border-slate-100 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Specialization</p>
                        <p className="text-lg font-bold text-slate-900">{selectedTeacher.specialization || "General English"}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-[#FDFDFD] border border-slate-100 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Experience</p>
                        <p className="text-lg font-bold text-slate-900">{selectedTeacher.experience || "Expert"}</p>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Guidance Notes</h3>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-slate-600 italic">
                      "{selectedTeacher.bio || "Your teacher will provide personalized feedback and guidance here."}"
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-[#FDFDFD] rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm">
                <div className="text-5xl mb-6 grayscale opacity-50">👨‍🏫</div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Select a Teacher</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                  Choose a teacher from the list to view their profile and guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTeachers;
