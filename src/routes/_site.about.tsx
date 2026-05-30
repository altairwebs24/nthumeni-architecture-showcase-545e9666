import { createFileRoute } from "@tanstack/react-router";
import about from "@/assets/about.jpg";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "Studio — Nthumeni Architecture" },
      { name: "description", content: "Meet Nthumeni Architecture — a South African studio designing buildings that listen to land, light and material." },
      { property: "og:title", content: "Studio — Nthumeni Architecture" },
      { property: "og:description", content: "About the studio and our approach to architecture." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { t: "Context first", d: "Every project begins by reading the site — its light, its slope, its sounds, its history." },
  { t: "Honest material", d: "Concrete, timber, stone and steel, used with restraint and detailed with care." },
  { t: "Slow craft", d: "We work patiently. Drawings are tested, models are built, decisions are revisited." },
  { t: "Climate aware", d: "Passive design, deep eaves and cross-ventilation are first principles, not afterthoughts." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x pt-16 md:pt-24 pb-12 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-7">
          <p className="eyebrow">The studio</p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 leading-[0.95]">
            We design <em className="italic text-accent">quiet</em>,<br /> enduring architecture.
          </h1>
          <p className="mt-8 text-lg text-foreground/80 max-w-prose">
            Nthumeni Architecture is an independent practice based in Limpopo, South Africa.
            We work across private residences, hospitality and interiors — drawing from the
            landscape, the climate and the cultures that surround each project.
          </p>
        </div>
        <div className="md:col-span-5">
          <img
            src={about}
            alt="Architectural plans and tools on a workbench"
            loading="lazy"
            className="w-full aspect-[4/5] object-cover"
          />
        </div>
      </section>

      <div className="hairline" />

      <section className="container-x py-20 md:py-28 grid md:grid-cols-12 gap-10">
        <p className="eyebrow md:col-span-3">Principles</p>
        <div className="md:col-span-9 grid sm:grid-cols-2 gap-x-10 gap-y-12">
          {values.map((v) => (
            <div key={v.t}>
              <h3 className="font-display text-2xl">{v.t}</h3>
              <p className="mt-3 text-foreground/75">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline" />

      <section className="container-x py-20 md:py-28 grid md:grid-cols-12 gap-10">
        <p className="eyebrow md:col-span-3">Services</p>
        <ul className="md:col-span-9 grid sm:grid-cols-2 gap-4 font-display text-2xl md:text-3xl">
          <li>Residential architecture</li>
          <li>Hospitality &amp; lodges</li>
          <li>Interior architecture</li>
          <li>Heritage &amp; renovation</li>
          <li>Feasibility studies</li>
          <li>Master planning</li>
        </ul>
      </section>
    </>
  );
}
