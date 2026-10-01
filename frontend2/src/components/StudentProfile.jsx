import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import { getMyProfile, updateMyProfile } from "../services/profileService";
import { getLearningProgress } from "../services/learningService";
import { logoutUser } from "../services/authService";

function StudentProfile() {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profile, prog] = await Promise.all([
          getMyProfile(),
          getLearningProgress(),
        ]);
        setStudent(profile);
        setFormData(profile);
        setProgress(prog);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setFormData(student);
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(student);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const response = await updateMyProfile(formData);
      // Use response.data because our backend returns { success: true, data: profile }
      const updatedProfile = response.data || formData;
      setStudent(updatedProfile);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
        <p className="text-lg font-semibold text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
        <p className="text-lg font-semibold text-slate-400">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-black">

      {/* Navbar removed as it is now handled globally in App.jsx */}

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">

        {/* Heading */}
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-[#65B891]">
            STUDENT ACCOUNT
          </p>

          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            Your Profile
          </h1>

          <p className="mt-3 max-w-xl text-slate-500">
            Manage your personal information and learning preferences.
          </p>
        </div>


        {/* Profile Card */}
        <section className="mt-10 rounded-3xl bg-white p-7 shadow-sm sm:p-9">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-black text-3xl font-extbold text-white">
              {student.name?.charAt(0).toUpperCase() || "S"}
            </div>


            {/* Basic Info */}
            <div className="flex-1">

              <h2 className="text-2xl font-extrabold">
                {student.name}
              </h2>

              <p className="mt-1 text-slate-500">
                {student.email}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-[#E7F5EF] px-4 py-2 text-xs font-bold text-[#477D65]">
                Student
              </span>

            </div>


            {/* Edit */}
            {!editing && (
              <button
                onClick={handleEdit}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold transition hover:border-black"
              >
                Edit profile
              </button>
            )}

          </div>


          {/* Information */}
          <div className="mt-10 border-t border-slate-100 pt-8">

            {error && (
              <div className="mb-6 p-3 text-sm text-white bg-red-500 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">

              <ProfileField
                label="Full name"
                name="name"
                value={formData.name}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="Email"
                name="email"
                value={formData.email}
                editing={editing}
                onChange={handleChange}
                type="email"
              />

              <ProfileField
                label="English level"
                name="level"
                value={formData.level}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                label="Learning goal"
                name="learningGoal"
                value={formData.learningGoal}
                editing={editing}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* Save / Cancel */}
          {editing && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={handleCancel}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold transition hover:border-black"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

            </div>
          )}

        </section>


        {/* Learning Stats */}
        <section className="mt-6">

          <h2 className="text-xl font-extrabold">
            Learning overview
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">

            <StatCard
              value={progress?.wordsLearned || 0}
              label="Words learned"
            />

            <StatCard
              value={progress?.streak || 0}
              label="Day streak"
            />

            <StatCard
              value={progress?.sessions || 0}
              label="Speaking sessions"
            />

          </div>

        </section>


        {/* Learning Progress */}
        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-extrabold">
                Learning progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep building your English skills.
              </p>
            </div>

            <span className="text-xl font-extrabold">
              {progress?.percentage || 0}%
            </span>

          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-[#9DD8BD]"
              style={{ width: `${progress?.percentage || 0}%` }}
            />

          </div>

        </section>


        {/* Account */}
        <section className="mt-6 rounded-3xl border border-red-100 bg-white p-7">

          <h2 className="font-extrabold text-red-600">
            Account
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Sign out from your Speakly account.
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Log out
          </button>

        </section>

      </main>

    </div>
  );
}


/* Profile Field */
function ProfileField({
  label,
  name,
  value,
  editing,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="text-sm font-bold">
        {label}
      </label>

      {editing ? (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
        />
      ) : (
        <div className="mt-2 rounded-xl bg-[#F8FAF9] px-4 py-3 text-sm font-medium">
          {value || "Not specified"}
        </div>
      )}

    </div>
  );
}


/* Stat Card */
function StatCard({ value, label }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <p className="text-3xl font-extrabold">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}

export default StudentProfile;
