"use client";

import { useState, useEffect } from "react";
import { HiOutlineCurrencyDollar, HiOutlineCheckCircle } from "react-icons/hi2";
import { FiLoader, FiInbox } from "react-icons/fi";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/payments/admin`);
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalVolume = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Transaction History
      </h1>
      <p className="text-slate-600 mb-8">
        Monitor all Stripe payments processed across the platform.
      </p>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">
            Total Platform Volume
          </p>
          <p className="text-3xl font-bold text-slate-900">
            ${totalVolume.toFixed(2)}
          </p>
        </div>
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
          <HiOutlineCurrencyDollar className="w-8 h-8 text-emerald-600" />
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
          <FiInbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No transactions yet
          </h3>
          <p className="text-slate-500">
            When clients pay freelancers, the Stripe history will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Client Email</th>
                  <th className="px-6 py-4">Freelancer Email</th>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Payout Size</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {t.client_email}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {t.freelancer_email}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {t.task_title}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ${t.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(t.paid_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        <HiOutlineCheckCircle className="w-3.5 h-3.5 mr-1" />{" "}
                        {t.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {transactions.map((t) => (
              <div key={t._id} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400">Task</p>
                    <p className="font-semibold text-slate-900 text-sm">
                      {t.task_title}
                    </p>
                  </div>
                  <span className="font-bold text-emerald-600 text-lg">
                    ${t.amount.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-slate-400">Client</p>
                    <p className="text-slate-700 truncate">{t.client_email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Freelancer</p>
                    <p className="text-slate-700 truncate">
                      {t.freelancer_email}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500">
                    {new Date(t.paid_at).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 uppercase">
                    {t.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
