"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { FiLoader, FiInbox } from "react-icons/fi";

export default function BrowseTasksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const categories = [
    "All",
    "Design",
    "Development",
    "Writing",
    "Marketing",
    "Other",
  ];

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateQueryParams = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All" && value !== "") {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      if (name !== "page") params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const url = `${BACKEND_URL}/api/tasks?search=${currentSearch}&category=${currentCategory}&page=${currentPage}&limit=9`;
        const res = await fetch(url);
        const data = await res.json();

        setTasks(data.tasks || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentSearch, currentCategory, currentPage, BACKEND_URL]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParams("search", searchInput);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Browse Open Tasks
          </h1>
          <p className="text-slate-600">
            Find the perfect micro-task that matches your skills and start
            earning today.
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tasks by title (e.g. Logo, React, Article)..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            </div>

            <div className="relative md:w-56">
              <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={currentCategory}
                onChange={(e) => updateQueryParams("category", e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-sm hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300"
            >
              Search
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <FiLoader className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="mt-4 text-slate-500">Fetching latest tasks...</p>
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FiInbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md border border-emerald-100">
                        {task.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 mb-2">
                      {task.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-5 flex-1">
                      {task.description ||
                        "No description provided for this task."}
                    </p>

                    <div className="space-y-2 mb-5 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-slate-500">
                          <HiOutlineCurrencyDollar className="w-4 h-4 mr-1.5 text-emerald-500" />{" "}
                          Budget:
                        </span>
                        <span className="font-bold text-slate-900">
                          ${task.budget}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-slate-500">
                          <HiOutlineClock className="w-4 h-4 mr-1.5 text-amber-500" />{" "}
                          Deadline:
                        </span>
                        <span className="font-medium text-slate-700">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/tasks/${task._id}`}
                      className="block w-full text-center py-2.5 text-sm font-semibold text-emerald-600 border border-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"
                    >
                      View Details & Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => updateQueryParams("page", currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => updateQueryParams("page", pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNum
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => updateQueryParams("page", currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
