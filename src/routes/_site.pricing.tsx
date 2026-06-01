import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_site/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Nthumeni Architecture" },
      { name: "description", content: "Indicative fees for architectural design, documentation and project services." },
      { property: "og:title", content: "Pricing — Nthumeni Architecture" },
      { property: "og:description", content: "Indicative fees for architectural design, documentation and project services." },
    ],
  }),
  component: PricingPage,
});

type Item = { id: string; name: string; description: string; price: string; category: string };

function PricingPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("pricelist_items")
      .select("id,name,description,price,category")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  const grouped = items.reduce<Record<string, Item[]>>((acc, it) => {
    const k = it.category || "General";
    (acc[k] ??= []).push(it);
    return acc;
  }, {});

  return (
    <>
      <section className="container-x pt-16 md:pt-24 pb-12">
        <p className="eyebrow">Fees</p>
        <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl leading-[0.95]">
          Indicative <em className="italic text-accent">pricing</em>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Every commission is scoped to the brief and site. The figures below are starting points — final fees are
          confirmed after an initial consultation.
        </p>
      </section>

      <section className="container-x pb-24 space-y-14">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="text-muted-foreground">Pricelist coming soon — please get in touch for a quote.</p>
        )}
        {Object.entries(grouped).map(([cat, list]) => (
          <div key={cat}>
            <h2 className="eyebrow mb-4">{cat}</h2>
            <ul className="divide-y divide-border border-t border-b border-border">
              {list.map((it) => (
                <li key={it.id} className="py-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="font-display text-xl">{it.name}</p>
                    {it.description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{it.description}</p>}
                  </div>
                  <span className="font-display text-lg whitespace-nowrap">{it.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
