import PortalLayout from "@/components/PortalLayout";

const devices = [
  {
    id: "BASE-0001",
    type: "Basecamp ESP32 LoRa Node",
    role: "LoRa to USB serial gateway",
    status: "In Development",
  },
  {
    id: "CLIMBER-0001",
    type: "Climber ESP32 Device",
    role: "GPS, LoRa, Wi-Fi API, SOS, OLED",
    status: "In Development",
  },
  {
    id: "ARM-0001",
    type: "ESP32-H2 Armband",
    role: "BLE BPM and battery data",
    status: "Prototype Module",
  },
  {
    id: "REPEATER-0001",
    type: "LoRa Repeater Node",
    role: "Extends climber to basecamp LoRa range",
    status: "Next Development Stage",
  },
];

export default function DevicesPage() {
  return (
    <PortalLayout
      title="Registered Devices"
      description="In production, each physical device will have a unique ID and will be assigned to a basecamp customer account."
    >
      <div className="grid gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-bold">{device.id}</h2>
                <p className="mt-1 text-slate-300">{device.type}</p>
                <p className="mt-2 text-sm text-slate-400">{device.role}</p>
              </div>

              <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
                {device.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}