import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../assets/navbar_logo.png";
import { loginUser } from "../services/authService";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        try {
          localStorage.setItem("token", token);
          
          // Fetch user profile to get role and other details
          const response = await api.get("/profile/me");
          const user = response.data.user || response.data;
          
          localStorage.setItem("user", JSON.stringify(user));
          
          if (user?.role === "teacher") {
            navigate("/teacher");
          } else {
            navigate("/student");
          }
        } catch (err) {
          console.error("Google Auth profile fetch failed", err);
          setError("Authentication failed. Please try again.");
        }
      }
    };

    handleGoogleRedirect();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      
      if (result && result.success) {
        setError(""); // Clear error only on successful login
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role === "teacher") {
          navigate("/teacher");
        } else {
          navigate("/student");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
      <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100">

      {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-6 sm:px-12">

        {/* Logo */}
        <Link
          to="/"
            className="flex items-center transition-opacity hover:opacity-80"
        >
          <img
            src={logo}
            alt="Speakly"
              className="h-10 w-auto"
          />
        </Link>

        {/* Signup */}
          <p className="hidden text-sm font-medium text-slate-500 sm:block">
          New to Speakly?

          <Link
            to="/signup"
              className="ml-2 font-bold text-slate-900 hover:text-slate-600 transition"
          >
            Create account
          </Link>
        </p>

      </nav>


      {/* Main */}
        <main className="flex min-h-[calc(100vh-100px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}
            <div className="text-center mb-12">

              <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-3">
                Welcome Back
            </p>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
              Log in to Speakly
            </h1>

              <p className="text-slate-500 font-medium">
              Continue your English learning journey.
            </p>

          </div>


          {/* Form */}
          <form
              className="space-y-6"
            onSubmit={handleSubmit}
          >
            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl">
                {error}
              </div>
            )}

            {/* Email */}
              <div className="group">

              <label
                htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
              />

            </div>


            {/* Password */}
              <div className="group">

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                onClick={() => navigate("/forgot-password")}
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
              >
                Forgot password?
              </button>

              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
              />

            </div>


            {/* Login */}
            <button
              type="submit"
              disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-slate-200"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

          </form>


          {/* Divider */}
            <div className="my-10 flex items-center gap-4">

            <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              or continue with
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>


          {/* Social Login */}
          <div className="space-y-3">

            {/* Google */}
            <button
              type="button"
              onClick={() => window.location.href = "http://localhost:5001/api/auth/google"}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
            >

                <span className="text-lg font-bold text-slate-900">
                G
              </span>

              Continue with Google

            </button>


              {/* Microsoft */}
              <button
                type="button"
                onClick={() => window.location.href = "http://localhost:5001/api/auth/microsoft"}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
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


            {/* Mobile Signup */}
            <p className="mt-8 text-center text-sm text-slate-500 sm:hidden">

              New to Speakly?

              <Link
                to="/signup"
                className="ml-1 font-bold text-slate-900 hover:underline"
              >
                Create account
              </Link>

            </p>


            {/* Terms */}
            <p className="mt-8 text-center text-xs leading-5 text-slate-400">

              By continuing, you agree to Speakly's{" "}

              <a
                href="#"
                className="underline hover:text-slate-600"
              >
                Terms of Service
              </a>{" "}

              and{" "}

              <a
                href="#"
                className="underline hover:text-slate-600"
              >
                Privacy Policy
              </a>.

            </p>

          </div>

        </main>

      </div>
    );
  }

  export default Login;