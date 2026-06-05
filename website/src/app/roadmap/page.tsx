import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roadmap = [
  {
    phase: "Phase 1",
    title: "Current LoRa Prototype",
    status: "Current Stage",
    description:
      "The system currently focuses on climber GPS tracking, SOS alerts, short messages, Flutter mobile app communication, LoRa data transfer, and a local Flask basecamp dashboard.",
    items: [
      "Climber ESP32 firmware",
      "Basecamp ESP32 LoRa firmware",
      "Flutter mobile companion app",
      "Local Flask basecamp dashboard",
      "USB serial connection between basecamp ESP32 and laptop",
      "SOS, messages, GPS, battery, RSSI/SNR, and event logs",
    ],
  },
  {
    phase: "Phase 2",
    title: "LoRa Repeater Node",
    status: "Next Development Stage",
    description:
      "The next hardware and firmware stage is a repeater node that extends LoRa range between climber devices and the basecamp gateway.",
    items: [
      "Repeater ESP32 + LoRa module",
      "Packet forwarding",
      "Duplicate packet filtering",
      "Hop count and repeater ID support",
      "Dashboard support for direct/repeater path",
      "Outdoor battery enclosure planning",
    ],
  },
  {
    phase: "Phase 3",
    title: "Software Packaging",
    status: "Planned",
    description:
      "The local Flask basecamp dashboard and firmware files will be prepared as user-friendly software packages for non-technical basecamp users.",
    items: [
      "Basecamp Windows installer",
      "Firmware updater tool",
      "Firmware .bin package exports",
      "Flutter Android APK",
      "Setup guides and troubleshooting guides",
      "Versioned release files",
    ],
  },
  {
    phase: "Phase 4",
    title: "Customer Portal",
    status: "Prototype Started",
    description:
      "The online website and portal prototype will become the place where future users register, manage devices, download software, read documentation, and request support.",
    items: [
      "Basecamp account registration",
      "Device registration",
      "Download center",
      "Documentation center",
      "Release notes",
      "Support ticket system",
    ],
  },
  {
    phase: "Phase 5",
    title: "Production Beta",
    status: "Future Goal",
    description:
      "The long-term goal is to provide a complete hardware and software kit for field testing with mountain guides, rescue teams, or basecamp operators.",
    items: [
      "Basecamp safety kit",
      "Multiple climber devices",
      "Repeater-supported range testing",
      "Production enclosure design",
      "Installer-based setup",
      "Customer support workflow",
    ],
  },
];

const currentScope = [
  "GPS-based climber tracking",
  "LoRa climber-to-basecamp communication",
  "SOS alerts",
  "Two-way short messages",
  "Flutter mobile app",
  "Local Flask basecamp dashboard",
  "ESP32-H2 armband prototype module",
  "Repeater node planned next",
];

const notCurrentScope = [
  "Cloud live monitoring is not production-ready yet",
  "Temperature sensor is not part of the current product scope",
  "Payment/subscription system is not required now",
  "Arduino IDE workflow should not be used by final customers",
];

export default function RoadmapPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Development Roadmap
          </p>

          <h1 className="mt-4 max-w-5xl text-4xl font-bold sm:text-6xl">
            From working LoRa prototype to production-ready safety kit.
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            This roadmap shows the planned development path for the Mountain
            Climber IoT Safety Tracking System. The current focus is to keep the
            field system offline-first while building the online website and
            portal as a professional product packaging layer.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
              <h2 className="text-2xl font-bold">Current Product Scope</h2>

              <div className="mt-5 grid gap-3">
                {currentScope.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-bold">Not Current Scope</h2>

              <div className="mt-5 grid gap-3">
                {notCurrentScope.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8">
            {roadmap.map((phase) => (
              <div
                key={phase.phase}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <p className="text-sm font-semibold text-emerald-300">
                      {phase.phase}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold">{phase.title}</h2>
                    <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                      {phase.description}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
                    {phase.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {phase.items.map((item) => (
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

          <div className="mt-12 rounded-3xl bg-white p-6 text-slate-950">
            <h2 className="text-2xl font-bold">Recommended Next Technical Step</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Freeze the current stable LoRa system, then start repeater-node
              firmware and packet-format development. After the repeater works,
              update the local Flask dashboard to show whether packets arrived
              directly or through a repeater.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}