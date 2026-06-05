import Link from "next/link";

const stats = [
  {
    label: "Basecamp ID",
    value: "BC-DEMO-001",
  },
  {
    label: "Assigned Devices",
    value: "3",
  },
  {
    label: "Software Status",
    value: "Prototype",
  },
  {
    label: "Next Upgrade",
    value: "Repeater Node",
  },
];

export default function PortalDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/portal" className="text-sm text-emerald-300 hover:text-emerald-200">
          ← Back to portal
        </Link>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Demo Basecamp
          </p>
          <h1 className="mt-3 text-4xl font-bold">Portal Dashboard</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            This page shows how a registered basecamp user will see system
            information after logging in. Real authentication and database
            connection will be added later.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-2 text-xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Current Product Scope</h2>
          <ul className="mt-5 grid gap-3 text-slate-300 md:grid-cols-2">
            <li>• GPS-based climber location tracking</li>
            <li>• LoRa communication</li>
            <li>• SOS emergency alert</li>
            <li>• Two-way short messaging</li>
            <li>• Basecamp local dashboard</li>
            <li>• Flutter mobile companion app</li>
            <li>• Battery monitoring support</li>
            <li>• Repeater node development next</li>
          </ul>
        </div>
      </div>
    </main>
  );
}