"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineDocumentText,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export default function ClientProposalsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const fetchProposals = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/proposals?client_email=${session.user.email}`,
      );
      const data = await res.json();

      // 🚨 FIX: Check if the backend returned an error
      if (!res.ok) {
        throw new Error(data.error || "Failed to load proposals");
      }

      // 🚨 FIX: Ensure data is an array before setting state
      setProposals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setProposals([]); // Fallback to empty array so .map() doesn't crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.email) return;

    const timer = setTimeout(() => {
      fetchProposals();
    }, 0);

    return () => clearTimeout(timer);
  }, [session]);

  const handleReject = async (proposalId) => {
    if (!confirm("Are you sure you want to reject this proposal?")) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/proposals/${proposalId}/reject`,
        {
          method: "PATCH",
        },
      );
      if (res.ok) {
        fetchProposals(); // Refresh the list
      } else {
        alert("Failed to reject proposal.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = (proposal) => {
    // Redirects to the Stripe Checkout dummy page as per Assignment Section 07
    router.push(
      `/payment/checkout?proposal_id=${proposal._id}&task_id=${proposal.task_id}&amount=${proposal.proposed_budget}`,
    );
  };

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Manage Proposals
          </h1>
          <p className="text-slate-600 mt-1">
            Review applications from freelancers for your posted tasks.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center">
          <FiAlertCircle className="w-5 h-5 mr-2" /> {error}
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
          <HiOutlineDocumentText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No proposals yet
          </h3>
          <p className="text-slate-500">
            When freelancers apply to your tasks, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Task Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Task
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">
                      {proposal.task_title}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                      proposal.task_status === "open"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Task: {proposal.task_status}
                  </span>
                </div>

                {/* Proposal Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Freelancer</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {proposal.freelancer_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Proposed Budget
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      ${proposal.proposed_budget}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Estimated Time
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {proposal.estimated_days} Days
                    </p>
                  </div>
                </div>

                {/* Cover Note */}
                <div className="bg-slate-50 p-4 rounded-xl mb-6">
                  <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">
                    Cover Note
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {proposal.cover_note || "No cover note provided."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(proposal.status)}
                    <span className="text-xs text-slate-400">
                      Applied{" "}
                      {new Date(proposal.submitted_at).toLocaleDateString()}
                    </span>
                  </div>

                  {proposal.status === "pending" &&
                    proposal.task_status === "open" && (
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => handleReject(proposal._id)}
                          className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <HiOutlineXCircle className="w-4 h-4" /> Reject
                        </button>
                        <button
                          onClick={() => handleAccept(proposal)}
                          className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <HiOutlinePaperAirplane className="w-4 h-4 rotate-45" />{" "}
                          Accept & Pay
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
