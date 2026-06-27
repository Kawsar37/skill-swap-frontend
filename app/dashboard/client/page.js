"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlinePlusCircle,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

export default function ClientOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/tasks/client-stats/${session.user.email}`,
        );
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [session]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );

  const statCards = [
    {
      label: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: HiOutlineBriefcase,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Open Tasks",
      value: stats?.openTasks || 0,
      icon: HiOutlineClipboardDocumentList,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    {
      label: "In Progress",
      value: stats?.inProgressTasks || 0,
      icon: HiOutlineClock,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
    {
      label: "Total Spent",
      value: `$${(stats?.totalSpent || 0).toFixed(2)}`,
      icon: HiOutlineCurrencyDollar,
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {session?.user?.name?.split(" ")[0] || "Client"}! 👋
        </h1>
        <p className="text-slate-600">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/client/post-task"
            className="group p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white"
          >
            <HiOutlinePlusCircle className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Post a New Task</h3>
            <p className="text-emerald-100 text-sm">
              Describe what you need done and get proposals from skilled
              freelancers within minutes.
            </p>
          </Link>

          <Link
            href="/dashboard/client/proposals"
            className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <HiOutlineChatBubbleLeftRight className="w-10 h-10 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Manage Proposals
            </h3>
            <p className="text-slate-600 text-sm">
              Review applications, compare budgets, and hire the best freelancer
              for your tasks.
            </p>
          </Link>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-8">
        <h3 className="font-semibold text-slate-900 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-slate-600">
          Tasks with clear descriptions and realistic budgets receive 3x more
          proposals from top-rated freelancers. Make sure to include all
          necessary details when posting!
        </p>
      </div>
    </div>
  );
}
