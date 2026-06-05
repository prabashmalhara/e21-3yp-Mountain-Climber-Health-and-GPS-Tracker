"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { supabase } from "@/lib/supabaseClient";

type DashboardSummary = {
  registered_devices: number;
  support_tickets: number;
  software_packages: number;
  firmware_versions: number;
  release_notes: number;
};

const modules = [
  "Climber ESP32 firmware",
  "Basecamp ESP32 LoRa firmware",
  "Armband ESP32-H2 firmware",
  "Flutter mobile app",
  "Local Flask basecamp dashboard",
  "Future LoRa repeater firmware",
];

export default function PortalDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboardSummary() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase.rpc(
        "get_portal_dashboard_summary"
      );

      setIsLoading(false);

      if (error) {
        console.error("Dashboard summary load error:", error);
        setErrorMessage("Could not load dashboard summary from Supabase.");
        return;
      }

      setSummary(data as DashboardSummary);
    }

    loadDashboardSummary();
  }, []);

  const stats = [
    {
      label: "Registered Devices",
      value: summary ? String(summary.registered_devices) : "-",
    },
    {
      label: "Support Tickets",
      value: summary ? String(summary.support_tickets) : "-",
    },
    {
      label: "Software Packages",
      value: summary ? String(summary.software_packages) : "-",
    },
    {
      label: "Firmware Records",
      value: summary ? String(summary.firmware_versions) : "-",
    },
    {
      label: "Release Notes",
      value: summary ? String(summary.release_notes) : "-",
    },
    {
      label: "Current Stage",
      value: "Backend Prototype",
    },
  ];

  return (
    <PortalLayout
      title="Basecamp Dashboard"
      description="This portal dashboard shows backend summary records from Supabase. It is for customer/product management only; real climber tracking remains local at the basecamp."
    >
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
        <h2 className="text-2xl font-bold">Portal Backend Scope</h2>
        <p className="mt-3 leading-7 text-slate-300">
          This online portal manages contact messages, support requests, device
          registration, software package records, firmware version records, and
          release notes. It does not perform cloud-based climber tracking.
        </p>
      </div>

      {isLoading && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          Loading dashboard summary...
        </div>
      )}

      {errorMessage && (
        <div className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6 text-orange-300">
          {errorMessage}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Current Software/Firmware Stack</h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {modules.map((module) => (
            <div
              key={module}
              className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300"
            >
              {module}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Local Field System Reminder</h2>
        <p className="mt-3 leading-7 text-slate-300">
          The real field operation remains offline-first: climber ESP32 devices
          communicate through LoRa to the basecamp ESP32 node, which connects to
          the local Flask dashboard through USB serial. This online portal is
          only for product support, records, and package management.
        </p>
      </div>
    </PortalLayout>
  );
}