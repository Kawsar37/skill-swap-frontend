"use client";

import Link from "next/link";
import {
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { FiSearch, FiTrendingUp, FiStar } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
              <FiTrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                Trusted by 10,000+ freelancers worldwide
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Get your tasks done by{" "}
              <span className="text-emerald-600 relative">
                skilled freelancers
                <svg
                  className="absolute -bottom-1 left-0 w-full h-2 text-emerald-200"
                  viewBox="0 0 200 8"
                  fill="currentColor"
                >
                  <path
                    d="M1 5.5C40 2 80 1 100 3C120 5 160 6.5 199 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Connect with talented professionals worldwide. Post micro-tasks,
              receive quality proposals, and get work delivered fast — all in
              one powerful marketplace.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/post-task"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Post a Task</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tasks"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 text-sm font-semibold text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiSearch className="w-4 h-4" />
                <span>Browse Tasks</span>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FiStar
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">4.9/5 rating</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-6 transform rotate-1 hover:rotate-0 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <HiOutlineBriefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Active Tasks
                    </h3>
                    <p className="text-xs text-slate-500">Real-time updates</p>
                  </div>
                </div>
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Logo Design",
                    client: "Sarah M.",
                    budget: "$150",
                    status: "In Progress",
                  },
                  {
                    title: "API Integration",
                    client: "Tech Corp",
                    budget: "$400",
                    status: "Pending",
                  },
                  {
                    title: "Blog Writing",
                    client: "ContentPro",
                    budget: "$80",
                    status: "Completed",
                  },
                ].map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.status === "Completed"
                            ? "bg-emerald-500"
                            : task.status === "In Progress"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">{task.client}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      {task.budget}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-600 mb-2">
                  <span>Monthly Progress</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                </div>
              </div>
            </div>

            <div
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-200 p-4 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <HiOutlineBriefcase className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">12,450</p>
                  <p className="text-xs text-slate-500">Tasks Completed</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-slate-200 p-4 animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <HiOutlineUserGroup className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">8,200+</p>
                  <p className="text-xs text-slate-500">Active Freelancers</p>
                </div>
              </div>
            </div>

            <div
              className="absolute top-1/2 -right-8 bg-white rounded-xl shadow-lg border border-slate-200 p-4 animate-bounce"
              style={{ animationDuration: "3.5s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <HiOutlineCurrencyDollar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">$2.4M</p>
                  <p className="text-xs text-slate-500">Total Payout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
