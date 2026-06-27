"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineTrash,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { FiLoader, FiInbox } from "react-icons/fi";

export default function AdminManageTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/tasks`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchTasks);
  }, []);

  const handleDelete = async (id) => {
    if (
      !confirm(
        "WARNING: This will permanently delete the task and all associated proposals. Are you sure?",
      )
    )
      return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/tasks/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchTasks();
      else alert("Failed to delete task.");
    } catch (err) {
      alert("Network error");
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
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Tasks</h1>
      <p className="text-slate-600 mb-8">
        Monitor all tasks posted on the platform. Delete tasks that violate
        community guidelines.
      </p>

      {tasks.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
          <FiInbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No tasks found
          </h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Title & Category</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">{task.category}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {task.client_email}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ${task.budget}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                      >
                        <HiOutlineTrash className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(task.status)}
                    <span className="text-xs text-slate-500">
                      ${task.budget}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="p-2 text-red-600 bg-red-50 rounded-lg shrink-0"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
