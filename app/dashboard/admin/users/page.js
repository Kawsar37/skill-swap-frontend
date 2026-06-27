"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineShieldCheck,
  HiOutlineNoSymbol,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchUsers(), 0);
    return () => clearTimeout(id);
  }, []);

  const handleToggleBlock = async (userId, currentStatus) => {
    if (
      !confirm(
        `Are you sure you want to ${currentStatus ? "unblock" : "block"} this user?`,
      )
    )
      return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/users/${userId}/toggle-block`,
        { method: "PATCH" },
      );
      const data = await res.json();
      if (res.ok) {
        fetchUsers();
      } else {
        alert(data.error || "Action failed");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Users</h1>
      <p className="text-slate-600 mb-8">
        View all registered accounts and manage access permissions.
      </p>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.name || "No Name"}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-700"
                          : user.role === "freelancer"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="inline-flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full border border-red-200">
                        <HiOutlineNoSymbol className="w-3 h-3 mr-1" /> Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                        <HiOutlineCheckCircle className="w-3 h-3 mr-1" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== "admin" ? (
                      <button
                        onClick={() =>
                          handleToggleBlock(user._id, user.isBlocked)
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          user.isBlocked
                            ? "text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
                            : "text-red-600 hover:bg-red-50 border border-red-200"
                        }`}
                      >
                        {user.isBlocked ? "Unblock User" : "Block User"}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Protected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user.role} • {user.isBlocked ? "Blocked" : "Active"}
                  </p>
                </div>
              </div>
              {user.role !== "admin" && (
                <button
                  onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap ${
                    user.isBlocked
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
