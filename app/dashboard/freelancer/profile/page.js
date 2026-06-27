"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlineUser,
  HiOutlineLink,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
  HiOutlineCheck,
} from "react-icons/hi2";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export default function FreelancerProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    bio: "",
    skills: "",
    hourly_rate: "",
  });

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/users/${session.user.email}`,
        );
        const user = await res.json();

        const skillsString = Array.isArray(user.skills)
          ? user.skills.join(", ")
          : "";

        setFormData({
          name: user.name || "",
          image: user.image || "",
          bio: user.bio || "",
          skills: skillsString,
          hourly_rate: user.hourly_rate || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/users/${session.user.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Profile</h1>
      <p className="text-slate-600 mb-8">
        Update your public profile so clients know exactly what you specialize
        in.
      </p>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center">
            <HiOutlineCheck className="w-5 h-5 mr-2" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Full Name
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Hourly Rate (USD)
              </label>
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Profile Image URL
            </label>
            <div className="relative">
              <HiOutlineLink className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Skills (Comma Separated)
            </label>
            <div className="relative">
              <HiOutlineSparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, UI Design"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Separate skills with a comma. These will show as badges on your
              profile.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell clients about your experience..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <HiOutlineCheck className="w-5 h-5" /> Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
