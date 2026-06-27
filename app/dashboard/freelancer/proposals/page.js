"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

export default function MyProposalsPage() {
  const { data: session } = useSession();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchProposals = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/proposals?freelancer_email=${session.user.email}`,
        );
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [session, BACKEND_URL]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            <HiOutlineCheckCircle className="w-3.5 h-3.5 mr-1" /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-200">
            <HiOutlineXCircle className="w-3.5 h-3.5 mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            <HiOutlineClock className="w-3.5 h-3.5 mr-1" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Proposals</h1>
      <p className="text-slate-600 mb-8">
        Track all the tasks you have applied to.
      </p>

      {proposals.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
          <HiOutlineDocumentText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No proposals yet
          </h3>
          <p className="text-slate-500 mb-6">
            Start browsing open tasks to submit your first proposal!
          </p>
          <Link
            href="/tasks"
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
          >
            Browse Tasks
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Task Title</th>
                  <th className="px-6 py-4">Budget Bid</th>
                  <th className="px-6 py-4">Timeframe</th>
                  <th className="px-6 py-4">Date Sent</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposals.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {p.task_title}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      ${p.proposed_budget}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {p.estimated_days} Days
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(p.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {proposals.map((p) => (
              <div key={p._id} className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-semibold text-slate-900 text-base leading-tight">
                    {p.task_title}
                  </h3>
                  {getStatusBadge(p.status)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-slate-400 text-xs">Bid</p>
                    <p className="font-bold text-slate-800">
                      ${p.proposed_budget}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Time</p>
                    <p className="font-medium text-slate-700">
                      {p.estimated_days} Days
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Sent</p>
                    <p className="font-medium text-slate-700">
                      {new Date(p.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
