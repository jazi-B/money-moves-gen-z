import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar, MobileNav } from "@/components/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent pointer-events-none" />
      <Sidebar />
      <MobileNav />
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
