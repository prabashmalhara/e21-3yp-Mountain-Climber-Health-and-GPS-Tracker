import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stableFeatures = [
  "NEO-6M GPS tracking",
  "Phone GPS fallback through Flutter app",
  "LoRa off-grid climber-to-basecamp communication",
  "Hardware and mobile SOS alerts",
  "Clear SOS from device and dashboard",
  "Check-in / I am OK button",
  "Two-way climber-basecamp messaging",
  "OLED status display on climber device",
  "Multi-climber-ready dashboard",
  "Session log export",
  "GPS jitter filtering",
  "Alert panel for SOS, GPS lost, offline, and low battery",
];

const architecture = [
  {
    title: "Climber Device",
    description:
      "ESP32-based field device with SX1278/Ra-02 LoRa, NEO-6M GPS, OLED display, and SOS / Clear / OK buttons.",
  },
  {
    title: "Armband",
    description:
      "ESP32-H2 Bluetooth armband prepared for MAX30102 heart-rate integration and future health monitoring.",
  },
  {
    title: "Basecamp LoRa Node",
    description:
      "ESP32 + SX1278/Ra-02 LoRa gateway connected to the basecamp laptop through USB serial.",
  },
  {
    title: "Flask Web Dashboard",
    description:
      "Local dashboard running on the basecamp laptop to monitor climbers, alerts, map, messages, and session logs.",
  },
  {
    title: "Flutter Mobile App",
    description:
      "Mobile companion app connected to the climber ESP32 Wi-Fi AP for status, GPS fallback, SOS, and quick messages.",
  },
];

const keyFeatures = [
  "GPS tracking",
  "LoRa communication",
  "SOS alerts",
  "Distance and direction tracking",
  "Two-way messaging",
  "Web dashboard",
  "Mobile app",
  "Multi-climber support",
  "Session logs",
  "Future health monitoring",
];

const dashboardFeatures = [
  "Multi-climber cards",
  "Alert panel",
  "Distance map",
  "Conversation panel",
  "Session log export",
  "Basecamp GPS setup",
];

const mobileFeatures = [
  "Status view",
  "SOS button",
  "Quick messages",
  "Phone GPS fallback",
  "Distance from basecamp",
  "Armband status",
];

const hardwareItems = [
  "ESP32 main climber device",
  "SX1278 / Ra-02 LoRa modules",
  "NEO-6M GPS module",
  "OLED display",
  "SOS / Clear / OK buttons",
  "ESP32 basecamp LoRa node",
  "ESP32-H2 armband",
  "MAX30102 planned",
];

const futureImprovements = [
  "Real battery percentage monitoring",
  "MAX30102 heart-rate integration",
  "Compact enclosure",
  "Field LoRa range testing",
  "Solar LoRa repeater",
  "Larger multi-climber deployment",
];

const teamMembers = [
  "e21198 — Sahan Jayasundara",
  "e21328 — Prabash Rathnayaka",
  "e21353 — Pasan Sandeep",
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.22),_transparent_32%),radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.16),_transparent_35%)]" />

          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                Working LoRa-based off-grid safety system
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Mountain Climber IoT Safety Tracking System
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Off-grid LoRa-based climber tracking, SOS alerting, and rescue
                coordination system for mountain rangers, rescue teams, hiking
                guides, and basecamp operators.
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
                      Stable System Preview
                    </p>
                    <h2 className="text-2xl font-bold">Basecamp Monitor</h2>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                    LoRa Active
                  </span>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Selected Climber</p>
                    <p className="text-xl font-semibold">CLIMBER-001</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                      <p className="text-sm text-slate-400">Status</p>
                      <p className="font-semibold text-emerald-300">SAFE</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                      <p className="text-sm text-slate-400">SOS</p>
                      <p className="font-semibold text-orange-300">Ready</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Communication Path</p>
                    <p className="font-semibold">
                      Climber ESP32 → LoRa → Basecamp ESP32 → Flask Dashboard
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Next Upgrade</p>
                    <p className="font-semibold">Solar LoRa Repeater Node</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                Problem
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Mobile coverage is unreliable in remote mountain areas.
              </h2>

              <p className="mt-5 leading-8 text-slate-300">
                Climbers and hiking teams often travel through terrain where
                mobile signals are weak, unstable, or completely unavailable.
                In an emergency, this makes location tracking, rescue
                coordination, and communication with basecamp difficult.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-400/30 bg-orange-400/10 p-6">
              <h3 className="text-2xl font-bold">Main safety challenges</h3>

              <div className="mt-5 grid gap-3">
                {[
                  "No reliable cellular coverage",
                  "Delayed emergency communication",
                  "Difficulty finding last known location",
                  "No simple way to coordinate messages from basecamp",
                  "Limited visibility of multiple climbers in the field",
                ].map((item) => (
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
        </section>

        {/* SOLUTION */}
        <section className="bg-white text-slate-950">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Solution
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                A local LoRa safety network for climbers and basecamp teams.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                The system uses LoRa communication instead of depending on GSM
                or cellular networks. A climber ESP32 device sends GPS, SOS,
                messages, and status packets to a basecamp ESP32 LoRa gateway.
                The basecamp laptop runs a local Flask dashboard for live
                monitoring.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-2xl font-bold">Stable Features Completed</h3>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {stableFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* DATA FLOW */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Current Data Flow
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Offline-first communication from climber to basecamp.
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              The live rescue dashboard is local. The online website and portal
              are for product presentation, future downloads, documentation, and
              package delivery.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "Normal GPS Tracking",
                flow:
                  "NEO-6M GPS → Main Climber ESP32 → LoRa → Basecamp ESP32 → USB Serial → Flask Web Dashboard",
              },
              {
                title: "SOS Alert",
                flow:
                  "SOS Button / Mobile SOS → Main Climber ESP32 → LoRa → Basecamp ESP32 → Dashboard Alert Panel",
              },
              {
                title: "Messaging",
                flow:
                  "Flutter Mobile App → Wi-Fi AP → Main Climber ESP32 → LoRa → Basecamp Dashboard",
              },
              {
                title: "Basecamp Reply",
                flow:
                  "Web Dashboard → USB Serial → Basecamp ESP32 → LoRa → Main Climber ESP32 → Flutter App",
              },
              {
                title: "Phone GPS Fallback",
                flow:
                  "Phone GPS → Flutter App → ESP32 Wi-Fi AP → Main Climber ESP32 → LoRa → Web Dashboard",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{item.flow}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SYSTEM ARCHITECTURE */}
        <section className="bg-slate-900">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                System Architecture
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Five practical modules working together.
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                The current system combines embedded firmware, LoRa
                communication, a local web dashboard, and a mobile companion app.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {architecture.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-6"
                >
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KEY FEATURES */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Key Features
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Built for tracking, alerts, and field coordination.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {keyFeatures.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="font-semibold">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DASHBOARD + MOBILE */}
        <section className="bg-white text-slate-950">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Web Dashboard
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Local basecamp monitoring interface.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                The Flask dashboard runs on the basecamp laptop and displays
                climber status, alerts, map view, conversations, and session
                logs.
              </p>

              <div className="mt-6 grid gap-3">
                {dashboardFeatures.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Mobile App
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Climber-side companion application.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                The Flutter app connects to the climber ESP32 Wi-Fi AP and
                provides status view, quick messages, SOS control, phone GPS
                fallback, and armband status.
              </p>

              <div className="mt-6 grid gap-3">
                {mobileFeatures.map((item) => (
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

        {/* HARDWARE */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Hardware
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Prototype hardware prepared for product packaging.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {hardwareItems.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FUTURE IMPROVEMENTS */}
        <section className="bg-slate-900">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                Future Improvements
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Next steps toward field-ready deployment.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {futureImprovements.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                >
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACADEMIC TEAM */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Academic Project
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              University of Peradeniya 3YP Project
            </h2>

            <p className="mt-4 max-w-4xl leading-7 text-slate-300">
              This project is developed as a Third Year Project by students from
              the Department of Computer Engineering, University of Peradeniya.
              The system is presented as both an academic engineering prototype
              and a practical safety-tech product concept.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member}
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300"
                >
                  {member}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-400 text-slate-950">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Product website and portal prototype ready for next updates.
              </h2>

              <p className="mt-2 text-slate-800">
                Continue with repeater-node development, packaging workflow,
                firmware updater planning, and field testing.
              </p>
            </div>

            <Link
              href="/roadmap"
              className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              View Roadmap
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}