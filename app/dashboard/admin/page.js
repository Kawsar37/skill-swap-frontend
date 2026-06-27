"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: HiOutlineUserGroup,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: HiOutlineBriefcase,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Active Tasks",
      value: stats?.activeTasks || 0,
      icon: HiOutlineClock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: HiOutlineCurrencyDollar,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Overview</h1>
      <p className="text-slate-600 mb-8">
        Monitor the health and activity of the SkillSwap platform.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
