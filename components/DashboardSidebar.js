"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineRocketLaunch,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineStar,
} from "react-icons/hi2";
import { signOut } from "@/lib/auth-client";
import Image from "next/image";

function SidebarContent({
  user,
  navLinks,
  pathname,
  setIsMobileMenuOpen,
  handleLogout,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="hidden lg:flex p-6 border-b border-slate-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
            <HiOutlineRocketLaunch className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">SkillSwap</span>
        </Link>
      </div>

      {/* User Profile Mini Card */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              height={10}
              width={10}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user.name}
            </p>
            <span className="inline-block px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full capitalize">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <link.icon
                className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
              />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define Links based on Role (Assignment Sections 07, 08, 09)
  const getNavLinks = () => {
    if (user.role === "client") {
      return [
        { name: "Overview", href: "/dashboard/client", icon: HiOutlineHome },
        {
          name: "Post a Task",
          href: "/dashboard/client/post-task",
          icon: HiOutlineClipboardDocumentList,
        },
        {
          name: "My Tasks",
          href: "/dashboard/client/my-tasks",
          icon: HiOutlineBriefcase,
        },
        {
          name: "Manage Proposals",
          href: "/dashboard/client/proposals",
          icon: HiOutlineChatBubbleLeftRight,
        },
      ];
    }
    if (user.role === "freelancer") {
      return [
        {
          name: "Overview",
          href: "/dashboard/freelancer",
          icon: HiOutlineHome,
        },
        {
          name: "Browse Tasks",
          href: "/tasks",
          icon: HiOutlineBriefcase,
        },
        {
          name: "My Proposals",
          href: "/dashboard/freelancer/proposals",
          icon: HiOutlineDocumentText,
        },
        {
          name: "Active Projects",
          href: "/dashboard/freelancer/projects",
          icon: HiOutlineCheckCircle,
        },
        {
          name: "My Earnings",
          href: "/dashboard/freelancer/earnings",
          icon: HiOutlineCurrencyDollar,
        },
        {
          name: "Edit Profile",
          href: "/dashboard/freelancer/profile",
          icon: HiOutlineCog6Tooth,
        },
      ];
    }
    if (user.role === "admin") {
      return [
        { name: "Overview", href: "/dashboard/admin", icon: HiOutlineHome },
        {
          name: "Manage Users",
          href: "/dashboard/admin/users",
          icon: HiOutlineUserGroup,
        },
        {
          name: "Manage Tasks",
          href: "/dashboard/admin/tasks",
          icon: HiOutlineBriefcase,
        },
        {
          name: "Transactions",
          href: "/dashboard/admin/transactions",
          icon: HiOutlineCurrencyDollar,
        },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <HiOutlineRocketLaunch className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">SkillSwap</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isMobileMenuOpen ? (
            <HiOutlineXMark className="w-6 h-6" />
          ) : (
            <HiOutlineBars3 className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          // ✅ Added top-16 so it doesn't cover the header
          className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        // ✅ Changed top-0 to top-16, and h-full to h-[calc(100vh-4rem)]
        className={`lg:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          user={user}
          navLinks={navLinks}
          pathname={pathname}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleLogout={handleLogout}
        />
      </div>

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white border-r border-slate-200 z-30">
        <SidebarContent
          user={user}
          navLinks={navLinks}
          pathname={pathname}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Spacer for Mobile Top Bar */}
      <div className="lg:hidden h-16 w-full" />
    </>
  );
}
