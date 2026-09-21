import {Link} from "react-router-dom";
import React , {useState} from "react";
import { getStudentsProgress } from "../services/learningService";
import api from "../services/api";

function Students() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try { const response = await api.get("/connection/pending"); setRequests(response.data.requests || []); } catch (_) { setRequests([]); }
  };

  React.useEffect(() => {
    getStudentsProgress().then(setStudents).catch(() => setStudents([])).finally(() => setLoading(false));
    loadRequests();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">

      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between mt-12">
          <h1 className="text-4xl font-extrabold">
            Students
          </h1>
          <span className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500">Live student data</span>
        </div>

        {requests.length > 0 && <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">CONNECTION REQUESTS</p><h2 className="mt-1 text-xl font-bold">Students who want to learn with you</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{requests.length}</span></div><div className="mt-4 space-y-3">{requests.map((request) => <div key={request._id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{request.studentId?.name || "Student"}</p><p className="text-xs text-slate-500">{request.studentId?.email}</p></div><div className="flex gap-2"><button onClick={async () => { await api.post("/connection/handle", { requestId: request._id, action: "rejected" }); loadRequests(); }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold">Reject</button><button onClick={async () => { await api.post("/connection/handle", { requestId: request._id, action: "accepted" }); loadRequests(); }} className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white">Accept</button></div></div>)}</div></div>}

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div className="sm:col-span-2 space-y-3">
            {loading ? <p className="rounded-2xl bg-white p-6 text-sm text-slate-400">Loading students...</p> : students.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No student data available yet.</p> : students.map((student) => { const name = student?.name || "Student"; const level = student?.level || "Level not set"; const progress = student?.progress != null ? `${student.progress}%` : "—"; return (
              <div
                key={name}
                onClick={() => setSelectedStudent({ ...student, name, level, progress })}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
                  selectedStudent?.name === name 
                    ? "border-black bg-white shadow-md" 
                    : "border-slate-200 bg-white hover:border-black"
                }`}
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold">
                    {name.charAt(0)}
                  </div>

                  <div>

                    <p className="font-bold">
                      {name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {level}
                    </p>

                  </div>

                </div>
                <span className="font-bold">
                  {progress}
                </span>
              </div>
            ); })}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Student Assignments</h2>
            {selectedStudent ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-500">Selected student</p>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <p className="font-bold text-sm">{selectedStudent.name}</p>
                  <p className="mt-1 text-xs text-slate-500">Level: {selectedStudent.level} · Progress: {selectedStudent.progress}</p>
                </div>
                <p className="text-xs text-slate-400">Assignment details will appear here when the teacher assignment API returns student-specific data.</p>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center py-20">
                <p className="text-sm text-slate-400">Select a student to view their assignments</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Students;