import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import { registerUser } from "../services/authService";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!role) {
      setError("Please select Student or Teacher.");
      return;
    }
    setLoading(true);
    try {
      const signupData = {
        name,
        email,
        password,
        role: role === "student" ? "student" : "teacher",
      };
      await registerUser(signupData);
      localStorage.setItem("speaklyRole", role);
      
      if (role === "student") {
        navigate("/student-setup");
      } else {
        navigate("/teacher-setup");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  const handleMicrosoftLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/microsoft";
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100">
      <nav className="flex items-center justify-between px-6 py-6 sm:px-12">
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
          <img src={logo} alt="Speakly" className="h-10 w-auto" />
        </Link>
        <p className="hidden text-sm font-medium text-slate-500 sm:block">
          Already have an account?
          <Link to="/login" className="ml-2 font-bold text-slate-900 hover:text-slate-600 transition">
            Log in
          </Link>
        </p>
      </nav>
      <main className="flex min-h-[calc(100vh-100px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-3">Get Started</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Create your account</h1>
            <p className="text-slate-500 font-medium">Start learning English the Speakly way.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl">
                {error}
              </div>
            )}
            <div className="space-y-6">
               <div className="group">
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                <input id="name" type="text" placeholder="Enter your name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-50" />
              </div>
              <div className="group">
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-50" />
              </div>
              <div className="group">
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <input id="password" type="password" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-50" />
              </div>
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">I am a</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setRole("student")} className={`rounded-2xl border px-4 py-4 text-sm font-bold transition-all duration-200 ${role === "student" ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"}`}>Student</button>
                  <button type="button" onClick={() => setRole("teacher")} className={`rounded-2xl border px-4 py-4 text-sm font-bold transition-all duration-200 ${role === "teacher" ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"}`}>Teacher</button>
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-slate-200">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <div className="my-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">or continue with</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="space-y-3">
            <button onClick={handleGoogleLogin} type="button" className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]">
              <span className="text-lg font-bold text-slate-900">G</span> Continue with Google
            </button>
            <button onClick={handleMicrosoftLogin} type="button" className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]">
              <span className="grid grid-cols-2 gap-[2px]">
                <span className="h-[8px] w-[8px] bg-[#F25022]" />
                <span className="h-[8px] w-[8px] bg-[#7FBA00]" />
                <span className="h-[8px] w-[8px] bg-[#00A4EF]" />
                <span className="h-[8px] w-[8px] bg-[#FFB900]" />
              </span>
              Continue with Microsoft
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;

