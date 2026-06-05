import Link from "next/link";

const downloads = [
  {
    name: "Basecamp Software Installer",
    file: "MountainSafetyBasecamp_Setup_v1.0.0.exe",
    status: "Coming Soon",
  },
  {
    name: "Climber Device Firmware",
    file: "climber_node_v1.0.0.bin",
    status: "In Development",
  },
  {
    name: "Basecamp Node Firmware",
    file: "basecamp_node_v1.0.0.bin",
    status: "In Development",
  },
  {
    name: "Repeater Node Firmware",
    file: "repeater_node_v1.0.0.bin",
    status: "Planned",
  },
  {
    name: "Flutter Mobile App",
    file: "MountainSafetyClimber_v1.0.0.apk",
    status: "In Development",
  },
  {
    name: "Quick Start Guide",
    file: "Quick_Start_Guide.pdf",
    status: "Draft",
  },
];

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/portal" className="text-sm text-emerald-300 hover:text-emerald-200">
          ← Back to portal
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Download Center Prototype
          </p>
          <h1 className="mt-3 text-4xl font-bold">Software Packages</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            This mock download center shows how production users will receive
            the basecamp installer, mobile app, firmware packages, and setup
            documentation.
          </p>
        </div>

        <div className="mt-10 grid gap-4">
          {downloads.map((item) => (
            <div
              key={item.file}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{item.file}</p>
              </div>

              <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}