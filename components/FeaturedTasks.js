"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { FiLoader, FiAlertCircle, FiInbox } from "react-icons/fi";

export default function FeaturedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BACKEND_URL}/api/tasks/featured`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok)
          throw new Error(`Failed to fetch tasks: ${response.status}`);

        const data = await response.json();
        setTasks(data.tasks || data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [BACKEND_URL]);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            Featured Opportunities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Latest Featured Tasks
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Explore open tasks posted by verified clients. Find the perfect
            project that matches your skills.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="mt-4 text-sm text-slate-500">
              Loading featured tasks...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Unable to load tasks
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

        {!loading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FiInbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              No tasks available
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Check back soon for new opportunities.
            </p>
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id || task._id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md">
                      <HiOutlineTag className="w-3 h-3 mr-1" />
                      {task.category || "General"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "Just posted"}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 mb-2">
                    {task.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {task.description || "No description provided."}
                  </p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center text-sm text-slate-600">
                      <HiOutlineUser className="w-4 h-4 mr-2 text-slate-400" />
                      <span>
                        {task.clientName ||
                          task.client?.name ||
                          "Anonymous Client"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <HiOutlineCurrencyDollar className="w-4 h-4 mr-2 text-emerald-500" />
                      <span className="font-semibold text-slate-900">
                        {task.budget
                          ? `$${Number(task.budget).toLocaleString()}`
                          : "Budget negotiable"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <HiOutlineClock className="w-4 h-4 mr-2 text-amber-500" />
                      <span>
                        {task.deadline
                          ? `Due ${new Date(task.deadline).toLocaleDateString()}`
                          : "Flexible deadline"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/tasks/${task.id || task._id}`}
                    className="inline-flex items-center justify-center w-full space-x-2 px-4 py-2.5 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"
                  >
                    <span>View Details</span>
                    <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/tasks"
              className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300"
            >
              <span>View All Tasks</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
