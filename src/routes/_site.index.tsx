import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { projects } from "@/lib/projects";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Nthumeni Architecture — Considered spaces, rooted in place" },
      { name: "description", content: "South African architectural studio designing residential, hospitality and interior projects shaped by light, landscape and material." },
      { property: "og:title", content: "Nthumeni Architecture" },
      { property: "og:description", content: "A South African studio crafting considered spaces rooted in place, light and material." },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const featured = projects.slice(0, 3);
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="container-x pt-12 md:pt-20 pb-10">
          <p className="eyebrow">Est. 2018 · Limpopo, South Africa</p>
          <h1 className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] mt-6 max-w-5xl">
            Architecture of <em className="italic text-accent">place,</em> light and quiet permanence.
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-sm hover:bg-accent transition-colors"
            >
              View projects <ArrowUpRight className="size-4" />
            </Link>
            <Link to="/about" className="underline-offset-4 hover:underline">
              About the studio
            </Link>
          </div>
        </div>

        <div className="relative aspect-[16/10] md:aspect-[21/9] overflow-hidden">
          <img
            src={hero}
            alt="Modern concrete residence at golden hour"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Statement */}
      <section className="container-x py-20 md:py-28 grid md:grid-cols-12 gap-10">
        <p className="eyebrow md:col-span-3">Approach</p>
        <p className="md:col-span-9 font-display text-2xl md:text-4xl leading-[1.25] text-foreground/90">
          We design buildings that listen — to the land they sit on, the people they shelter,
          and the material they're made of. Each project is a careful conversation between
          context, climate and craft.
        </p>
      </section>

      <div className="hairline" />

      {/* Featured projects */}
      <section className="container-x py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow">Selected works</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3">Recent projects</h2>
          </div>
          <Link to="/projects" className="hidden md:inline-flex items-center gap-1.5 text-sm hover:text-accent">
            All projects <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {featured.map((p, i) => (
            <Link
              key={p.slug}
              to="/projects"
              className={`group block ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className={`overflow-hidden bg-muted ${i === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex justify-between items-baseline">
                <h3 className="font-display text-2xl md:text-3xl">{p.title}</h3>
                <span className="text-sm text-muted-foreground">{p.year}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {p.type} · {p.location}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-background">
        <div className="container-x py-20 md:py-28 grid md:grid-cols-12 gap-8 items-end">
          <h2 className="md:col-span-8 font-display text-4xl md:text-6xl leading-[1.05]">
            Have a site, a brief, or a dream? <em className="italic text-accent">Let's talk.</em>
          </h2>
          <div className="md:col-span-4 md:text-right">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-background/40 px-6 py-3 rounded-sm hover:bg-background hover:text-ink transition-colors"
            >
              Start a project <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
