"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const body = {
      full_name: formData.get("full_name"),
      organization_name: formData.get("organization_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      expected_device_count: formData.get("expected_device_count"),
      reason: formData.get("reason"),
    };

    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Access request failed.");
      }

      setSuccess(true);
      setMessage(data.message);
      form.reset();
    } catch (error) {
      setSuccess(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
        Verified basecamp owner registration
      </p>

      <h1 className="mt-3 text-4xl font-black">Request Basecamp Owner Access</h1>

      <p className="mt-4 text-slate-400">
        This form does not create a login account immediately. The project team
        reviews your request first. If approved, you will receive an invitation
        email to set your password.
      </p>

      <form onSubmit={submitRequest} className="mt-8 space-y-4">
        <input name="full_name" required placeholder="Full name" className="w-full rounded-xl border border-white/15 px-4 py-3" />
        <input name="organization_name" placeholder="Organization / basecamp name" className="w-full rounded-xl border border-white/15 px-4 py-3" />
        <input name="email" type="email" required placeholder="Email address" className="w-full rounded-xl border border-white/15 px-4 py-3" />
        <input name="phone" placeholder="Phone number" className="w-full rounded-xl border border-white/15 px-4 py-3" />
        <input name="location" placeholder="Basecamp location" className="w-full rounded-xl border border-white/15 px-4 py-3" />
        <input name="expected_device_count" type="number" min="1" defaultValue="1" placeholder="Expected number of devices" className="w-full rounded-xl border border-white/15 px-4 py-3" />
        <textarea name="reason" required placeholder="Why do you need access?" className="min-h-32 w-full rounded-xl border border-white/15 px-4 py-3" />

        <button disabled={loading} className="rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Access Request"}
        </button>
      </form>

      {message && (
        <div className={`mt-6 rounded-xl border px-4 py-3 ${success ? "border-emerald-400 text-emerald-300" : "border-red-400 text-red-300"}`}>
          {message}
        </div>
      )}
    </main>
  );
}