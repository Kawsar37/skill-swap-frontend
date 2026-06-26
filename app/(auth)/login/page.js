"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";
import { FaGoogle } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { authClient, signIn, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  //   const user = useSession().data.user;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
      });
      if (result.error) throw new Error(result.error.message);

      const userRole = result.data.user.role;

      // Route based on Role (Assignment Requirement)
      if (userRole === "client") {
        router.push("/");
      } else if (userRole === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/freelancer");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });
      if (data) router.push("/");
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid lg:grid-cols-2 min-h-[600px] mx-auto my-20">
      {/* Left Panel - Branding & Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <HiOutlineRocketLaunch className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold">SkillSwap</span>
          </Link>
          <h2 className="text-3xl font-bold leading-tight mb-4">
            Welcome back to the <br /> future of freelancing.
          </h2>
          <p className="text-emerald-100 text-lg">
            Post tasks, hire top talent, and get work done faster than ever.
          </p>
        </div>

        {/* Mock Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p className="text-2xl font-bold">12k+</p>
            <p className="text-sm text-emerald-100">Tasks Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p className="text-2xl font-bold">8k+</p>
            <p className="text-sm text-emerald-100">Active Freelancers</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center space-x-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <HiOutlineRocketLaunch className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SkillSwap</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign in</h1>
          <p className="text-slate-600 mb-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FaGoogle className="w-5 h-5 text-red-500" />
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-600 text-sm">
              <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-emerald-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
