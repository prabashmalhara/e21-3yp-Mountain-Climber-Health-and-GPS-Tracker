import PortalLayout from "@/components/PortalLayout";

const stats = [
  { label: "Basecamp ID", value: "BC-DEMO-001" },
  { label: "Registered Devices", value: "4" },
  { label: "Current Stage", value: "Prototype" },
  { label: "Next Upgrade", value: "Repeater Node" },
];

const modules = [
  "Climber ESP32 firmware",
  "Basecamp ESP32 LoRa firmware",
  "Armband ESP32-H2 firmware",
  "Flutter mobile app",
  "Local Flask basecamp dashboard",
  "Future LoRa repeater firmware",
];

export default function PortalDashboard() {
  return (
    <PortalLayout
      title="Basecamp Dashboard"
      description="This page shows how a registered basecamp user will later see package status, assigned devices, and setup progress."
    >
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold">{stat.value}</p>
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

      <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
        <h2 className="text-2xl font-bold">Important Note</h2>
        <p className="mt-3 leading-7 text-slate-300">
          This online portal is not the live rescue dashboard yet. The actual
          field monitoring dashboard is the local Flask basecamp dashboard
          connected to the basecamp ESP32 through USB serial.
        </p>
      </div>
    </PortalLayout>
  );
}