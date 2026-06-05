import PortalLayout from "@/components/PortalLayout";

export default function SupportPage() {
  return (
    <PortalLayout
      title="Support"
      description="This prototype support page will later help basecamp users report setup issues, firmware problems, device faults, and deployment questions."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Support Categories</h2>

          <div className="mt-5 grid gap-3">
            {[
              "Basecamp software installation",
              "COM port / USB serial connection",
              "Climber ESP32 firmware issue",
              "LoRa communication problem",
              "Flutter mobile app connection",
              "Armband BLE detection",
              "Repeater node setup",
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

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Demo Support Form</h2>
          <p className="mt-2 text-sm text-slate-400">
            This form is UI only. Backend support ticket creation will be added
            later.
          </p>

          <form className="mt-6 grid gap-4">
            <input
              type="text"
              placeholder="Basecamp ID"
              className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />

            <input
              type="text"
              placeholder="Issue title"
              className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />

            <textarea
              rows={5}
              placeholder="Describe the issue"
              className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />

            <button
              type="button"
              className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Submit Support Request
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}