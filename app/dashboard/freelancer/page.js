"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

export default function FreelancerOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/proposals?freelancer_email=${session.user.email}`,
        );
        const proposals = await res.json();

        setStats({
          total: proposals.length,
          pending: proposals.filter((p) => p.status === "pending").length,
          accepted: proposals.filter((p) => p.status === "accepted").length,
          earnings: 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [session, BACKEND_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Proposals",
      value: stats.total,
      icon: HiOutlineDocumentText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending Proposals",
      value: stats.pending,
      icon: HiOutlineClock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Accepted Proposals",
      value: stats.accepted,
      icon: HiOutlineCheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Earnings",
      value: `$${stats.earnings}`,
      icon: HiOutlineCurrencyDollar,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Freelancer Dashboard
      </h1>
      <p className="text-slate-600 mb-8">
        Welcome back! Here is a summary of your freelance activity.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/tasks"
          className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl hover:bg-emerald-100 transition-colors group"
        >
          <HiOutlineBriefcase className="w-8 h-8 text-emerald-600 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">
            Browse Open Tasks
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Find new micro-tasks and submit proposals to start earning.
          </p>
        </Link>
        <Link
          href="/dashboard/freelancer/proposals"
          className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 transition-colors group"
        >
          <HiOutlineDocumentText className="w-8 h-8 text-slate-600 mb-3 group-hover:text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">
            View My Proposals
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Track the status of your applications and active projects.
          </p>
        </Link>
      </div>
    </div>
  );
}
