"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HiOutlineStar,
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { FiLoader, FiInbox } from "react-icons/fi";
import Image from "next/image";

export default function BrowseFreelancersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const skillFilters = [
    "All",
    "Design",
    "Development",
    "Writing",
    "Marketing",
    "Other",
  ];

  const currentSkill = searchParams.get("skill") || "All";
  const currentSort = searchParams.get("sort") || "rating";

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      try {
        const search = searchParams.get("search") || "";
        const skill = searchParams.get("skill") || "All";
        const sort = searchParams.get("sort") || "rating";

        const url = `${BACKEND_URL}/api/users/freelancers?search=${search}&skill=${skill}&sort=${sort}`;
        const res = await fetch(url);
        const data = await res.json();
        setFreelancers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancers();
  }, [searchParams, BACKEND_URL]);

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/freelancers?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters("search", searchInput);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Browse Freelancers
          </h1>
          <p className="text-slate-600">
            Find skilled professionals ready to bring your projects to life.
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or skill (e.g. React, Logo Design)..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-slate-600">Skill:</span>
              <div className="flex flex-wrap gap-2">
                {skillFilters.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => updateFilters("skill", skill)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      currentSkill === skill
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">
                  Sort by:
                </span>
                <select
                  value={currentSort}
                  onChange={(e) => updateFilters("sort", e.target.value)}
                  className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="jobs">Most Jobs Done</option>
                  <option value="rate_low">Price: Low to High</option>
                  <option value="rate_high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <FiLoader className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="mt-4 text-slate-500">
              Loading talented freelancers...
            </p>
          </div>
        )}

        {!loading && freelancers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <FiInbox className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">
              No freelancers found
            </h3>
            <p className="text-slate-500 mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {!loading && freelancers.length > 0 && (
          <>
            <p className="text-sm text-slate-600 mb-4">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {freelancers.length}
              </span>{" "}
              freelancer{freelancers.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freelancers.map((freelancer) => (
                <Link
                  key={freelancer._id}
                  href={`/freelancers/${encodeURIComponent(freelancer.email)}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                    <div className="p-6 pb-4">
                      <div className="flex items-start gap-4 mb-4">
                        {freelancer.image ? (
                          <Image
                            height={16}
                            width={16}
                            src={freelancer.image}
                            alt={freelancer.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                            {freelancer.name?.charAt(0).toUpperCase() || "F"}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors truncate">
                            {freelancer.name || "Freelancer"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <HiOutlineStar
                                className={`w-4 h-4 ${freelancer.stats?.avgRating > 0 ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                              />
                              <span className="text-sm font-semibold text-slate-900">
                                {freelancer.stats?.avgRating > 0
                                  ? freelancer.stats.avgRating
                                  : "New"}
                              </span>
                            </div>
                            {freelancer.stats?.totalReviews > 0 && (
                              <span className="text-xs text-slate-500">
                                ({freelancer.stats.totalReviews} reviews)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                        {freelancer.bio ||
                          "Professional freelancer ready to help with your projects."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(() => {
                          const skillsArray = Array.isArray(freelancer.skills)
                            ? freelancer.skills
                            : typeof freelancer.skills === "string"
                              ? freelancer.skills
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter((s) => s)
                              : [];

                          if (skillsArray.length === 0) {
                            return (
                              <span className="text-xs text-slate-400">
                                No skills listed
                              </span>
                            );
                          }

                          return (
                            <>
                              {skillsArray.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200"
                                >
                                  {skill}
                                </span>
                              ))}
                              {skillsArray.length > 3 && (
                                <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg">
                                  +{skillsArray.length - 3} more
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="mt-auto border-t border-slate-100 bg-slate-50 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <HiOutlineBriefcase className="w-4 h-4 text-emerald-500" />
                            <span className="font-semibold text-slate-900">
                              {freelancer.stats?.jobsCompleted || 0}
                            </span>
                            <span className="text-slate-500">jobs</span>
                          </div>
                        </div>

                        {freelancer.hourly_rate > 0 && (
                          <div className="flex items-center gap-1 text-emerald-600 font-bold">
                            <HiOutlineCurrencyDollar className="w-4 h-4" />
                            <span>{freelancer.hourly_rate}/hr</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
