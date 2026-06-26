import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // Your Better Auth server instance
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({ children, params }) {
  // 1. Fetch Session on the Server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. If no session (cookie was invalid/expired), redirect to login
  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  // 3. Check if user is blocked by Admin
  if (user.isBlocked) {
    // You could redirect to a "blocked" page, or just log them out
    redirect("/login?error=blocked");
  }

  // 4. Role-Based Routing Guard (Assignment Challenge 2)
  // If a Freelancer tries to access /dashboard/client, bounce them to their own dashboard

  const currentPath = (await params) || "/dashboard"; // Simplified for example

  if (user.role === "client" && currentPath == "/dashboard/freelancer")
    redirect("/dashboard/client");
  if (user.role === "freelancer" && currentPath == "/dashboard/client")
    redirect("/dashboard/freelancer");
  if (user.role !== "admin" && currentPath == "/dashboard/admin")
    redirect(`/${user.role}`);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar user={user} />

      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
