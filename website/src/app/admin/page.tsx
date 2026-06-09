import Link from "next/link";
import { requireAdminUser } from "@/lib/admin/requireAdmin";

export default async function AdminPage() {
  const adminCheck = await requireAdminUser();

  if (!adminCheck.ok) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-black">Admin Access Required</h1>
        <p className="mt-4 text-slate-400">{adminCheck.message}</p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950">
          Go to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-black">Admin Panel</h1>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Link href="/admin/access-requests" className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Access Requests</h2>
          <p className="mt-2 text-slate-400">
            Approve users and send Supabase invite emails.
          </p>
        </Link>

        <Link href="/portal/devices" className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Device Records</h2>
          <p className="mt-2 text-slate-400">
            View assigned product devices.
          </p>
        </Link>
      </div>
    </main>
  );
}