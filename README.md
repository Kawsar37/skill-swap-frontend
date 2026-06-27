# 🚀 SkillSwap - Freelance Micro-Task Marketplace

**SkillSwap** is a full-stack, role-based freelance marketplace built with **Next.js 16 (App Router)**, **React 19**, and **Better Auth**. It connects Clients (who post tasks) with Freelancers (who submit proposals and deliverables), facilitated by a secure **Stripe** payment gateway and overseen by an Admin dashboard.

This project was developed to fulfill advanced full-stack engineering requirements, including role-based access control, real-time database aggregation, third-party payment integration, and complex state management.

---

## 📑 Table of Contents

1. [Core Features](#-core-features)
2. [Tech Stack](#-tech-stack)
3. [Installation & Setup](#-installation--setup)
4. [Environment Variables](#-environment-variables)
5. [Security & Architecture](#-security--architecture)
6. [Deployment](#-deployment)

---

## 🌟 Core Features

### 🌐 Public Pages

- **Dynamic Homepage:** Features live "Featured Tasks" and "Top Rated Freelancers" fetched via backend aggregation.
- **Browse Tasks:** Advanced search (regex), category filtering, and server-side pagination (Limit 9 per page).
- **Browse Freelancers:** Searchable directory with sorting (Highest Rated, Most Jobs, Hourly Rate) and skill filtering.
- **Custom 404 Page:** Fully branded, responsive error handling for unknown routes.

### 👤 Client Dashboard

- **Task Management:** Post new tasks, edit open tasks, and delete tasks (prevented if a freelancer is already hired).
- **Proposal Review:** View enriched proposals (with task titles), compare budgets, and Accept/Reject applicants.
- **Stripe Checkout:** Accepting a proposal triggers a secure Stripe Hosted Checkout session.
- **Deliverable Review:** View submitted work URLs and leave star ratings/reviews for completed tasks.

### 💼 Freelancer Dashboard

- **Proposal Tracking:** Monitor pending, accepted, and rejected proposals.
- **Active Projects:** View in-progress tasks and submit deliverable URLs to mark work as "Completed".
- **Earnings Tracker:** Real-time calculation of lifetime earnings based on successful Stripe payouts.
- **Profile Management:** Update bio, hourly rate, and comma-separated skills (auto-converted to arrays).

### 🛡️ Admin Dashboard

- **Analytics Overview:** Visual line charts (Task Creation Trends) and pie charts (Category Distribution) powered by **Recharts**.
- **User Moderation:** Block/Unblock users. Blocked users are instantly stripped of session cookies and locked out.
- **Platform Oversight:** View all platform tasks and delete inappropriate content. Monitor global Stripe transaction history.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.2.9 (App Router, Turbopack)
- **Language:** JavaScript / React 19
- **Styling:** Tailwind CSS, Custom Gradients, Backdrop Blur
- **Icons:** React Icons (Heroicons v2, Feather Icons)
- **Authentication:** Better Auth (HTTP-only Cookies, Social OAuth)
- **Charts:** Recharts (Data Visualization)
- **Routing/Security:** Next.js 16 `proxy.js` (formerly Middleware) for route protection.

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- A running instance of the **SkillSwap Backend** (Express + MongoDB).

### Step 1: Clone the Repository

````bash
git clone <your-frontend-repo-url>
cd skill-swap-frontend


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
