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
      // Safe error extraction to remove editor warnings
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
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="flex items-center"><img src={logo} alt="Speakly" className="h-11 w-auto" /></Link>
        <p className="hidden text-sm text-slate-500 sm:block">Already have an account?<Link to="/login" className="ml-2 font-bold text-black hover:underline">Log in</Link></p>
      </nav>
      <main className="flex min-h-[calc(100vh-90px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-[#65B891]">GET STARTED</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">Create your account</h1>
            <p className="mt-4 text-slate-500">Start learning English the Speakly way.</p>
          </div>
          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            {error && <div className="rounded-xl bg-red-500 p-3 text-sm text-white">{error}</div>}
            <div className="space-y-5">
              <div><label htmlFor="name" className="mb-2 block text-sm font-semibold text-black">Full name</label><input id="name" type="text" placeholder="Enter your name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-4 text-black outline-none focus:border-black focus:ring-2 focus:ring-slate-100" /></div>
              <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-black">Email</label><input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-4 text-black outline-none focus:border-black focus:ring-2 focus:ring-slate-100" /></div>
              <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-black">Password</label><input id="password" type="password" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-4 text-black outline-none focus:border-black focus:ring-2 focus:ring-slate-100" /></div>
              <div>
                <label className="mb-3 block text-sm font-semibold text-black">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setRole("student")} className={`rounded-xl border px-4 py-4 text-sm font-bold ${role === "student" ? "border-black bg-black text-white" : "border-slate-200 bg-white text-black hover:border-black hover:bg-slate-50"}`}>Student</button>
                  <button type="button" onClick={() => setRole("teacher")} className={`rounded-xl border px-4 py-4 text-sm font-bold ${role === "teacher" ? "border-black bg-black text-white" : "border-slate-200 bg-white text-black hover:border-black hover:bg-slate-50"}`}>Teacher</button>
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-black px-6 py-4 font-bold text-white hover:bg-neutral-800 disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button>
          </form>
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-black transition hover:bg-slate-50 active:scale-[0.99]"
              >
                <span className="text-lg font-bold">G</span>
                Continue with Google
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-black transition hover:bg-slate-50 active:scale-[0.99]"
              >
                <svg width="19" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.39 1.8-3.12 1.87-2.38 5.98.48 7.16-.57 1.5-1.31 2.99-2.52 4.05zM12.03 7.25C11.88 5.02 13.69 3.18 15.76 3c.29 2.58-2.34 4.5-3.73 4.25z" />
                </svg>
                Continue with Apple
              </button>
              <button
                onClick={handleMicrosoftLogin}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-black transition hover:bg-slate-50 active:scale-[0.99]"
              >
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