"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineCheckCircle, HiOutlineHome } from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const session_id = searchParams.get("session_id");
  const task_id = searchParams.get("task_id");
  const proposal_id = searchParams.get("proposal_id");

  const [status, setStatus] = useState("verifying");
  const [details, setDetails] = useState(null);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const confirmPayment = async () => {
      if (!session_id) {
        setStatus("error");
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/payments/confirm-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id, task_id, proposal_id }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setDetails(data);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [session_id, task_id, proposal_id, BACKEND_URL]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <FiLoader className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-red-200 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-slate-600 mb-6">
            We could not confirm your payment. Please check your dashboard or
            contact support.
          </p>
          <Link
            href="/dashboard/client"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-center">
        <div className="bg-emerald-50 p-8 border-b border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineCheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-600">
            Your transaction has been securely processed and the freelancer has
            been notified.
          </p>
        </div>

        <div className="p-8 space-y-4 text-left">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Transaction Details
          </h3>

          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">Task Title</span>
            <span className="font-semibold text-slate-900">
              {details?.task_title || "Micro-Task"}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">Transaction ID</span>
            <span className="font-mono text-sm text-slate-500">
              #{session_id?.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">Status</span>
            <span className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              Paid
            </span>
          </div>

          <div className="pt-4">
            <Link
              href="/dashboard/client"
              className="block w-full py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-all text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
