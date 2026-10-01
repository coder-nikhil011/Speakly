import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import logo from "../assets/navbar_logo.png";
import { updateMyProfile } from "../services/profileService";
 
function TeacherSetup() {
  const navigate = useNavigate();

  const [experience, setExperience] = useState("");
  const [students, setStudents] = useState("");
  const [goal, setGoal] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");

    if (!experience || !students || !goal) {
      alert("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      await updateMyProfile({
        experience,
        students,
        goal,
        interest,
      });

      navigate("/teacher");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100">

      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white border-b border-slate-100 px-6 py-5 sm:px-12">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Teacher Setup
        </span>

      </nav>


      {/* Main */}
      <main className="flex justify-center px-6 py-16">

        <div className="w-full max-w-2xl">

          {/* Heading */}
          <div className="text-center mb-12">

            <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-3">
              Welcome Teacher
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
              Tell us about your teaching
            </h1>

            <p className="mx-auto max-w-lg text-slate-500 font-medium">
              This helps Speakly create a better experience
              for you and your students.
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={handleContinue}
            className="mt-10 rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 sm:p-12"
          >

            {/* Experience */}
            <div className="mb-12">

              <label className="text-sm font-semibold text-slate-700">
                How much teaching experience do you have?
              </label>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                {[
                  "Just starting",
                  "1–2 years",
                  "3–5 years",
                  "5+ years",
                ].map((item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() => setExperience(item)}
                    className={`rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 ${
                      experience === item
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                        : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>


            {/* Students */}
            <div className="mb-12">

              <label className="text-sm font-semibold text-slate-700">
                How many students do you teach?
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

                {[
                  "1–10",
                  "11–30",
                  "31–60",
                  "60+",
                ].map((item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() => setStudents(item)}
                    className={`rounded-2xl border px-4 py-4 text-sm font-medium transition-all duration-200 ${
                      students === item
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                        : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>


            {/* Goal */}
            <div className="mb-12">

              <label className="text-sm font-semibold text-slate-700">
                What would you like Speakly to help with?
              </label>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                {[
                  "Track student progress",
                  "Create practice activities",
                  "Identify weak areas",
                  "Improve student speaking",
                ].map((item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() => setGoal(item)}
                    className={`rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 ${
                      goal === item
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200"
                        : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>


            {/* Interest */}
            <div className="mb-12">

              <label
                htmlFor="interest"
                className="text-sm font-semibold text-slate-700"
              >
                What do you teach?
                <span className="ml-2 font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <input
                id="interest"
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="English, communication, vocabulary..."
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
              />

            </div>


            {/* Continue */}
            <button
              type="submit"
              className="mt-10 w-full rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] shadow-lg shadow-slate-200"
            >
              Continue <span className="ml-2">→</span>
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default TeacherSetup;