"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckCircle,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlinePencil,
  HiOutlineCodeBracket,
  HiOutlineMegaphone,
  HiOutlineLightBulb,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

export default function ExtraSections() {
  return (
    <>
      <PlatformStatistics />
      <HowItWorks />
      <PopularCategories />
    </>
  );
}

/* ==========================================
   Platform Statistics
========================================== */
function PlatformStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? "12,450+",
      icon: HiOutlineBriefcase,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "8,200+",
      icon: HiOutlineUserGroup,
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
      gradient: "from-teal-500 to-teal-600",
    },
    {
      label: "Total Payout",
      value: stats?.totalPayout ?? "$2.4M+",
      icon: HiOutlineCurrencyDollar,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      gradient: "from-green-500 to-green-600",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            Platform Stats
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Trusted by Thousands
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Our growing community of freelancers and clients makes SkillSwap the
            go-to marketplace for micro-tasks.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center hover:shadow-xl hover:border-emerald-300 hover:-translate-y-2 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>

                {/* Value */}
                <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="text-sm font-medium text-slate-600">
                  {stat.label}
                </p>

                {/* Bottom gradient bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================
   How It Works
========================================== */
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Post a Task",
      description:
        "Describe your project, set a budget and deadline. It only takes a few minutes to get started.",
      icon: HiOutlineClipboardDocumentList,
    },
    {
      step: "02",
      title: "Receive Proposals",
      description:
        "Get matched with skilled freelancers who send you competitive proposals within hours.",
      icon: HiOutlineChatBubbleLeftRight,
    },
    {
      step: "03",
      title: "Hire & Pay",
      description:
        "Choose the best freelancer, track progress in real-time, and pay securely through our platform.",
      icon: HiOutlineCheckCircle,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            How It Works
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Get started in three simple steps. Our streamlined process makes
            hiring effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-100" />
              )}

              <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 relative z-10">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {step.step}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">
                  <step.icon className="w-7 h-7 text-emerald-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   Popular Categories
========================================== */
function PopularCategories() {
  const categories = [
    {
      name: "Design",
      description: "Logos, branding, UI/UX design and more creative tasks.",
      icon: HiOutlinePencil,
      taskCount: "2,340",
      gradient: "from-purple-500 to-indigo-500",
      lightBg: "group-hover:bg-purple-50",
      iconHover: "group-hover:text-purple-600",
    },
    {
      name: "Development",
      description: "Web apps, mobile apps, APIs and full-stack development.",
      icon: HiOutlineCodeBracket,
      taskCount: "3,120",
      gradient: "from-emerald-500 to-teal-500",
      lightBg: "group-hover:bg-emerald-50",
      iconHover: "group-hover:text-emerald-600",
    },
    {
      name: "Writing",
      description: "Blog posts, copywriting, technical writing and content.",
      icon: HiOutlineSparkles,
      taskCount: "1,890",
      gradient: "from-amber-500 to-orange-500",
      lightBg: "group-hover:bg-amber-50",
      iconHover: "group-hover:text-amber-600",
    },
    {
      name: "Marketing",
      description: "SEO, social media, email campaigns and digital marketing.",
      icon: HiOutlineMegaphone,
      taskCount: "1,450",
      gradient: "from-pink-500 to-rose-500",
      lightBg: "group-hover:bg-pink-50",
      iconHover: "group-hover:text-pink-600",
    },
    {
      name: "Other",
      description: "Virtual assistance, data entry, translations and more.",
      icon: HiOutlineLightBulb,
      taskCount: "980",
      gradient: "from-sky-500 to-cyan-500",
      lightBg: "group-hover:bg-sky-50",
      iconHover: "group-hover:text-sky-600",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Popular Categories
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Browse tasks by category to find exactly what you need or discover
            new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 cursor-pointer hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 bg-slate-100 ${category.lightBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300`}
              >
                <category.icon
                  className={`w-6 h-6 text-slate-600 ${category.iconHover} transition-colors duration-300`}
                />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {category.description}
              </p>

              {/* Task Count */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-sm font-semibold text-emerald-600">
                  {category.taskCount} tasks
                </span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-500 transition-colors duration-300">
                  Browse →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
