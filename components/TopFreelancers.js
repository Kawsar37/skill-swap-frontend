"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiOutlineStar,
  HiOutlineBriefcase,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { FiLoader, FiAlertCircle, FiInbox, FiUser } from "react-icons/fi";

export default function TopFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/freelancers/top", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch freelancers: ${response.status}`);
        }

        const data = await response.json();
        setFreelancers(data.freelancers || data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            Top Talent
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Top Freelancers
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Work with verified professionals who have proven track records of
            delivering exceptional results.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="mt-4 text-sm text-slate-500">
              Loading top freelancers...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Unable to load freelancers
            </h3>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && freelancers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FiInbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              No freelancers yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Be the first to join our marketplace.
            </p>
          </div>
        )}

        {/* Freelancers Grid */}
        {!loading && !error && freelancers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {freelancers.map((freelancer) => (
              <div
                key={freelancer.id || freelancer._id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6 text-center">
                  {/* Profile Image */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    {freelancer.profileImage || freelancer.avatar ? (
                      <img
                        src={freelancer.profileImage || freelancer.avatar}
                        alt={freelancer.name}
                        className="w-full h-full rounded-full object-cover border-4 border-emerald-100 group-hover:border-emerald-300 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center border-4 border-emerald-100 group-hover:border-emerald-300 transition-all duration-300">
                        <FiUser className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {/* Online Indicator */}
                    {freelancer.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
                    {freelancer.name || freelancer.fullName || "Freelancer"}
                  </h3>

                  {/* Rating & Jobs */}
                  <div className="flex items-center justify-center space-x-4 mt-2 mb-4">
                    <div className="flex items-center space-x-1">
                      <HiOutlineStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-slate-900">
                        {freelancer.averageRating || freelancer.rating || "0.0"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <HiOutlineBriefcase className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {freelancer.completedJobs ||
                          freelancer.jobsCompleted ||
                          0}{" "}
                        jobs
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                    {(freelancer.skills || [])
                      .slice(0, 3)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    {(freelancer.skills || []).length > 3 && (
                      <span className="px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-full">
                        +{freelancer.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href={`/freelancers/${freelancer.id || freelancer._id}`}
                    className="inline-flex items-center justify-center w-full space-x-2 px-4 py-2.5 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"
                  >
                    <span>View Profile</span>
                    <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && freelancers.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/freelancers"
              className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300"
            >
              <span>View All Freelancers</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
