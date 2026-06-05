"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { supabase } from "@/lib/supabaseClient";

type SoftwarePackage = {
  id: string;
  name: string;
  version: string;
  file_name: string;
  package_type: string;
  status: string;
  release_notes: string | null;
  created_at: string;
};

function getPackageDescription(item: SoftwarePackage) {
  if (item.release_notes) {
    return item.release_notes;
  }

  if (item.package_type === "BASECAMP_SOFTWARE") {
    return "Packaged version of the local Flask basecamp dashboard.";
  }

  if (item.package_type === "MOBILE_APP") {
    return "Android APK for the climber-side Flutter mobile app.";
  }

  if (item.package_type === "FIRMWARE_UPDATER") {
    return "Desktop tool for flashing ESP32 firmware packages.";
  }

  if (item.package_type === "DOCUMENTATION") {
    return "Setup or troubleshooting document for basecamp users.";
  }

  return "Software package record.";
}

export default function DownloadsPage() {
  const [packages, setPackages] = useState<SoftwarePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPackages() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("software_packages")
        .select("*")
        .order("created_at", { ascending: true });

      setIsLoading(false);

      if (error) {
        console.error("Software packages load error:", error);
        setErrorMessage("Could not load software package records.");
        return;
      }

      setPackages(data ?? []);
    }

    loadPackages();
  }, []);

  return (
    <PortalLayout
      title="Software and Firmware Packages"
      description="This download center reads software package records from Supabase. Real protected file downloads can be added later after the firmware and installers become stable."
    >
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
        <h2 className="text-2xl font-bold">Download Center Scope</h2>
        <p className="mt-3 leading-7 text-slate-300">
          The portal stores product package records such as the basecamp
          installer, mobile app APK, firmware updater, and documentation. It does
          not perform live climber tracking. Field monitoring remains local at
          the basecamp dashboard.
        </p>
      </div>

      {isLoading && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          Loading software package records...
        </div>
      )}

      {errorMessage && (
        <div className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6 text-orange-300">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && packages.length === 0 && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          No software package records found yet.
        </div>
      )}

      {!isLoading && !errorMessage && packages.length > 0 && (
        <div className="mt-8 grid gap-4">
          {packages.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.file_name}
                  </p>
                  <p className="mt-1 text-xs text-emerald-300">
                    {item.package_type} • {item.version}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {item.status}
                </span>
              </div>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
                {getPackageDescription(item)}
              </p>

              <button
                type="button"
                disabled
                className="mt-5 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-400"
              >
                Download unavailable in prototype
              </button>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}