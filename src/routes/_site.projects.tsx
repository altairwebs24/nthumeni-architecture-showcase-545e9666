import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { projects as staticProjects } from "@/lib/projects";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_site/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Nthumeni Architecture" },
      { name: "description", content: "Selected residential, hospitality and interior projects by Nthumeni Architecture." },
      { property: "og:title", content: "Projects — Nthumeni Architecture" },
      { property: "og:description", content: "A portfolio of residential, hospitality and interior architecture." },
    ],
  }),
  component: ProjectsPage,
});

type Item = { key: string; title: string; year: string; location: string; type: string; image: string };

function ProjectsPage() {
  const base: Item[] = staticProjects.map((p) => ({
    key: p.slug, title: p.title, year: p.year, location: p.location, type: p.type, image: p.image,
  }));
  const [items, setItems] = useState<Item[]>(base);

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,year,location,type,image_url")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        const fromDb: Item[] = data.map((p) => ({
          key: p.id, title: p.title, year: p.year, location: p.location, type: p.type, image: p.image_url,
        }));
        setItems([...fromDb, ...base]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="container-x pt-16 md:pt-24 pb-12">
        <p className="eyebrow">Portfolio</p>
        <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl leading-[0.95]">
          A record of <em className="italic text-accent">built work</em> and considered places.
        </h1>
      </section>

      <section className="container-x pb-24 space-y-20 md:space-y-28">
        {items.map((p, i) => (
          <article
            key={p.key}
            className={`grid md:grid-cols-12 gap-6 md:gap-10 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="md:col-span-8 overflow-hidden bg-muted">
              <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover aspect-[4/3]" />
            </div>
            <div className="md:col-span-4">
              <p className="eyebrow">{String(i + 1).padStart(2, "0")} / {p.type}</p>
              <h2 className="font-display text-3xl md:text-4xl mt-3">{p.title}</h2>
              <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Year</dt>
                <dd>{p.year}</dd>
                <dt className="text-muted-foreground">Location</dt>
                <dd>{p.location}</dd>
                <dt className="text-muted-foreground">Type</dt>
                <dd>{p.type}</dd>
              </dl>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
