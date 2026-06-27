"use client";

import Link from "next/link";
import {
  HiOutlineRocketLaunch,
  HiOutlineEnvelope,
  HiOutlinePhone,
} from "react-icons/hi2";
import { FiGithub, FiLinkedin, FiFacebook, FiTwitter } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const path = usePathname();
  if (path.includes("/dashboard")) return <></>;

  const marketplaceLinks = [
    { name: "Browse Tasks", href: "/tasks" },
    { name: "Browse Freelancers", href: "/freelancers" },
    { name: "Post a Task", href: "/post-task" },
    { name: "How It Works", href: "/how-it-works" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const socialLinks = [
    { name: "GitHub", icon: FiGithub, href: "https://github.com" },
    { name: "LinkedIn", icon: FiLinkedin, href: "https://linkedin.com" },
    { name: "Facebook", icon: FiFacebook, href: "https://facebook.com" },
    { name: "Twitter", icon: FiTwitter, href: "https://twitter.com" },
  ];

  return (
    <footer className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                <HiOutlineRocketLaunch className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SkillSwap</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              The modern freelance micro-task marketplace connecting talented
              professionals with businesses worldwide.
            </p>

            <div className="space-y-2">
              <a
                href="mailto:hello@skillswap.com"
                className="flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                <HiOutlineEnvelope className="w-4 h-4" />
                <span>hello@skillswap.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                <HiOutlinePhone className="w-4 h-4" />
                <span>+1 (234) 567-890</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-3">
              {marketplaceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-400 mb-4">
              Get the latest tasks and opportunities delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
              <button className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} SkillSwap. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
