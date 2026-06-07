"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type BasecampAccount = {
  id: string;
  basecamp_code: string;
  name: string;
  location: string | null;
  contact_email: string;
  status: string;
};

type Device = {
  id: string;
  serial_number: string;
  device_type: string;
  friendly_name: string | null;
  firmware_version: string | null;
  status: string;
  created_at: string;
};

const deviceTypes = [
  { type: "BASECAMP_NODE", label: "Basecamp ESP32 LoRa Node" },
  { type: "CLIMBER_DEVICE", label: "Climber ESP32 Device" },
  { type: "ARMBAND_H2", label: "ESP32-H2 Armband" },
  { type: "REPEATER_NODE", label: "LoRa Repeater Node" },
];

function getDeviceLabel(deviceType: string) {
  const device = deviceTypes.find((item) => item.type === deviceType);
  return device ? device.label : deviceType;
}

export default function DevicesPage() {
  const supabase = createSupabaseBrowserClient();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [basecamps, setBasecamps] = useState<BasecampAccount[]>([]);
  const [selectedBasecampId, setSelectedBasecampId] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUserData() {
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
        .select("*")
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

      const firstBasecampId = loadedBasecamps[0]?.id ?? "";
      setSelectedBasecampId(firstBasecampId);

      if (firstBasecampId) {
        await loadDevices(firstBasecampId);
      } else {
        setIsLoadingData(false);
      }

      setIsCheckingAuth(false);
    }

    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDevices(basecampAccountId: string) {
    setIsLoadingData(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("basecamp_account_id", basecampAccountId)
      .order("created_at", { ascending: false });

    setIsLoadingData(false);

    if (error) {
      console.error("Device load error:", error);
      setErrorMessage("Could not load registered devices.");
      return;
    }

    setDevices(data ?? []);
  }

  async function handleBasecampChange(basecampAccountId: string) {
    setSelectedBasecampId(basecampAccountId);
    setErrorMessage("");

    if (basecampAccountId) {
      await loadDevices(basecampAccountId);
    } else {
      setDevices([]);
    }
  }

  if (isCheckingAuth) {
    return (
      <PortalLayout
        title="Devices"
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
        title="Devices"
        description="Login is required to view registered devices."
      >
        <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6">
          <h2 className="text-2xl font-bold">Login Required</h2>

          <p className="mt-3 leading-7 text-slate-300">
            Devices are linked to real basecamp accounts. Please login or create
            a basecamp account to view registered devices.
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

  return (
    <PortalLayout
      title="Devices"
      description="View registered devices linked to your authenticated basecamp account."
    >
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
        <h2 className="text-2xl font-bold">Registered Device Management</h2>

        <p className="mt-3 leading-7 text-slate-300">
          This page reads registered devices from Supabase and shows only devices
          linked to your own basecamp account. Real climber tracking still runs
          locally at the basecamp through LoRa and the Flask dashboard.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-5 text-orange-300 sm:p-6">
          {errorMessage}
        </div>
      )}

      {basecamps.length === 0 && (
        <div className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-5 sm:p-6">
          <h2 className="text-2xl font-bold">No Basecamp Account Found</h2>

          <p className="mt-3 leading-7 text-slate-300">
            Your login exists, but no basecamp profile was found. Create a
            basecamp account before registering devices.
          </p>

          <Link
            href="/register"
            className="mt-5 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Create Basecamp Account
          </Link>
        </div>
      )}

      {basecamps.length > 0 && (
        <>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h2 className="text-2xl font-bold">Select Basecamp</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Choose which basecamp account to view devices for.
                </p>
              </div>

              <Link
                href="/portal/register-device"
                className="w-full rounded-xl bg-emerald-400 px-5 py-3 text-center font-semibold text-slate-950 hover:bg-emerald-300 sm:w-fit"
              >
                Register New Device
              </Link>
            </div>

            <select
              value={selectedBasecampId}
              onChange={(event) => handleBasecampChange(event.target.value)}
              className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            >
              {basecamps.map((basecamp) => (
                <option key={basecamp.id} value={basecamp.id}>
                  {basecamp.name} — {basecamp.basecamp_code}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deviceTypes.map((deviceType) => {
              const count = devices.filter(
                (device) => device.device_type === deviceType.type
              ).length;

              return (
                <div
                  key={deviceType.type}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-sm text-slate-400">{deviceType.label}</p>
                  <p className="mt-2 text-3xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h2 className="text-2xl font-bold">Registered Devices</h2>

            {isLoadingData && (
              <p className="mt-4 text-slate-300">
                Loading registered devices...
              </p>
            )}

            {!isLoadingData && devices.length === 0 && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5">
                <p className="text-slate-300">
                  No devices registered under this basecamp yet.
                </p>

                <Link
                  href="/portal/register-device"
                  className="mt-5 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
                >
                  Register First Device
                </Link>
              </div>
            )}

            {!isLoadingData && devices.length > 0 && (
              <>
                {/* Mobile card layout */}
                <div className="mt-5 grid gap-4 md:hidden">
                  {devices.map((device) => (
                    <div
                      key={device.id}
                      className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-slate-500">
                            Device Serial
                          </p>
                          <h3 className="mt-1 break-words text-lg font-bold">
                            {device.serial_number}
                          </h3>
                        </div>

                        <span className="shrink-0 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                          {device.status}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-slate-500">Type</p>
                          <p className="mt-1 text-slate-200">
                            {getDeviceLabel(device.device_type)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-slate-500">Friendly Name</p>
                          <p className="mt-1 text-slate-200">
                            {device.friendly_name ?? "-"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-slate-500">Firmware</p>
                          <p className="mt-1 text-slate-200">
                            {device.firmware_version ?? "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table layout */}
                <div className="mt-5 hidden overflow-hidden rounded-xl border border-white/10 md:block">
                  <div className="grid grid-cols-5 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-300">
                    <p>Serial</p>
                    <p>Type</p>
                    <p>Friendly Name</p>
                    <p>Firmware</p>
                    <p>Status</p>
                  </div>

                  {devices.map((device) => (
                    <div
                      key={device.id}
                      className="grid grid-cols-5 border-t border-white/10 px-4 py-3 text-sm"
                    >
                      <p className="break-words font-semibold">
                        {device.serial_number}
                      </p>
                      <p className="text-slate-300">
                        {getDeviceLabel(device.device_type)}
                      </p>
                      <p className="text-slate-300">
                        {device.friendly_name ?? "-"}
                      </p>
                      <p className="text-slate-300">
                        {device.firmware_version ?? "-"}
                      </p>
                      <p className="text-slate-300">{device.status}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </PortalLayout>
  );
}