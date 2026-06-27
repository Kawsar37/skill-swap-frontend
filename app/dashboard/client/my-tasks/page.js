"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineBriefcase,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineStar,
  HiOutlineLink,
} from "react-icons/hi2";
import { FiLoader, FiInbox } from "react-icons/fi";

export default function MyTasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [reviewingTask, setReviewingTask] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const categories = ["Design", "Development", "Writing", "Marketing", "Other"];

  const fetchTasks = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/tasks/client/${session.user.email}`,
      );

      const text = await res.text();
      let data = [];
      try {
        data = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error("Backend returned non-JSON:", text);
      }

      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 0);

    return () => clearTimeout(timer);
  }, [session, BACKEND_URL]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      fetchTasks();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      category: task.category,
      description: task.description,
      budget: task.budget,
      deadline: new Date(task.deadline).toISOString().split("T")[0],
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.error("Exact save error:", err);
      alert("Failed to update task");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: reviewingTask._id,
          reviewer_email: session.user.email,
          reviewee_email: reviewingTask.freelancer_email,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      alert("Review submitted! Thank you.");
      setReviewingTask(null);
      fetchTasks();
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "open")
      return (
        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200 flex items-center gap-1 w-fit">
          <HiOutlineBriefcase className="w-3 h-3" /> Open
        </span>
      );
    if (status === "in_progress")
      return (
        <span className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200 flex items-center gap-1 w-fit">
          <HiOutlineClock className="w-3 h-3" /> In Progress
        </span>
      );
    return (
      <span className="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
        <HiOutlineCheckCircle className="w-3 h-3" /> Completed
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Tasks</h1>
      <p className="text-slate-600 mb-8">
        Manage the tasks you have posted. You can edit open tasks or delete them
        if no one has been hired yet.
      </p>

      {tasks.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
          <FiInbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            You haven&apos;t posted any tasks yet
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              {editingId === task._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg font-bold text-lg"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className="px-4 py-2 border border-slate-200 rounded-lg"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editForm.budget}
                      onChange={(e) =>
                        setEditForm({ ...editForm, budget: e.target.value })
                      }
                      className="px-4 py-2 border border-slate-200 rounded-lg"
                      placeholder="Budget"
                    />
                    <input
                      type="date"
                      value={editForm.deadline}
                      onChange={(e) =>
                        setEditForm({ ...editForm, deadline: e.target.value })
                      }
                      className="px-4 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1"
                    >
                      <HiOutlineXMark /> Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <HiOutlineCheck /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {task.title}
                      </h3>
                      {getStatusBadge(task.status)}
                    </div>
                    <p className="text-sm text-slate-500 mb-2">
                      Budget: ${task.budget} • Deadline:{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {task.description}
                    </p>
                    {task.deliverable_url && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                        <HiOutlineLink className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-0.5">
                            Submitted Deliverable
                          </p>
                          <a
                            href={task.deliverable_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-700 font-medium hover:underline truncate block"
                          >
                            {task.deliverable_url}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {task.status === "open" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                        title="Edit Task"
                      >
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        title="Delete Task"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {task.status === "completed" && (
                    <button
                      onClick={() => setReviewingTask(task)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 transition-colors"
                      title="Leave Review"
                    >
                      <HiOutlineStar className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {reviewingTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Leave a Review
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                    >
                      <HiOutlineStar
                        className={`w-8 h-8 transition-colors ${star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Comment
                </label>
                <textarea
                  rows="3"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="How was your experience?"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingTask(null)}
                  className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
