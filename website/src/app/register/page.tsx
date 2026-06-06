"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function makeBasecampCode(name: string) {
  const cleaned = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 16);

  const random = Math.floor(1000 + Math.random() * 9000);

  return `BC-${cleaned || "BASECAMP"}-${random}`;
}

export default function RegisterPage() {
  const supabase = createSupabaseBrowserClient();

  const [fullName, setFullName] = useState("");
  const [basecampName, setBasecampName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!fullName.trim() || !basecampName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please fill full name, basecamp name, email, and password.");
      return;
    }

    setIsSubmitting(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (signUpError) {
      setIsSubmitting(false);
      setErrorMessage(signUpError.message);
      return;
    }

    const userId = signUpData.user?.id;

    if (!userId) {
      setIsSubmitting(false);
      setSuccessMessage(
        "Account created. Please check your email to confirm your account, then login."
      );
      return;
    }

    const { error: basecampError } = await supabase.from("basecamp_accounts").insert({
      owner_user_id: userId,
      basecamp_code: makeBasecampCode(basecampName),
      name: basecampName.trim(),
      location: location.trim() || null,
      contact_email: email.trim(),
      status: "ACTIVE",
    });

    setIsSubmitting(false);

    if (basecampError) {
      console.error("Basecamp account create error:", basecampError);
      setErrorMessage(
        "Account was created, but basecamp profile could not be saved. Please login and try again later."
      );
      return;
    }

    setSuccessMessage("Basecamp account created successfully. You can now login.");

    setFullName("");
    setBasecampName("");
    setLocation("");
    setEmail("");
    setPassword("");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Basecamp Registration
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              Create a basecamp portal account.
            </h1>

            <p className="mt-6 leading-8 text-slate-300">
              Register a basecamp account to manage device serial numbers,
              support tickets, firmware records, and software package access.
              This portal does not perform cloud tracking of climbers.
            </p>

            <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
              <h2 className="text-xl font-bold">Local field operation</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The real tracking path stays local: climber ESP32 → LoRa →
                basecamp ESP32 → USB serial → Flask dashboard.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Create Account</h2>

            <form onSubmit={handleRegister} className="mt-6 grid gap-4">
              <div>
                <label className="text-sm text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Basecamp Name</label>
                <input
                  type="text"
                  value={basecampName}
                  onChange={(event) => setBasecampName(event.target.value)}
                  placeholder="Example: Ella Rescue Camp"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Example: Ella, Sri Lanka"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Use at least 6 characters for Supabase Auth.
                </p>
              </div>

              {successMessage && (
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-sm text-orange-300">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create Basecamp Account"}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-300">
                Login
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}