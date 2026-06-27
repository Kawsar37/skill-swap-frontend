"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineBriefcase,
} from "react-icons/hi2";
import { FiLoader, FiInbox } from "react-icons/fi";

export default function FreelancerEarningsPage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/payments/freelancer/${session.user.email}`,
        );
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [session]);

  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Earnings</h1>
      <p className="text-slate-600 mb-8">
        Track your income from completed tasks and successful payouts.
      </p>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-2xl shadow-lg mb-8 text-white">
        <p className="text-emerald-100 text-sm font-medium mb-1">
          Total Lifetime Earnings
        </p>
        <p className="text-4xl font-bold flex items-center gap-2">
          <HiOutlineCurrencyDollar className="w-8 h-8" />$
          {totalEarnings.toFixed(2)}
        </p>
        <p className="text-emerald-100 text-xs mt-2">
          {payments.length} successful payout{payments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
          <FiInbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No earnings yet
          </h3>
          <p className="text-slate-500">
            Complete your first active project to start earning money!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Task Title</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Amount Made</th>
                  <th className="px-6 py-4">Completion Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                      <HiOutlineBriefcase className="w-4 h-4 text-emerald-500" />{" "}
                      {p.task_title}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {p.client_email}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(p.paid_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p._id} className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-slate-900 text-base">
                    {p.task_title}
                  </h3>
                  <span className="font-bold text-emerald-600 text-lg">
                    ${p.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-500 gap-4 pt-1">
                  <span className="flex items-center gap-1">
                    <HiOutlineUser className="w-3.5 h-3.5" /> {p.client_email}
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-400 gap-1 pt-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5" /> Paid on{" "}
                  {new Date(p.paid_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
