"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export default function AdminOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/admin/stats`),
          fetch(`${BACKEND_URL}/api/admin/analytics`),
        ]);

        const statsData = await statsRes.json();
        const analyticsData = await analyticsRes.json();

        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: HiOutlineUserGroup,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: HiOutlineBriefcase,
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
    },
    {
      label: "Active Tasks",
      value: stats?.activeTasks || 0,
      icon: HiOutlineClock,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: HiOutlineCurrencyDollar,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Overview</h1>
      <p className="text-slate-600 mb-8">
        Monitor the health and activity of the SkillSwap platform.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Task Creation Trend (Last 30 Days)
          </h2>
          {analytics?.taskCreationChart?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.taskCreationChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Tasks by Category
          </h2>
          {analytics?.categoryChart?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.categoryChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryChart.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Recent Payments</h2>
          <p className="text-sm text-slate-500 mt-1">
            Latest transactions processed on the platform
          </p>
        </div>

        {analytics?.recentPayments?.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Task</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Freelancer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.recentPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">
                        {payment.task_title}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {payment.client_email}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {payment.freelancer_email}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        ${payment.amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(payment.paid_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                          <HiOutlineCheckCircle className="w-3.5 h-3.5 mr-1" />
                          {payment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100">
              {analytics.recentPayments.map((payment) => (
                <div key={payment._id} className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {payment.task_title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(payment.paid_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-bold text-emerald-600 text-lg ml-3">
                      ${payment.amount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-slate-400 mb-0.5">Client</p>
                      <p className="text-slate-700 truncate">
                        {payment.client_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5">Freelancer</p>
                      <p className="text-slate-700 truncate">
                        {payment.freelancer_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 uppercase">
                      <HiOutlineCheckCircle className="w-3 h-3 mr-0.5" />
                      {payment.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-10 text-center">
            <HiOutlineXCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No payments yet
            </h3>
            <p className="text-slate-500">
              Transactions will appear here once clients start paying
              freelancers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
