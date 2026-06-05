import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    title: "Local Flask Basecamp Dashboard",
    description:
      "The live monitoring dashboard runs locally on the basecamp laptop and receives data from the basecamp ESP32 through USB serial.",
  },
  {
    title: "ESP32 Wi-Fi API",
    description:
      "The Flutter app connects to the climber ESP32 local Wi-Fi API at 192.168.4.1 for status, GPS fallback, BPM, SOS, and messages.",
  },
  {
    title: "LoRa Communication",
    description:
      "The climber ESP32 sends compact LoRa packets to the basecamp ESP32 node without depending on mobile network coverage.",
  },
  {
    title: "GPS Tracking",
    description:
      "GPS and last-known-location data are forwarded to the basecamp dashboard for field monitoring.",
  },
  {
    title: "SOS and Two-Way Messaging",
    description:
      "Climbers can send SOS alerts and short messages. Basecamp can reply and clear SOS from the dashboard.",
  },
  {
    title: "Repeater Node Next",
    description:
      "The next hardware stage is a LoRa repeater node to extend the communication range in mountain terrain.",
  },
];

const softwareModules = [
  "Climber ESP32 Firmware",
  "Basecamp ESP32 LoRa Firmware",
  "ESP32-H2 Armband Firmware",
  "Flutter Mobile App",
  "Local Flask Basecamp Dashboard",
  "Future LoRa Repeater Firmware",
];

const packageItems = [
  "Basecamp Software Installer",
  "Climber Main Firmware Package",
  "Basecamp LoRa Firmware Package",
  "Armband ESP32-H2 Firmware Package",
  "Flutter Mobile APK",
  "Repeater Node Firmware Package",
  "Quick Start and Troubleshooting Guides",
];

const statusItems = [
  {
    name: "Climber ESP32 Firmware",
    status: "In Development",
  },
  {
    name: "Basecamp ESP32 LoRa Firmware",
    status: "In Development",
  },
  {
    name: "Flutter Mobile App",
    status: "In Development",
  },
  {
    name: "Local Flask Dashboard",
    status: "Prototype Available",
  },
  {
    name: "Armband ESP32-H2 Module",
    status: "Prototype Module",
  },
  {
    name: "Repeater Node",
    status: "Next Development Stage",
  },
  {
    name: "Customer Portal",
    status: "Prototype Website Stage",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.25),_transparent_35%),radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%)]" />

          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                Product website and customer portal prototype
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Offline LoRa safety system for mountain basecamps.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                MountainSafety is a LoRa-based climber tracking and emergency
                communication system. The actual live monitoring runs on a local
                Flask basecamp dashboard, while the online website acts as a
                product website and future software package portal.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/architecture"
                  className="rounded-xl bg-emerald-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  View System Architecture
                </Link>

                <Link
                  href="/portal"
                  className="rounded-xl border border-white/15 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Open Portal Prototype
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-slate-900 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Real System Preview
                    </p>
                    <h2 className="text-2xl font-bold">
                      Local Basecamp Monitor
                    </h2>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                    Offline-first
                  </span>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Selected Climber</p>
                    <p className="text-xl font-semibold">CLIMBER-001</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                      <p className="text-sm text-slate-400">LoRa Link</p>
                      <p className="font-semibold text-emerald-300">
                        Basecamp Node
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                      <p className="text-sm text-slate-400">Dashboard</p>
                      <p className="font-semibold text-sky-300">
                        Flask Local
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Mobile App Path</p>
                    <p className="font-semibold">
                      Flutter App → ESP32 Wi-Fi API → LoRa
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Next Upgrade</p>
                    <p className="font-semibold">
                      LoRa Repeater Node Integration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                Current Real Architecture
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Built around local monitoring, ESP32 firmware, and LoRa.
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                The online website does not replace the rescue dashboard at this
                stage. The field monitoring system remains offline-first: the
                basecamp laptop runs the local Flask dashboard, connected to the
                basecamp ESP32 LoRa node by USB serial.
              </p>

              <div className="mt-8">
                <Link
                  href="/architecture"
                  className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Full Architecture
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
              <h3 className="text-2xl font-bold">Data Flow</h3>

              <div className="mt-6 grid gap-3 text-sm text-slate-300">
                <div className="rounded-xl bg-slate-950 px-4 py-3">
                  Flutter Mobile App / Armband BLE Data
                </div>
                <div className="text-center text-emerald-300">↓ HTTP Wi-Fi API</div>
                <div className="rounded-xl bg-slate-950 px-4 py-3">
                  Climber ESP32 Firmware
                </div>
                <div className="text-center text-emerald-300">↓ LoRa</div>
                <div className="rounded-xl bg-slate-950 px-4 py-3">
                  Optional Repeater Node
                </div>
                <div className="text-center text-emerald-300">↓ LoRa</div>
                <div className="rounded-xl bg-slate-950 px-4 py-3">
                  Basecamp ESP32 LoRa Node
                </div>
                <div className="text-center text-emerald-300">↓ USB Serial</div>
                <div className="rounded-xl bg-slate-950 px-4 py-3">
                  Local Flask Basecamp Dashboard
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Core Features
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Features based on your current firmware and apps.
            </h2>

            <p className="mt-4 text-slate-300">
              The current product direction focuses on GPS tracking, LoRa
              communication, SOS alerts, short messages, local Flask dashboard,
              Flutter mobile app, ESP32 firmware modules, and a future repeater
              node. Temperature sensing is not included in the current product
              scope.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/features"
              className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            >
              View all features →
            </Link>
          </div>
        </section>

        <section className="bg-white text-slate-950">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Product Package
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Package the system for non-technical basecamp users.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                The final product should not be delivered as raw source code.
                It should include a basecamp installer, firmware updater,
                firmware packages, Flutter APK, documentation, and device
                registration through the portal.
              </p>

              <div className="mt-8">
                <Link
                  href="/packages"
                  className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  View Package Plans
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-2xl font-bold">Future Download Package</h3>

              <div className="mt-6 grid gap-3">
                {packageItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Software and Firmware Modules
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              The product is made from multiple installable parts.
            </h2>

            <p className="mt-4 text-slate-300">
              This is why the portal needs downloads, documentation, release
              notes, and support pages.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {softwareModules.map((module) => (
              <div
                key={module}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="font-semibold">{module}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="status" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Development Status
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Current stage of the system.
            </h2>

            <p className="mt-4 text-slate-300">
              The website is being developed in parallel with firmware, circuit
              design, mobile app, basecamp dashboard, and repeater-node
              development.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            {statusItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between gap-3 border-b border-white/10 bg-white/5 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center"
              >
                <p className="font-medium">{item.name}</p>
                <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-emerald-400 text-slate-950">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Customer portal prototype is ready for packaging workflow.
              </h2>

              <p className="mt-2 text-slate-800">
                The portal is prepared for downloads, device registration,
                documentation, release notes, and support pages. Real login and
                backend storage can be added later.
              </p>
            </div>

            <Link
              href="/portal"
              className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              View Portal
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}