"use client";

import { FormEvent, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { supabase } from "@/lib/supabaseClient";

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
      "Prototype wearable module that provides BLE-based BPM, sensor state, and armband battery data.",
  },
  {
    type: "REPEATER_NODE",
    label: "LoRa Repeater Node",
    example: "REPEATER-0001",
    purpose:
      "Future range-extension node that forwards LoRa packets between climber devices and the basecamp node.",
  },
];

const registeredExample = [
  {
    id: "BASE-0001",
    type: "Basecamp ESP32 LoRa Node",
    assignedTo: "BC-DEMO-001",
    status: "Registered",
  },
  {
    id: "CLIMBER-0001",
    type: "Climber ESP32 Device",
    assignedTo: "BC-DEMO-001",
    status: "Registered",
  },
  {
    id: "ARM-0001",
    type: "ESP32-H2 Armband",
    assignedTo: "BC-DEMO-001",
    status: "Prototype Module",
  },
];

export default function RegisterDevicePage() {
  const [basecampId, setBasecampId] = useState("BC-DEMO-001");
  const [serialNumber, setSerialNumber] = useState("");
  const [deviceType, setDeviceType] = useState(deviceTypes[1].type);
  const [friendlyName, setFriendlyName] = useState("");
  const [firmwareVersion, setFirmwareVersion] = useState("v1.0.0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!basecampId.trim() || !serialNumber.trim() || !deviceType.trim()) {
      setErrorMessage("Please fill Basecamp ID, Device Serial, and Device Type.");
      return;
    }

    setIsSubmitting(true);

    /*
      Current stage:
      We store the basecamp ID inside friendly_name text because the devices table
      has basecamp_id as a UUID foreign key. Later, when real basecamp accounts are
      added, we can select the real basecamp UUID and store it in basecamp_id.
    */
    const finalFriendlyName = friendlyName.trim()
      ? `${friendlyName.trim()} | Basecamp: ${basecampId.trim()}`
      : `Basecamp: ${basecampId.trim()}`;

    const { error } = await supabase.from("devices").insert({
      serial_number: serialNumber.trim().toUpperCase(),
      device_type: deviceType,
      friendly_name: finalFriendlyName,
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

    setSuccessMessage("Device registered successfully.");
    setSerialNumber("");
    setFriendlyName("");
    setFirmwareVersion("v1.0.0");
  }

  return (
    <PortalLayout
      title="Register Device"
      description="This prototype page shows how a basecamp user can register physical devices using serial numbers or kit IDs."
    >
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
        <h2 className="text-2xl font-bold">Why device registration matters</h2>
        <p className="mt-3 leading-7 text-slate-300">
          In production, each ESP32 firmware package and physical device should
          have a unique ID. This helps assign climber devices, basecamp LoRa
          gateways, armbands, and future repeater nodes to the correct basecamp
          account without manually changing source code.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Device Registration Form</h2>
          <p className="mt-2 text-sm text-slate-400">
            This form now saves records into the Supabase devices table.
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
              <p className="mt-2 text-xs text-slate-500">
                For now this is stored in the friendly name. Later we will link
                devices to real basecamp account IDs.
              </p>
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
                placeholder="Example: Guide 01 / Basecamp Gateway / Repeater Hill 01"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Firmware Version</label>
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

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
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

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Example Registered Devices</h2>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-4 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-300">
            <p>Device ID</p>
            <p>Type</p>
            <p>Assigned To</p>
            <p>Status</p>
          </div>

          {registeredExample.map((device) => (
            <div
              key={device.id}
              className="grid grid-cols-4 border-t border-white/10 px-4 py-3 text-sm"
            >
              <p className="font-semibold">{device.id}</p>
              <p className="text-slate-300">{device.type}</p>
              <p className="text-slate-300">{device.assignedTo}</p>
              <p className="text-slate-300">{device.status}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}