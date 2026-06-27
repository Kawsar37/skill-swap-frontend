"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  HiOutlineStar,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { FiLoader, FiUser } from "react-icons/fi";
import Image from "next/image";

export default function FreelancerPublicProfile() {
  const params = useParams();
  const email = decodeURIComponent(params.email);

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reviewsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/users/${email}`),
          fetch(`${BACKEND_URL}/api/reviews/${email}`),
        ]);

        const userData = await userRes.json();
        const reviewsData = await reviewsRes.json();

        setUser(userData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (email) fetchData();
  }, [email]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <FiLoader className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );

  if (!user || user.error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <FiUser className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">
          Freelancer Not Found
        </h2>
      </div>
    );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "No ratings yet";

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
          <div className="p-6 md:p-8 -mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {user.image ? (
                <Image
                  height={24}
                  width={24}
                  src={user.image}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "F"}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900">
                  {user.name || "Freelancer"}
                </h1>
                <p className="text-slate-500 text-sm mt-1">{user.email}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 flex items-center gap-1">
                    <HiOutlineStar className="w-6 h-6 text-amber-400 fill-amber-400" />{" "}
                    {avgRating}
                  </p>
                  <p className="text-xs text-slate-500">
                    {reviews.length} Reviews
                  </p>
                </div>
                {user.hourly_rate > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 flex items-center gap-1">
                      <HiOutlineCurrencyDollar className="w-6 h-6 text-emerald-500" />{" "}
                      {user.hourly_rate}
                    </p>
                    <p className="text-xs text-slate-500">Per Hour</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiOutlineSparkles className="w-5 h-5 text-emerald-500" />{" "}
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(user.skills) && user.skills.length > 0 ? (
                  user.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No skills listed yet.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {user.bio || "This freelancer hasn't written a bio yet."}
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Client Reviews
            </h2>
            {reviews.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
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
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <HiOutlineStar
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {review.comment || "No comment provided."}
                    </p>
                    <p className="text-xs text-slate-400 mt-3">
                      Reviewed by: {review.reviewer_email}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
