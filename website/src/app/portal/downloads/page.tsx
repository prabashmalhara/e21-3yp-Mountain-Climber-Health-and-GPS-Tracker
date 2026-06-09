import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAccountStatus } from "@/lib/account/requireVerifiedAccount";

export default async function DownloadsPage() {
  const accountStatus = await getCurrentAccountStatus();

  if (!accountStatus.loggedIn) {
    redirect("/login");
  }

  if (!accountStatus.isVerified) {
    redirect("/portal");
  }

  const supabase = await createSupabaseServerClient();

  const { data: packages, error } = await supabase
    .from("software_packages")
    .select(
      "id, title, description, package_type, required_device_type, version"
    )
    .eq("is_active", true)
    .order("package_type", { ascending: true });

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-4xl font-black">Downloads</h1>

      <p className="mt-4 text-slate-400">
        Downloads are automatically filtered by your registered devices.
      </p>

      {error && <p className="mt-6 text-red-300">{error.message}</p>}

      <div className="mt-8 grid gap-4">
        {(packages || []).map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-2xl font-bold">{pkg.title}</h2>

            <p className="mt-2 text-slate-400">{pkg.description}</p>

            <p className="mt-3 text-sm text-slate-500">
              {pkg.package_type} · {pkg.required_device_type} · v{pkg.version}
            </p>

            <a
              href={`/api/downloads/${pkg.id}`}
              className="mt-5 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950"
            >
              Download
            </a>
          </div>
        ))}

        {(!packages || packages.length === 0) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            No downloads available. Register a verified device first.
          </div>
        )}
      </div>
    </main>
  );
}