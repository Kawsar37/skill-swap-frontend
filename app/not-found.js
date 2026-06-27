import Link from "next/link";
import {
  HiOutlineRocketLaunch,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineArrowRight,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 mb-8 group"
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-700 transition-colors duration-300">
            <HiOutlineRocketLaunch className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">TaskHive</span>
        </Link>

        {/* 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 leading-none select-none">
            404
          </h1>
          {/* Floating Rocket Icon */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-2xl border border-slate-200 flex items-center justify-center">
              <HiOutlineRocketLaunch className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 -rotate-45" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Houston, we have a problem
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for has drifted into deep space. It might
          have been moved, deleted, or perhaps it never existed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5"
          >
            <HiOutlineHome className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/tasks"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 text-sm font-semibold text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-0.5"
          >
            <HiOutlineBriefcase className="w-5 h-5" />
            <span>Browse Tasks</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-md mx-auto">
          <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center justify-center gap-2">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400" />
            Looking for something else?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/freelancers"
              className="p-3 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 group"
            >
              Find Freelancers
              <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="p-3 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 group"
            >
              Sign In
              <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="p-3 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 group"
            >
              Create Account
              <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard/client"
              className="p-3 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 group"
            >
              Dashboard
              <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-slate-400">
          Error Code:{" "}
          <span className="font-mono font-semibold">PAGE_NOT_FOUND</span>
        </p>
      </div>
    </div>
  );
}
