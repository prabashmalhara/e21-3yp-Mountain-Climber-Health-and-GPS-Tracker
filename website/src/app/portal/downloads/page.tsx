"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type BasecampAccount = {
  id: string;
  basecamp_code: string;
  name: string;
};

type Device = {
  id: string;
  device_type: string;
  serial_number: string;
};

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
  if (item.release_notes) return item.release_notes;

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

function getRequiredDeviceText(packageType: string) {
  if (packageType === "BASECAMP_SOFTWARE") return "Requires BASECAMP_NODE";
  if (packageType === "MOBILE_APP") return "Requires CLIMBER_DEVICE";
  if (packageType === "FIRMWARE_UPDATER") return "Requires any registered device";
  if (packageType === "DOCUMENTATION") return "Requires any registered device";
  return "Requires registered device";
}

function isPackageAllowed(packageType: string, deviceTypes: string[]) {
  if (packageType === "BASECAMP_SOFTWARE") {
    return deviceTypes.includes("BASECAMP_NODE");
  }

  if (packageType === "MOBILE_APP") {
    return deviceTypes.includes("CLIMBER_DEVICE");
  }

  if (packageType === "FIRMWARE_UPDATER") {
    return deviceTypes.length > 0;
  }

  if (packageType === "DOCUMENTATION") {
    return deviceTypes.length > 0;
  }

  return false;
}

export default function DownloadsPage() {
  const supabase = createSupabaseBrowserClient();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [basecamps, setBasecamps] = useState<BasecampAccount[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [packages, setPackages] = useState<SoftwarePackage[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDownloads() {
      setIsCheckingAuth(true);
      setIsLoadingData(true);
      setErrorMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        setIsLoadingData(false);
        return;
      }

      setIsAuthenticated(true);

      const { data: basecampData, error: basecampError } = await supabase
        .from("basecamp_accounts")
        .select("id, basecamp_code, name")
        .order("created_at", { ascending: true });

      if (basecampError) {
        console.error("Basecamp load error:", basecampError);
        setErrorMessage("Could not load your basecamp accounts.");
        setIsCheckingAuth(false);
        setIsLoadingData(false);
        return;
      }

      const loadedBasecamps = basecampData ?? [];
      setBasecamps(loadedBasecamps);

      const basecampIds = loadedBasecamps.map((basecamp) => basecamp.id);

      let loadedDevices: Device[] = [];

      if (basecampIds.length > 0) {
        const { data: deviceData, error: deviceError } = await supabase
          .from("devices")
          .select("id, device_type, serial_number")
          .in("basecamp_account_id", basecampIds);

        if (deviceError) {
          console.error("Device load error:", deviceError);
          setErrorMessage("Could not load your registered devices.");
          setIsCheckingAuth(false);
          setIsLoadingData(false);
          return;
        }

        loadedDevices = deviceData ?? [];
      }

      setDevices(loadedDevices);

      const { data: packageData, error: packageError } = await supabase
        .from("software_packages")
        .select("*")
        .order("created_at", { ascending: true });

      if (packageError) {
        console.error("Software package load error:", packageError);
        setErrorMessage("Could not load software package records.");
        setIsCheckingAuth(false);
        setIsLoadingData(false);
        return;
      }

      setPackages(packageData ?? []);

      setIsCheckingAuth(false);
      setIsLoadingData(false);
    }

    loadDownloads();
  }, [supabase]);

  if (isCheckingAuth) {
    return (
      <PortalLayout
        title="Software and Firmware Packages"
        description="Checking portal authentication..."
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          Checking login status...
        </div>
      </PortalLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <PortalLayout
        title="Software and Firmware Packages"
        description="Login is required to view software package downloads."
      >
        <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6">
          <h2 className="text-2xl font-bold">Login Required</h2>
          <p className="mt-3 leading-7 text-slate-300">
            Downloads are now linked to registered basecamp devices. Please login
            or create a basecamp account before accessing software packages.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-xl bg-emerald-400 px-5 py-3 text-center font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold text-white hover:bg-white/10"
            >
              Create Basecamp Account
            </Link>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const registeredDeviceTypes = Array.from(
    new Set(devices.map((device) => device.device_type))
  );

  const allowedPackages = packages.filter((item) =>
    isPackageAllowed(item.package_type, registeredDeviceTypes)
  );

  const lockedPackages = packages.filter(
    (item) => !isPackageAllowed(item.package_type, registeredDeviceTypes)
  );

  return (
    <PortalLayout
      title="Software and Firmware Packages"
      description="Downloads are unlocked based on the physical devices registered under your basecamp account."
    >
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
        <h2 className="text-2xl font-bold">Device-Based Download Access</h2>
        <p className="mt-3 leading-7 text-slate-300">
          The portal now checks your registered devices before showing software
          packages. This keeps the download center closer to a real product
          workflow while live climber tracking remains local at the basecamp.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6 text-orange-300">
          {errorMessage}
        </div>
      )}

      {basecamps.length === 0 && (
        <div className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6">
          <h2 className="text-2xl font-bold">No Basecamp Account Found</h2>
          <p className="mt-3 leading-7 text-slate-300">
            Your login exists, but no basecamp account is connected yet. Create a
            basecamp account first.
          </p>

          <Link
            href="/register"
            className="mt-5 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Create Basecamp Account
          </Link>
        </div>
      )}

      {basecamps.length > 0 && devices.length === 0 && (
        <div className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6">
          <h2 className="text-2xl font-bold">Register a Device First</h2>
          <p className="mt-3 leading-7 text-slate-300">
            Downloads are unlocked after you register at least one physical
            device under your basecamp account.
          </p>

          <Link
            href="/portal/register-device"
            className="mt-5 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Register Device
          </Link>
        </div>
      )}

      {devices.length > 0 && (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Registered Devices</p>
              <p className="mt-2 text-3xl font-bold">{devices.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Unlocked Packages</p>
              <p className="mt-2 text-3xl font-bold">{allowedPackages.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Locked Packages</p>
              <p className="mt-2 text-3xl font-bold">{lockedPackages.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Device Types</p>
              <p className="mt-2 text-xl font-bold">
                {registeredDeviceTypes.join(", ")}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Unlocked Downloads</h2>
            <p className="mt-2 text-sm text-slate-400">
              These records are available because matching devices are registered
              under your basecamp account.
            </p>

            {isLoadingData && (
              <p className="mt-5 text-slate-300">Loading package records...</p>
            )}

            {!isLoadingData && allowedPackages.length === 0 && (
              <p className="mt-5 text-slate-300">
                No unlocked package records found.
              </p>
            )}

            {!isLoadingData && allowedPackages.length > 0 && (
              <div className="mt-6 grid gap-4">
                {allowedPackages.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {item.file_name}
                        </p>
                        <p className="mt-1 text-xs text-emerald-300">
                          {item.package_type} • {item.version}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
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
          </div>

          {lockedPackages.length > 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-bold">Locked Downloads</h2>
              <p className="mt-2 text-sm text-slate-400">
                Register the matching device type to unlock these package
                records.
              </p>

              <div className="mt-6 grid gap-4">
                {lockedPackages.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-5 opacity-70"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {item.file_name}
                        </p>
                        <p className="mt-1 text-xs text-orange-300">
                          {getRequiredDeviceText(item.package_type)}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-orange-400/10 px-4 py-2 text-sm text-orange-300">
                        Locked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PortalLayout>
  );
}