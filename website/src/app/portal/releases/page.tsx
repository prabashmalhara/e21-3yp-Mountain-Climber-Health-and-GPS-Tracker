import PortalLayout from "@/components/PortalLayout";

const releases = [
  {
    version: "v0.2-current-lora-system",
    date: "Current Development Stage",
    type: "Stable Prototype Tag",
    status: "Recommended Backup",
    summary:
      "Current stable LoRa-based system before major website, packaging, and repeater-node development.",
    items: [
      "Climber ESP32 firmware under development",
      "Basecamp ESP32 LoRa node under development",
      "Local Flask basecamp dashboard prototype available",
      "Flutter mobile app under development",
      "Armband ESP32-H2 prototype module available",
      "Repeater node planned as next hardware stage",
    ],
  },
  {
    version: "v0.3-repeater-prototype",
    date: "Planned",
    type: "Firmware / Hardware Update",
    status: "Next Stage",
    summary:
      "Planned release for first LoRa repeater-node prototype and dashboard support for direct/repeater packet path.",
    items: [
      "Repeater ESP32 + LoRa firmware",
      "Duplicate packet filtering",
      "Packet forwarding from climber to basecamp",
      "Future dashboard field: direct or via repeater",
      "RSSI/SNR monitoring improvement",
    ],
  },
  {
    version: "v0.4-package-prototype",
    date: "Planned",
    type: "Software Packaging",
    status: "Future Stage",
    summary:
      "Planned release for packaging the local Flask basecamp dashboard into an installable software package.",
    items: [
      "Basecamp software installer prototype",
      "Local database/package folder structure",
      "Simplified startup flow",
      "COM port detection improvement",
      "Setup documentation update",
    ],
  },
  {
    version: "v1.0-production-beta",
    date: "Future",
    type: "Production Beta",
    status: "Long-Term Goal",
    summary:
      "Future beta release for a complete product package with firmware updater, Android APK, installer, guides, and customer portal downloads.",
    items: [
      "Basecamp installer",
      "Firmware updater",
      "Climber firmware package",
      "Basecamp firmware package",
      "Armband firmware package",
      "Repeater firmware package",
      "Flutter APK",
      "PDF setup guides",
    ],
  },
];

const components = [
  {
    name: "Climber Main Firmware",
    current: "Development build",
    next: "v1.0.0 firmware package",
  },
  {
    name: "Basecamp LoRa Firmware",
    current: "Development build",
    next: "v1.0.0 firmware package",
  },
  {
    name: "Armband ESP32-H2 Firmware",
    current: "Prototype module",
    next: "v1.0.0 firmware package",
  },
  {
    name: "Repeater Node Firmware",
    current: "Planned",
    next: "v0.3 prototype",
  },
  {
    name: "Flutter Mobile App",
    current: "Development build",
    next: "Android APK package",
  },
  {
    name: "Flask Basecamp Dashboard",
    current: "Prototype available",
    next: "Windows installer package",
  },
];

export default function ReleasesPage() {
  return (
    <PortalLayout
      title="Release Notes"
      description="This page tracks planned and current software/firmware releases for the MountainSafety product package."
    >
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
        <h2 className="text-2xl font-bold">Version Tracking Strategy</h2>
        <p className="mt-3 leading-7 text-slate-300">
          Each firmware and software module should have its own version number.
          Stable milestones should be tagged in GitHub before major changes such
          as repeater-node development, software packaging, or production portal
          integration.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Component Version Status</h2>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-3 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-300">
            <p>Component</p>
            <p>Current</p>
            <p>Next Package</p>
          </div>

          {components.map((component) => (
            <div
              key={component.name}
              className="grid grid-cols-3 border-t border-white/10 px-4 py-3 text-sm"
            >
              <p className="font-semibold">{component.name}</p>
              <p className="text-slate-300">{component.current}</p>
              <p className="text-slate-300">{component.next}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        {releases.map((release) => (
          <div
            key={release.version}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <p className="text-sm font-semibold text-emerald-300">
                  {release.type}
                </p>
                <h2 className="mt-2 text-2xl font-bold">{release.version}</h2>
                <p className="mt-2 text-sm text-slate-400">{release.date}</p>
              </div>

              <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
                {release.status}
              </span>
            </div>

            <p className="mt-4 max-w-4xl leading-7 text-slate-300">
              {release.summary}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {release.items.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}