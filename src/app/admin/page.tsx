import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { isAdmin } from "@/lib/auth";
import { getSettings, listItems } from "@/lib/store";

async function AdminContent() {
  await connection();
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const [settings, items] = await Promise.all([getSettings(), listItems()]);

  return <AdminDashboard settings={settings} items={items} />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
          Открываем кабинет…
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
