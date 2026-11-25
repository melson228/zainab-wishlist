import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdmin } from "@/lib/auth";

async function LoginContent() {
  await connection();
  if (await isAdmin()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center px-5 py-12">
      <AdminLoginForm />
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
          Загрузка…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
