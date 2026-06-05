import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const modules = [
  {
    title: "Climber ESP32 Firmware",
    description:
      "Main field device firmware. It manages GPS data, LoRa packets, SOS state, local Wi-Fi API, battery status, OLED status, and communication with the mobile app.",
    items: [
      "Wi-Fi AP for mobile app connection",
      "HTTP API: /status, /gps, /bpm, /send, /sos, /clear-sos",
      "LoRa communication to basecamp",
      "GPS and last-known-location support",
      "SOS and message packet handling",
    ],
  },
  {
    title: "Flutter Climber Mobile App",
    description:
      "The climber-side mobile app connects to the climber ESP32 Wi-Fi API and provides the user interface for status, GPS fallback, quick messages, SOS, and armband/BPM forwarding.",
    items: [
      "Connects to ESP32 at 192.168.4.1",
      "Posts phone GPS fallback data",
      "Scans BLE armband advertisement",
      "Sends short messages and SOS commands",
      "Shows local distance sketch and device status",
    ],
  },
  {
    title: "Armband ESP32-H2 Firmware",
    description:
      "Wearable armband firmware used for BLE-based health data forwarding. The current website treats this as a supported prototype module, not the main product selling point.",
    items: [
      "BLE advertisement as CLIMBER_ARMBAND",
      "BPM data forwarding",
      "Armband battery value",
      "Sensor attached/missing state",
    ],
  },
  {
    title: "Basecamp ESP32 LoRa Firmware",
    description:
      "The basecamp LoRa node receives climber LoRa packets and bridges them to the laptop through USB serial. It also sends basecamp replies and control commands back over LoRa.",
    items: [
      "LoRa receive from climber nodes",
      "LoRa transmit basecamp messages",
      "USB serial bridge to laptop",
      "RSSI and SNR reporting",
    ],
  },
  {
    title: "Flask Basecamp Dashboard",
    description:
      "The real live monitoring dashboard. It runs locally on the basecamp laptop, reads USB serial data from the basecamp ESP32, and provides the operator interface.",
    items: [
      "Local dashboard, not cloud-dependent",
      "Climber list, alerts, messages, and event log",
      "Basecamp GPS setup and LoRa forwarding",
      "CSV session log export",
      "SOS clear and basecamp reply controls",
    ],
  },
  {
    title: "Future LoRa Repeater Node",
    description:
      "The next firmware and hardware stage. The repeater will extend LoRa communication range between climber devices and the basecamp node.",
    items: [
      "Receive climber packets",
      "Forward packets to basecamp",
      "Avoid duplicate packet forwarding",
      "Support future battery/solar outdoor enclosure",
    ],
  },
];

const flow = [
  "Armband ESP32-H2",
  "BLE advertisement",
  "Flutter App / Climber ESP32 data side",
  "HTTP Wi-Fi API to 192.168.4.1",
  "Climber ESP32 Firmware",
  "LoRa packet",
  "Optional LoRa Repeater Node",
  "LoRa packet",
  "Basecamp ESP32 LoRa Node",
  "USB Serial",
  "Local Flask Basecamp Dashboard",
];

export default function ArchitecturePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Real System Architecture
          </p>

          <h1 className="mt-4 max-w-5xl text-4xl font-bold sm:text-6xl">
            Website aligned with the current firmware, Flask dashboard, and
            Flutter app.
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            This online website is a product website and future customer portal
            prototype. The actual live monitoring system is the local Flask
            basecamp dashboard connected to the basecamp ESP32 LoRa node by USB
            serial. The climber mobile app communicates with the climber ESP32
            through its local Wi-Fi API.
          </p>

          <div className="mt-12 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
            <h2 className="text-2xl font-bold">Current data flow</h2>

            <div className="mt-6 grid gap-3">
              {flow.map((item, index) => (
                <div key={`${item}-${index}`}>
                  <div className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200">
                    {item}
                  </div>

                  {index < flow.length - 1 && (
                    <div className="py-2 text-center text-emerald-300">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h2 className="text-2xl font-bold">{module.title}</h2>
                <p className="mt-3 leading-7 text-slate-300">
                  {module.description}
                </p>

                <div className="mt-5 grid gap-2">
                  {module.items.map((item) => (
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
            <h2 className="text-2xl font-bold">Important production rule</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The online website should not replace the local basecamp dashboard
              yet. For the current product stage, the online site should provide
              product information, setup documentation, package downloads,
              firmware releases, and future customer account management. The
              field monitoring system must remain offline-first.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}