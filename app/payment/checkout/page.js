"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HiOutlineShieldCheck, HiOutlineCreditCard } from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const proposal_id = searchParams.get("proposal_id");
  const task_id = searchParams.get("task_id");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposal_id, task_id, amount }),
        },
      );

      const data = await res.json();
      if (data.url) {
        // Redirect user to Stripe Hosted Checkout
        window.location.assign(data.url);
      } else {
        alert("Failed to create checkout session.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!amount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          Invalid checkout details. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white text-center">
          <HiOutlineShieldCheck className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
          <p className="text-emerald-100 text-sm mt-1">Powered by Stripe</p>
        </div>

        {/* Summary */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-slate-600">Task Payment</span>
            <span className="font-medium text-slate-900">
              Freelance Micro-Task
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-slate-600">Proposal ID</span>
            <span className="font-mono text-xs text-slate-500">
              #{proposal_id?.slice(-6)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold text-slate-900">
              Total Due
            </span>
            <span className="text-3xl font-bold text-emerald-600">
              ${parseFloat(amount).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />{" "}
                <span>Preparing Stripe...</span>
              </>
            ) : (
              <>
                <HiOutlineCreditCard className="w-5 h-5" />{" "}
                <span>Pay with Stripe</span>
              </>
            )}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel and go back
          </button>
        </div>
      </div>
    </div>
  );
}
