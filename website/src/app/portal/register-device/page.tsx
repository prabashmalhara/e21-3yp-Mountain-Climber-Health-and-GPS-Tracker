import PortalLayout from "@/components/PortalLayout";

const deviceTypes = [
  {
    type: "Basecamp ESP32 LoRa Node",
    example: "BASE-0001",
    purpose:
      "Connects to the basecamp laptop by USB serial and bridges LoRa communication to the local Flask dashboard.",
  },
  {
    type: "Climber ESP32 Device",
    example: "CLIMBER-0001",
    purpose:
      "Main climber unit with GPS, LoRa, Wi-Fi API, SOS handling, OLED status, and mobile app communication.",
  },
  {
    type: "ESP32-H2 Armband",
    example: "ARM-0001",
    purpose:
      "Prototype wearable module that provides BLE-based BPM, sensor state, and armband battery data.",
  },
  {
    type: "LoRa Repeater Node",
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
  return (
    <PortalLayout
      title="Register Device"
      description="This prototype page shows how a basecamp user will later register physical devices using serial numbers or kit IDs."
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
          <h2 className="text-2xl font-bold">Demo Registration Form</h2>
          <p className="mt-2 text-sm text-slate-400">
            This is UI only. Real database saving and account assignment will be
            added later.
          </p>

          <form className="mt-6 grid gap-4">
            <div>
              <label className="text-sm text-slate-300">Basecamp ID</label>
              <input
                type="text"
                defaultValue="BC-DEMO-001"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Device Serial</label>
              <input
                type="text"
                placeholder="Example: CLIMBER-0002"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
            </div>

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
              <label className="text-sm text-slate-300">Friendly Name</label>
              <input
                type="text"
                placeholder="Example: Guide 01 / Basecamp Gateway / Repeater Hill 01"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="button"
              className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Register Device
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
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <h3 className="font-semibold">{device.type}</h3>
                    <p className="mt-1 text-sm text-emerald-300">
                      Example ID: {device.example}
                    </p>
                  </div>
                </div>

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