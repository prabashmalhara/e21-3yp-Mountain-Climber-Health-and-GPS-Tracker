import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
              Request a demo or discuss deployment.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This product website is currently a prototype. The system is under
              active development, including firmware, circuits, mobile app,
              basecamp software, and LoRa repeater node support.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-bold">Project scope</h2>
              <p className="mt-3 leading-7 text-slate-300">
                LoRa-based GPS tracking, SOS alerts, two-way short messaging,
                basecamp dashboard, mobile companion app, and future repeater
                node support.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Demo Contact Form</h2>
            <p className="mt-2 text-sm text-slate-400">
              This form is only a UI prototype. Backend submission will be added
              later.
            </p>

            <form className="mt-6 grid gap-4">
              <div>
                <label className="text-sm text-slate-300">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your basecamp or rescue use case"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="button"
                className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Submit Demo Request
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}