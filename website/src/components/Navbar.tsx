import Link from "next/link";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Architecture", href: "/architecture" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Packages", href: "/packages" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="block">
          <p className="text-lg font-bold tracking-tight text-white">
            MountainSafety
          </p>
          <p className="text-xs text-slate-400">
            LoRa Climber Tracking System
          </p>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}

          <Link
            href="/portal"
            className="rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Portal Prototype
          </Link>
        </div>

        <Link
          href="/portal"
          className="rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 md:hidden"
        >
          Portal
        </Link>
      </nav>
    </header>
  );
}