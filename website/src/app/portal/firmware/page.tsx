import PortalLayout from "@/components/PortalLayout";

const firmwarePackages = [
  {
    name: "Climber Main Firmware",
    file: "climber_main_firmware_v1.0.0.bin",
    device: "Climber ESP32 Device",
    status: "In Development",
    description:
      "Firmware for the main climber device. Handles GPS, LoRa, Wi-Fi API, SOS, OLED status, mobile app communication, and battery state.",
  },
  {
    name: "Basecamp LoRa Firmware",
    file: "basecamp_lora_firmware_v1.0.0.bin",
    device: "Basecamp ESP32 LoRa Node",
    status: "In Development",
    description:
      "Firmware for the basecamp LoRa gateway. It receives LoRa packets from climbers and bridges communication to the local Flask dashboard through USB serial.",
  },
  {
    name: "Armband ESP32-H2 Firmware",
    file: "armband_h2_firmware_v1.0.0.bin",
    device: "ESP32-H2 Armband",
    status: "Prototype Module",
    description:
      "Firmware for the wearable armband module. It supports BLE-based BPM, armband battery, and sensor state advertisement.",
  },
  {
    name: "Repeater Node Firmware",
    file: "repeater_node_firmware_v1.0.0.bin",
    device: "LoRa Repeater Node",
    status: "Next Development Stage",
    description:
      "Future firmware for the repeater node. It will forward LoRa packets between climber devices and the basecamp node to improve range.",
  },
];

const updaterSteps = [
  "Download MountainSafety Firmware Updater",
  "Connect ESP32 device to laptop using USB",
  "Select device type",
  "Select firmware version",
  "Click Flash Firmware",
  "Wait for verification",
  "Restart device and confirm status",
];

export default function FirmwarePage() {
  return (
    <PortalLayout
      title="Firmware Updater"
      description="This page shows how production users will update ESP32 firmware using a simple updater instead of Arduino IDE or source code."
    >
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
        <h2 className="text-2xl font-bold">Production Firmware Goal</h2>
        <p className="mt-3 leading-7 text-slate-300">
          In production, users should not open Arduino IDE, install board
          libraries, or edit source code. They should connect the device by USB,
          select the correct firmware package, and flash it using a simple
          MountainSafety Firmware Updater application.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Firmware Updater Workflow</h2>

          <div className="mt-5 grid gap-3">
            {updaterSteps.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-xl border border-white/10 bg-slate-950 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400 font-bold text-slate-950">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Demo Updater Panel</h2>
          <p className="mt-2 text-sm text-slate-400">
            This is UI only. Real flashing will be implemented later using a
            firmware updater tool.
          </p>

          <form className="mt-6 grid gap-4">
            <div>
              <label className="text-sm text-slate-300">Device Type</label>
              <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400">
                <option>Climber ESP32 Device</option>
                <option>Basecamp ESP32 LoRa Node</option>
                <option>ESP32-H2 Armband</option>
                <option>LoRa Repeater Node</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">USB Port</label>
              <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400">
                <option>Auto Detect</option>
                <option>COM30</option>
                <option>/dev/tty.usbserial</option>
                <option>/dev/tty.SLAB_USBtoUART</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">Firmware Version</label>
              <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400">
                <option>v1.0.0 - Production Package</option>
                <option>v0.3 - Repeater Prototype</option>
                <option>v0.2 - Current LoRa System</option>
              </select>
            </div>

            <button
              type="button"
              className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Flash Firmware
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {firmwarePackages.map((firmware) => (
          <div
            key={firmware.file}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-bold">{firmware.name}</h2>
                <p className="mt-1 text-sm text-emerald-300">
                  {firmware.device}
                </p>
                <p className="mt-1 text-sm text-slate-400">{firmware.file}</p>
              </div>

              <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
                {firmware.status}
              </span>
            </div>

            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
              {firmware.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Future Tool Implementation</h2>
        <p className="mt-3 leading-7 text-slate-300">
          The real firmware updater can later be built as a small desktop tool.
          It can use ESP32 flashing tools internally, but the user interface
          should stay simple: choose device type, choose port, choose firmware,
          and click flash.
        </p>
      </div>
    </PortalLayout>
  );
}