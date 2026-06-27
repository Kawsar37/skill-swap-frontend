"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineLink,
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineBriefcase,
} from "react-icons/hi2";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export default function ActiveProjectsPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const fetchProjects = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/tasks/freelancer-projects/${session.user.email}`,
      );
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [session]);

  const openModal = (task) => {
    setSelectedTask(task);
    setDeliverableUrl(task.deliverable_url || "");
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/tasks/${selectedTask._id}/submit-deliverable`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliverable_url: deliverableUrl }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const activeTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Active Projects
      </h1>
      <p className="text-slate-600 mb-8">
        Track your in-progress work and submit deliverables to get paid.
      </p>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <HiOutlineClock className="w-5 h-5 mr-2 text-amber-500" /> In Progress
          ({activeTasks.length})
        </h2>
        {activeTasks.length === 0 ? (
          <p className="text-slate-500 text-sm bg-white p-4 rounded-xl border border-slate-200">
            No active projects right now.
          </p>
        ) : (
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Budget: ${task.budget} • Deadline:{" "}
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => openModal(task)}
                  className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <HiOutlinePaperAirplane className="w-4 h-4 rotate-45" />{" "}
                  Submit Deliverable
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <HiOutlineCheckCircle className="w-5 h-5 mr-2 text-emerald-500" />{" "}
          Completed ({completedTasks.length})
        </h2>
        {completedTasks.length === 0 ? (
          <p className="text-slate-500 text-sm bg-white p-4 rounded-xl border border-slate-200">
            You haven&apos;t completed any projects yet.
          </p>
        ) : (
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{task.title}</h3>
                  <span className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    Completed
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <HiOutlineLink className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                  <a
                    href={task.deliverable_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline truncate"
                  >
                    {task.deliverable_url}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                Submit Deliverable
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <HiOutlineXMark className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Submitting for:{" "}
                <span className="font-semibold text-slate-900">
                  {selectedTask?.title}
                </span>
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-2" /> {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Deliverable URL
                </label>
                <div className="relative">
                  <HiOutlineLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    required
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    placeholder="https://github.com/your-repo or Google Docs link"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Once submitted, the task will be marked as Completed.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <HiOutlineCheckCircle className="w-4 h-4" />
                  )}
                  {submitting ? "Submitting..." : "Mark as Completed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
