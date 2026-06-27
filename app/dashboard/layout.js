import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({ children, params }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  if (user.isBlocked) {
    redirect("/login?error=blocked");
  }

  const currentPath = (await params) || "/dashboard";

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
