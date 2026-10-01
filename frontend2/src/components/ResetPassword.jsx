import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email } = location.state || {};
  
  const [formData, setFormData] = useState({ otp: "", newPassword: "" });
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

    if (!userId) {
      setError("No session found. Please start the process again.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/reset-password", {
        userId,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setMessage("Password reset successfully! You can now log in.");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or password. Please try again.");
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
            Verification
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
            Reset Password
          </h1>
          <p className="mt-4 text-slate-500">
            Enter the OTP sent to {email || "your email"} to change your password.
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
              <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-black">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                value={formData.otp}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-black outline-none transition focus:border-black focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-black">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-black outline-none transition focus:border-black focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </button>
          </form>

          <p className="mt-8 text-sm text-slate-500">
            Didn't get the OTP? <Link to="/forgot-password" className="font-bold text-black hover:underline">Send again</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
