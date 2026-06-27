"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlineStar,
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineSparkles,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { FiLoader, FiUser } from "react-icons/fi";

export default function FreelancerPublicProfile() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const email = decodeURIComponent(params.email);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/users/${email}/full-profile`,
        );
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (email) fetchProfile();
  }, [email, BACKEND_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <FiLoader className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <FiUser className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">
          Freelancer Not Found
        </h2>
        <button
          onClick={() => router.push("/freelancers")}
          className="mt-4 text-emerald-600 hover:underline"
        >
          ← Back to Browse
        </button>
      </div>
    );
  }

  const { user, stats, reviews, recentJobs } = profile;
  const isOwnProfile = session?.user?.email === email;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6 transition-colors font-medium"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

          <div className="p-6 md:p-8 -mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-4xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "F"}
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {user.name || "Freelancer"}
                </h1>
                <p className="text-slate-500 text-sm mb-3">{user.email}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <HiOutlineStar className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900">
                      {stats.avgRating}
                    </span>
                    <span className="text-slate-500">
                      ({stats.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-slate-900">
                      {stats.jobsCompleted}
                    </span>
                    <span className="text-slate-500">jobs completed</span>
                  </div>
                  {user.hourly_rate > 0 && (
                    <div className="flex items-center gap-1.5">
                      <HiOutlineCurrencyDollar className="w-5 h-5 text-emerald-500" />
                      <span className="font-bold text-slate-900">
                        ${user.hourly_rate}
                      </span>
                      <span className="text-slate-500">/hour</span>
                    </div>
                  )}
                </div>
              </div>

              {!isOwnProfile && session?.user?.role === "client" && (
                <button
                  onClick={() => router.push("/tasks")}
                  className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-all whitespace-nowrap"
                >
                  Post a Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Statistics
              </h2>
              <div className="space-y-3">
                <StatRow
                  icon={HiOutlineCheckCircle}
                  label="Jobs Completed"
                  value={stats.jobsCompleted}
                  color="text-emerald-600"
                />
                <StatRow
                  icon={HiOutlineClock}
                  label="Jobs In Progress"
                  value={stats.jobsInProgress}
                  color="text-amber-600"
                />
                <StatRow
                  icon={HiOutlineStar}
                  label="Average Rating"
                  value={
                    stats.avgRating > 0 ? `${stats.avgRating}/5` : "No ratings"
                  }
                  color="text-amber-500"
                />
                <StatRow
                  icon={HiOutlineCalendar}
                  label="Member Since"
                  value={new Date(stats.memberSince).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                  color="text-blue-600"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HiOutlineSparkles className="w-5 h-5 text-emerald-500" />{" "}
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  // 🚨 BULLETPROOF FIX: Convert to array if it's a string
                  const skillsArray = Array.isArray(user.skills)
                    ? user.skills
                    : typeof user.skills === "string"
                      ? user.skills
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s)
                      : [];

                  if (skillsArray.length === 0) {
                    return (
                      <p className="text-sm text-slate-400">
                        No skills listed yet.
                      </p>
                    );
                  }

                  return skillsArray.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200"
                    >
                      {skill}
                    </span>
                  ));
                })()}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {user.bio || "This freelancer hasn't written a bio yet."}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {recentJobs && recentJobs.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HiOutlineBriefcase className="w-5 h-5 text-emerald-500" />{" "}
                  Recent Completed Jobs
                </h2>
                <div className="space-y-3">
                  {recentJobs.map((job, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {job.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            Completed{" "}
                            {new Date(job.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HiOutlineStar className="w-5 h-5 text-amber-400 fill-amber-400" />{" "}
                Client Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <div className="text-center py-10">
                  <HiOutlineStar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500">
                    No reviews yet. Be the first to hire this freelancer!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <HiOutlineStar
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        {review.comment || "No comment provided."}
                      </p>
                      <p className="text-xs text-slate-400">
                        Reviewed by:{" "}
                        <span className="font-medium">
                          {review.reviewer_email}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Icon className={`w-4 h-4 ${color}`} />
        <span>{label}</span>
      </div>
      <span className="font-semibold text-slate-900 text-sm">{value}</span>
    </div>
  );
}
