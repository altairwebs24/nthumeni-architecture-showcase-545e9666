import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nthumeni Architecture" },
      { name: "description", content: "Begin a conversation with Nthumeni Architecture about a new project, site or commission." },
      { property: "og:title", content: "Contact — Nthumeni Architecture" },
      { property: "og:description", content: "Start a project with the studio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="container-x pt-16 md:pt-24 pb-24 grid md:grid-cols-12 gap-12">
      <div className="md:col-span-5">
        <p className="eyebrow">Contact</p>
        <h1 className="font-display text-5xl md:text-7xl mt-5 leading-[0.95]">
          Let's <em className="italic text-accent">begin.</em>
        </h1>
        <p className="mt-6 text-foreground/80 max-w-prose">
          Tell us a little about your site, your brief, or the idea you're carrying.
          We respond to every enquiry within five working days.
        </p>

        <dl className="mt-12 space-y-6 text-sm">
          <div>
            <dt className="eyebrow mb-1">Studio</dt>
            <dd>Limpopo, South Africa</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Email</dt>
            <dd><a className="hover:text-accent" href="mailto:hello@nthumeni.studio">hello@nthumeni.studio</a></dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Instagram</dt>
            <dd><a className="hover:text-accent" href="https://www.instagram.com/nthumeni.architecture" target="_blank" rel="noreferrer">@nthumeni.architecture</a></dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        className="md:col-span-7 space-y-6"
      >
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Location / site" name="location" />
        <div>
          <label className="eyebrow block mb-2">Project brief</label>
          <textarea
            name="brief"
            rows={6}
            required
            className="w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 resize-none"
            placeholder="Tell us about your project…"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-sm hover:bg-accent transition-colors"
        >
          {sent ? "Thank you — we'll be in touch" : "Send enquiry"}
        </button>
      </form>
    </section>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow block mb-2" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full bg-transparent border-b border-border focus:border-accent outline-none py-3"
      />
    </div>
  );
}
