import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MountainSafety Portal",
  description: "LoRa climber safety product portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <header className="border-b border-white/10 bg-slate-950">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-400 font-black text-slate-950">
                MS
              </div>
              <div>
                <div className="text-xl font-black">MountainSafety</div>
                <div className="text-sm text-slate-400">LoRa Rescue System</div>
              </div>
            </Link>

            <nav className="flex flex-wrap gap-4 text-sm text-slate-300">
              <Link href="/register">Request Access</Link>
              <Link href="/login">Login</Link>
              <Link href="/portal">Portal</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}