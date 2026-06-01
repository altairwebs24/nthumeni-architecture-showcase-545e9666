import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/pricelists")({
  component: AdminPricelist,
});

type Item = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  sort_order: number;
};

const empty = { name: "", description: "", price: "", category: "", sort_order: 0 };

function AdminPricelist() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("pricelist_items")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { toast.error("Name is required"); return; }
    setSaving(true);
    const { error } = await supabase.from("pricelist_items").insert(form);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Item added");
    setForm({ ...empty });
    load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("pricelist_items").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
      <section>
        <h2 className="font-display text-2xl mb-4">Add a price item</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Service / item name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Category</label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Design, Documentation, …" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Price</label>
            <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="R 25 000 or POA" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : "Add item"}
          </Button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4">All items</h2>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pricelist items yet.</p>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {items.map((it) => (
              <li key={it.id} className="p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {it.category && <p className="eyebrow">{it.category}</p>}
                  <p className="font-display text-lg">{it.name}</p>
                  {it.description && <p className="text-sm text-muted-foreground mt-1">{it.description}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-display">{it.price}</span>
                  <button onClick={() => onDelete(it.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
