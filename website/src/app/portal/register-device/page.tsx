"use client";

import { FormEvent, useEffect, useState } from "react";
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

type RegisteredDevice = {
  id: string;
  serial_number: string;
  device_type: string;
  friendly_name: string | null;
  firmware_version: string | null;
  status: string;
  created_at: string;
};

const deviceTypes = [
  {
    type: "BASECAMP_NODE",
    label: "Basecamp ESP32 LoRa Node",
    example: "BASE-0001",
    purpose:
      "Connects to the basecamp laptop by USB serial and bridges LoRa communication to the local Flask dashboard.",
  },
  {
    type: "CLIMBER_DEVICE",
    label: "Climber ESP32 Device",
    example: "CLIMBER-0001",
    purpose:
      "Main climber unit with GPS, LoRa, Wi-Fi API, SOS handling, OLED status, and mobile app communication.",
  },
  {
    type: "ARMBAND_H2",
    label: "ESP32-H2 Armband",
    example: "ARM-0001",
    purpose:
      "Prototype wearable module prepared for MAX30102 heart-rate sensor integration.",
  },
  {
    type: "REPEATER_NODE",
    label: "LoRa Repeater Node",
    example: "REPEATER-0001",
    purpose:
      "Future range-extension node that forwards LoRa packets between climber devices and the basecamp node.",
  },
];

function getDeviceLabel(deviceType: string) {
  const device = deviceTypes.find((item) => item.type === deviceType);
  return device ? device.label : deviceType;
}

export default function RegisterDevicePage() {
  const supabase = createSupabaseBrowserClient();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [basecamps, setBasecamps] = useState<BasecampAccount[]>([]);
  const [selectedBasecampId, setSelectedBasecampId] = useState("");

  const [registeredDevices, setRegisteredDevices] = useState<RegisteredDevice[]>(
    []
  );

  const [serialNumber, setSerialNumber] = useState("");
  const [deviceType, setDeviceType] = useState(deviceTypes[1].type);
  const [friendlyName, setFriendlyName] = useState("");
  const [firmwareVersion, setFirmwareVersion] = useState("v1.0.0");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
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

    setRegisteredDevices(data ?? []);
  }

  async function handleBasecampChange(basecampAccountId: string) {
    setSelectedBasecampId(basecampAccountId);
    setSuccessMessage("");
    setErrorMessage("");

    if (basecampAccountId) {
      await loadDevices(basecampAccountId);
    } else {
      setRegisteredDevices([]);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedBasecampId || !serialNumber.trim() || !deviceType.trim()) {
      setErrorMessage(
        "Please select a basecamp, enter device serial, and select device type."
      );
      return;
    }

    setIsSubmitting(true);

    const selectedBasecamp = basecamps.find(
      (basecamp) => basecamp.id === selectedBasecampId
    );

    const { error } = await supabase.from("devices").insert({
      serial_number: serialNumber.trim().toUpperCase(),
      device_type: deviceType,
      friendly_name: friendlyName.trim() || null,
      basecamp_account_id: selectedBasecampId,
      firmware_version: firmwareVersion.trim() || null,
      status: "REGISTERED",
    });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setErrorMessage("This device serial number is already registered.");
      } else {
        setErrorMessage("Device could not be registered. Please try again.");
      }

      console.error("Device registration error:", error);
      return;
    }

    setSuccessMessage(
      `Device registered successfully under ${
        selectedBasecamp?.name ?? "selected basecamp"
      }.`
    );

    setSerialNumber("");
    setFriendlyName("");
    setFirmwareVersion("v1.0.0");

    await loadDevices(selectedBasecampId);
  }

  if (isCheckingAuth) {
    return (
      <PortalLayout
        title="Register Device"
        description="Checking portal authentication..."
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300 sm:p-6">
          Checking login status...
        </div>
      </PortalLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <PortalLayout
        title="Register Device"
        description="Login is required to register devices under a real basecamp account."
      >
        <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-5 sm:p-6">
          <h2 className="text-2xl font-bold">Login Required</h2>

          <p className="mt-3 leading-7 text-slate-300">
            Device registration is linked to real basecamp accounts. Please
            login or create a basecamp account before registering devices.
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
      title="Register Device"
      description="Register physical devices under your real basecamp account."
    >
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
        <h2 className="text-2xl font-bold">Real Basecamp Device Registration</h2>

        <p className="mt-3 leading-7 text-slate-300">
          Devices are linked to the logged-in user&apos;s basecamp account. This
          makes the portal closer to a real product workflow while keeping live
          climber tracking local at the basecamp.
        </p>
      </div>

      {basecamps.length === 0 && (
        <div className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-5 sm:p-6">
          <h2 className="text-2xl font-bold">No Basecamp Account Found</h2>

          <p className="mt-3 leading-7 text-slate-300">
            Your login exists, but no basecamp profile was found. Create a
            basecamp account first before registering devices.
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
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h2 className="text-2xl font-bold">Device Registration Form</h2>

            <p className="mt-2 text-sm text-slate-400">
              This form saves device records under your selected basecamp
              account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div>
                <label className="text-sm text-slate-300">
                  Basecamp Account
                </label>
                <select
                  value={selectedBasecampId}
                  onChange={(event) => handleBasecampChange(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                >
                  {basecamps.map((basecamp) => (
                    <option key={basecamp.id} value={basecamp.id}>
                      {basecamp.name} — {basecamp.basecamp_code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300">Device Serial</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(event) => setSerialNumber(event.target.value)}
                  placeholder="Example: CLIMBER-0002"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 uppercase text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Device Type</label>
                <select
                  value={deviceType}
                  onChange={(event) => setDeviceType(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                >
                  {deviceTypes.map((device) => (
                    <option key={device.type} value={device.type}>
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300">Friendly Name</label>
                <input
                  type="text"
                  value={friendlyName}
                  onChange={(event) => setFriendlyName(event.target.value)}
                  placeholder="Example: Guide 02 / Repeater Hill 01"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">
                  Firmware Version
                </label>
                <input
                  type="text"
                  value={firmwareVersion}
                  onChange={(event) => setFirmwareVersion(event.target.value)}
                  placeholder="Example: v1.0.0"
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
                {isSubmitting ? "Registering..." : "Register Device"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h2 className="text-2xl font-bold">Supported Device Types</h2>

            <div className="mt-5 grid gap-4">
              {deviceTypes.map((device) => (
                <div
                  key={device.example}
                  className="rounded-xl border border-white/10 bg-slate-950 p-4"
                >
                  <h3 className="font-semibold">{device.label}</h3>

                  <p className="mt-1 text-sm text-emerald-300">
                    Example ID: {device.example}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {device.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {basecamps.length > 0 && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-2xl font-bold">Registered Devices</h2>

          {isLoadingData && (
            <p className="mt-4 text-slate-300">Loading devices...</p>
          )}

          {!isLoadingData && registeredDevices.length === 0 && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5">
              <p className="text-slate-300">
                No devices registered under this basecamp yet.
              </p>
            </div>
          )}

          {!isLoadingData && registeredDevices.length > 0 && (
            <>
              {/* Mobile card layout */}
              <div className="mt-5 grid gap-4 md:hidden">
                {registeredDevices.map((device) => (
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
                <div className="grid grid-cols-4 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-300">
                  <p>Device Serial</p>
                  <p>Type</p>
                  <p>Friendly Name</p>
                  <p>Status</p>
                </div>

                {registeredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="grid grid-cols-4 border-t border-white/10 px-4 py-3 text-sm"
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

                    <p className="text-slate-300">{device.status}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </PortalLayout>
  );
}