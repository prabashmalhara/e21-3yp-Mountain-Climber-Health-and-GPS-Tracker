"use client";

import { FormEvent, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { supabase } from "@/lib/supabaseClient";

const supportCategories = [
  "Basecamp software installation",
  "COM port / USB serial connection",
  "Climber ESP32 firmware issue",
  "LoRa communication problem",
  "Flutter mobile app connection",
  "Armband BLE detection",
  "Repeater node setup",
];

export default function SupportPage() {
  const [basecampId, setBasecampId] = useState("BC-DEMO-001");
  const [issueType, setIssueType] = useState(supportCategories[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!basecampId.trim() || !issueType.trim() || !title.trim() || !description.trim()) {
      setErrorMessage("Please fill all fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("support_tickets").insert({
      issue_type: issueType.trim(),
      title: title.trim(),
      description: `Basecamp ID: ${basecampId.trim()}\n\n${description.trim()}`,
      status: "OPEN",
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("Support request could not be submitted. Please try again.");
      console.error("Support form error:", error);
      return;
    }

    setSuccessMessage("Support request submitted successfully.");
    setTitle("");
    setDescription("");
  }

  return (
    <PortalLayout
      title="Support"
      description="This support page helps basecamp users report setup issues, firmware problems, device faults, and deployment questions."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Support Categories</h2>

          <div className="mt-5 grid gap-3">
            {supportCategories.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
            <h3 className="text-xl font-bold">Support Scope</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This portal support system is for product setup, software packages,
              firmware versions, device registration, and customer support. Live
              climber tracking and SOS monitoring remain local at the basecamp.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Support Request Form</h2>
          <p className="mt-2 text-sm text-slate-400">
            Submit a support request related to setup, firmware, app connection,
            LoRa communication, or device registration.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div>
              <label className="text-sm text-slate-300">Basecamp ID</label>
              <input
                type="text"
                value={basecampId}
                onChange={(event) => setBasecampId(event.target.value)}
                placeholder="Example: BC-DEMO-001"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Issue Type</label>
              <select
                value={issueType}
                onChange={(event) => setIssueType(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              >
                {supportCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">Issue Title</label>
              <input
                type="text"
                placeholder="Example: Basecamp node not detected on USB"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Description</label>
              <textarea
                rows={5}
                placeholder="Describe the issue clearly"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
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
              {isSubmitting ? "Submitting..." : "Submit Support Request"}
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}