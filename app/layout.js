import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Dashboard from "./dashboard/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SkillSwap - Freelance Micro-Task Marketplace",
  description:
    "Find skilled freelancers for every small project. Post tasks, receive proposals, and get work done fast.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
      data-theme="light"
    >
      <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
