"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLink,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineRocketLaunch,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { FaGoogle } from "react-icons/fa";
import { FiAlertCircle, FiXCircle } from "react-icons/fi";
import { authClient, signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    role: "client", // Default to client
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Password Constraints Validation (Assignment Requirement)
  const passwordChecks = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
  };
  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Password must meet all security requirements.");
      return;
    }

    setLoading(true);

    try {
      // --- BETTER AUTH INTEGRATION ---
      // import { signUp } from "@/lib/auth-client";
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.image,
        role: formData.role,
        // Note: Role saving requires custom fields setup in Better Auth schema
      });
      if (result.error) throw new Error(result.error.message);

      // Simulate routing based on selected role
      if (formData.role === "client") {
        router.push("/");
      } else {
        router.push("/dashboard/freelancer");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid lg:grid-cols-2 min-h-[700px] mx-auto my-20">
      {/* Left Panel - Branding & Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden">
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
            Join the premier <br /> micro-task marketplace.
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Whether you&apos;re hiring top talent or earning from your skills,
            SkillSwap connects you instantly.
          </p>
          <ul className="space-y-3 text-emerald-50">
            <li className="flex items-center space-x-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Secure Stripe payments</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Verified freelancers & clients</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Fast, transparent proposals</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center space-x-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <HiOutlineRocketLaunch className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SkillSwap</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create an account
          </h1>
          <p className="text-slate-600 mb-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FaGoogle className="w-5 h-5 text-red-500" />
            <span>Continue with Google (Client)</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                or register with email
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm"
                  />
                </div>
              </div>
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
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Profile Image URL{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <HiOutlineLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
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
                  className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm"
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
              {/* Password Constraints Indicator */}
              {formData.password.length > 0 && (
                <div className="mt-2 space-y-1 text-xs">
                  <p
                    className={`flex items-center ${passwordChecks.length ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {passwordChecks.length ? (
                      <HiOutlineCheckCircle className="w-3.5 h-3.5 mr-1" />
                    ) : (
                      <FiXCircle className="w-3.5 h-3.5 mr-1" />
                    )}{" "}
                    At least 6 characters
                  </p>
                  <p
                    className={`flex items-center ${passwordChecks.uppercase ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {passwordChecks.uppercase ? (
                      <HiOutlineCheckCircle className="w-3.5 h-3.5 mr-1" />
                    ) : (
                      <FiXCircle className="w-3.5 h-3.5 mr-1" />
                    )}{" "}
                    One uppercase letter
                  </p>
                  <p
                    className={`flex items-center ${passwordChecks.lowercase ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {passwordChecks.lowercase ? (
                      <HiOutlineCheckCircle className="w-3.5 h-3.5 mr-1" />
                    ) : (
                      <FiXCircle className="w-3.5 h-3.5 mr-1" />
                    )}{" "}
                    One lowercase letter
                  </p>
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                I want to join as a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-300 ${formData.role === "client" ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === "client"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-medium text-sm">Client</span>
                </label>
                <label
                  className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-300 ${formData.role === "freelancer" ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="freelancer"
                    checked={formData.role === "freelancer"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-medium text-sm">Freelancer</span>
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                * Google OAuth users are automatically assigned as Clients.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
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
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
