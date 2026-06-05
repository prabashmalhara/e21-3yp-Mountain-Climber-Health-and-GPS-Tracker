import PortalLayout from "@/components/PortalLayout";

const downloads = [
  {
    name: "Basecamp Software Installer",
    file: "MountainSafetyBasecamp_Setup_v1.0.0.exe",
    status: "Coming Soon",
    description:
      "Future packaged version of the local Flask basecamp dashboard. It will install the dashboard, serial communication service, and local monitoring tools.",
  },
  {
    name: "Climber Main Firmware",
    file: "climber_main_firmware_v1.0.0.bin",
    status: "In Development",
    description:
      "Firmware package for the climber ESP32 device with GPS, LoRa, Wi-Fi API, SOS, OLED status, and mobile app communication support.",
  },
  {
    name: "Basecamp LoRa Firmware",
    file: "basecamp_lora_firmware_v1.0.0.bin",
    status: "In Development",
    description:
      "Firmware package for the basecamp ESP32 LoRa node that bridges LoRa messages to the laptop through USB serial.",
  },
  {
    name: "Armband ESP32-H2 Firmware",
    file: "armband_h2_firmware_v1.0.0.bin",
    status: "Prototype Module",
    description:
      "Firmware package for the ESP32-H2 armband module used for BLE-based BPM and armband battery data forwarding.",
  },
  {
    name: "Repeater Node Firmware",
    file: "repeater_node_firmware_v1.0.0.bin",
    status: "Next Development Stage",
    description:
      "Future firmware for the LoRa repeater node used to extend communication range between climber and basecamp.",
  },
  {
    name: "Flutter Mobile App",
    file: "MountainSafetyClimber_v1.0.0.apk",
    status: "In Development",
    description:
      "Android APK for the climber-side mobile app that connects to the climber ESP32 Wi-Fi API and supports GPS fallback, messages, SOS, and armband data.",
  },
  {
    name: "Quick Start Guide",
    file: "Quick_Start_Guide.pdf",
    status: "Draft",
    description:
      "Simple setup guide for connecting the basecamp LoRa node, installing software, turning on climber devices, and starting monitoring.",
  },
];

export default function DownloadsPage() {
  return (
        <PortalLayout
          title="Software and Firmware Packages"
          description="This mock download center shows how production users will receive the basecamp installer, ESP32 firmware packages, mobile app APK, firmware updater, and setup guides."
        >
          <div className="grid gap-4">
            {downloads.map((item) => (
              <div
                key={item.file}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">{item.file}</p>
                  </div>

                  <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
                    {item.status}
                  </span>
                </div>

                <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </PortalLayout>
);
  
}