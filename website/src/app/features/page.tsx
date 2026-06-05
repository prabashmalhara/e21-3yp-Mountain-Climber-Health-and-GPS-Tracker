import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    title: "GPS Location Tracking",
    description:
      "The climber device sends GPS coordinates to the basecamp dashboard so operators can monitor climber movement and last known location.",
  },
  {
    title: "LoRa Long-Range Communication",
    description:
      "LoRa is used as the main communication method between the climber device and the basecamp node, reducing dependency on mobile networks.",
  },
  {
    title: "SOS Emergency Alert",
    description:
      "A physical SOS button allows the climber to send a high-priority emergency alert to the basecamp.",
  },
  {
    title: "Two-Way Short Messages",
    description:
      "The system supports short message communication between the climber side and the basecamp dashboard.",
  },
  {
    title: "Basecamp Monitoring Dashboard",
    description:
      "The local dashboard displays climber status, messages, alerts, and location information for basecamp operators.",
  },
  {
    title: "Flutter Mobile Companion App",
    description:
      "The mobile app connects to the climber device and helps the user view status and send messages.",
  },
  {
    title: "Battery Monitoring",
    description:
      "Battery level support helps basecamp operators understand device readiness during outdoor activity.",
  },
  {
    title: "Local Flask Dashboard",
    description:
    "The actual live monitoring dashboard runs locally on the basecamp laptop and communicates with the basecamp ESP32 through USB serial.",
  },
  {
    title: "ESP32 Wi-Fi API",
    description:
    "The Flutter app connects to the climber ESP32 local Wi-Fi API to send phone GPS, BPM, SOS, and message data.",
  },
  {
    title: "Repeater Node Expansion",
    description:
      "The next development stage is a LoRa repeater node to improve range in mountain environments.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Features
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold sm:text-6xl">
            Core functions for safer mountain field operations.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                        The current product prototype focuses on GPS tracking, LoRa
            communication, SOS alerts, short messaging, a local Flask basecamp
            dashboard, a Flutter mobile companion app, and ESP32 firmware modules.
            Temperature sensing is not included in the current product scope.
            The next major hardware stage is the LoRa repeater node.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h2 className="text-xl font-semibold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}