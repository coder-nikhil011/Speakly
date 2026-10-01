import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", formData);
      if (response.data.success) {
        setMessage("OTP sent to your email successfully!");
        // Pass userId to the reset password page
        navigate("/reset-password", { state: { userId: response.data.userId, email: formData.email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/login" className="flex items-center">
          <img src={logo} alt="Speakly" className="h-11 w-auto" />
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-[#65B891] uppercase">
            Recovery
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
            Forgot Password?
          </h1>
          <p className="mt-4 text-slate-500">
            Enter your details to receive an OTP for password reset.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5 text-left">
            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded-xl">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 text-sm text-white bg-green-500 rounded-xl">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-black">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-black outline-none transition focus:border-black focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-black">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-black outline-none transition focus:border-black focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <p className="mt-8 text-sm text-slate-500">
            Remembered? <Link to="/login" className="font-bold text-black hover:underline">Back to Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
