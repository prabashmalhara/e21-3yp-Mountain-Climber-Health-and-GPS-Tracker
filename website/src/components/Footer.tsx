import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-bold">MountainSafety</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            A LoRa-based climber safety tracking and emergency communication
            system for remote mountain basecamps.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Website</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-400">
            <Link href="/features" className="hover:text-white">
              Features
            </Link>
            <Link href="/how-it-works" className="hover:text-white">
              How It Works
            </Link>
            <Link href="/packages" className="hover:text-white">
              Packages
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Development Status</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Product prototype under development. Current focus: firmware,
            circuit design, mobile app, basecamp software, and LoRa repeater
            node.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-sm text-slate-500">
        © 2026 MountainSafety Prototype. University project / product prototype.
      </div>
    </footer>
  );
}