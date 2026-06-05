import Link from "next/link";

const portalCards = [
  {
    title: "Basecamp Dashboard",
    description:
      "View basecamp profile, system status, latest package version, and current prototype state.",
    href: "/portal/dashboard",
  },
  {
    title: "Devices",
    description:
      "Preview registered basecamp node, climber device, and future repeater node information.",
    href: "/portal/devices",
  },
  {
    title: "Downloads",
    description:
      "Mock download center for basecamp software, firmware files, mobile app, and documentation.",
    href: "/portal/downloads",
  },
];

export default function PortalHome() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-emerald-300 hover:text-emerald-200">
          ← Back to website
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Customer Portal Prototype
          </p>
          <h1 className="mt-3 text-4xl font-bold">Basecamp user portal</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            This is a prototype portal. In the production version, basecamp users
            will register, manage devices, download software packages, download
            firmware updates, and access setup documentation.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {portalCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}