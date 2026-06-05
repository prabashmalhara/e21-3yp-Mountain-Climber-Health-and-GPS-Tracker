import Link from "next/link";

const devices = [
  {
    id: "BASE-0001",
    type: "Basecamp LoRa Node",
    status: "Prototype",
    version: "v0.2",
  },
  {
    id: "CLIMBER-0001",
    type: "Climber Tracking Device",
    status: "In Development",
    version: "v0.2",
  },
  {
    id: "REPEATER-0001",
    type: "LoRa Repeater Node",
    status: "Next Development Stage",
    version: "Planned",
  },
];

export default function DevicesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/portal" className="text-sm text-emerald-300 hover:text-emerald-200">
          ← Back to portal
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Device Management Prototype
          </p>
          <h1 className="mt-3 text-4xl font-bold">Registered Devices</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            In production, every physical device will have a unique ID and will
            be assigned to a basecamp account.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-4 bg-white/10 px-5 py-4 text-sm font-semibold text-slate-300">
            <p>Device ID</p>
            <p>Type</p>
            <p>Status</p>
            <p>Version</p>
          </div>

          {devices.map((device) => (
            <div
              key={device.id}
              className="grid grid-cols-4 border-t border-white/10 px-5 py-4 text-sm"
            >
              <p className="font-semibold">{device.id}</p>
              <p className="text-slate-300">{device.type}</p>
              <p className="text-slate-300">{device.status}</p>
              <p className="text-slate-300">{device.version}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}