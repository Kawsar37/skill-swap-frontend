"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import { FiLoader, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [proposalData, setProposalData] = useState({
    proposed_budget: "",
    estimated_days: "",
    cover_note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/tasks/${params.id}`);
        if (!res.ok) throw new Error("Task not found");
        const data = await res.json();
        setTask(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchTask();
  }, [params.id, BACKEND_URL]);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!session?.user?.email) {
      setError("Please login as a Freelancer to apply.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: params.id,
          freelancer_email: session.user.email,
          ...proposalData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("Proposal sent! The client will review it soon.");
      setProposalData({
        proposed_budget: "",
        estimated_days: "",
        cover_note: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <FiLoader className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!task && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-red-500">
        <FiAlertCircle className="w-12 h-12 mb-4" />
        <p className="text-xl font-bold">Task not found</p>
        <button
          onClick={() => router.push("/tasks")}
          className="mt-4 text-emerald-600 hover:underline"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const isFreelancer = session?.user?.role === "freelancer";
  const isOwner = session?.user?.email === task?.client_email;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-600 hover:text-emerald-600 mb-6 transition-colors font-medium"
        >
          <HiOutlineArrowLeft className="w-5 h-5 mr-2" /> Back to Tasks
        </button>

        {/* Task Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
              {task.category}
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full capitalize">
              {task.status}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {task.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center text-slate-600">
              <HiOutlineCurrencyDollar className="w-5 h-5 mr-2 text-emerald-500" />
              Budget:{" "}
              <span className="font-bold text-slate-900 ml-1">
                ${task.budget}
              </span>
            </div>
            <div className="flex items-center text-slate-600">
              <HiOutlineCalendar className="w-5 h-5 mr-2 text-amber-500" />
              Deadline:{" "}
              <span className="font-medium ml-1">
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-slate-600">
              <HiOutlineUser className="w-5 h-5 mr-2 text-blue-500" />
              Client:{" "}
              <span className="font-medium ml-1 truncate">
                {task.client_email}
              </span>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Description
          </h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {task.description ||
              "No detailed description provided by the client."}
          </p>
        </div>

        {/* Proposal Section (Only for Freelancers who don't own the task) */}
        {isFreelancer && !isOwner && task.status === "open" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <HiOutlinePaperAirplane className="w-6 h-6 mr-2 text-emerald-600" />{" "}
              Submit Your Proposal
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
                <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center">
                <FiCheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />{" "}
                {success}
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Proposed Budget (USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={proposalData.proposed_budget}
                    onChange={(e) =>
                      setProposalData({
                        ...proposalData,
                        proposed_budget: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estimated Days to Complete
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={proposalData.estimated_days}
                    onChange={(e) =>
                      setProposalData({
                        ...proposalData,
                        estimated_days: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cover Note / Message
                </label>
                <textarea
                  rows="4"
                  required
                  value={proposalData.cover_note}
                  onChange={(e) =>
                    setProposalData({
                      ...proposalData,
                      cover_note: e.target.value,
                    })
                  }
                  placeholder="Explain why you are the best fit for this task..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin" />{" "}
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Proposal</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Message for Task Owner */}
        {isOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-blue-800 font-medium mb-4">
              This is your task. Go to your Client Dashboard to view proposals.
            </p>
            <button
              onClick={() => router.push("/dashboard/client/proposals")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              View Proposals
            </button>
          </div>
        )}

        {/* Message for Logged Out Users */}
        {!session && (
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Want to apply for this task?
            </h3>
            <p className="text-slate-600 mb-6">
              Login as a Freelancer to submit your proposal.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Login to Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
