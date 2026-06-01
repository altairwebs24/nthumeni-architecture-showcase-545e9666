import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/projects")({
  component: AdminProjects,
});

type Project = {
  id: string;
  title: string;
  year: string;
  location: string;
  type: string;
  image_url: string;
  sort_order: number;
};

const empty = { title: "", year: "", location: "", type: "Residential", image_url: "", sort_order: 0 };

function AdminProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...empty });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `projects/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("site-images").upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast.success("Image uploaded");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.image_url) {
      toast.error("Title and image are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("projects").insert(form);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Project added");
    setForm({ ...empty });
    load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
      <section>
        <h2 className="font-display text-2xl mb-4">Add a project</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Year</label>
              <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Type</label>
              <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Residential" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Location</label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Cover image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
              disabled={uploading}
            />
            {form.image_url && (
              <img src={form.image_url} alt="" className="mt-2 w-full aspect-[4/3] object-cover" />
            )}
          </div>
          <Button type="submit" disabled={saving || uploading} className="w-full">
            {saving ? "Saving…" : "Add project"}
          </Button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4">All projects</h2>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No projects yet. Use the form to add your first.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {items.map((p) => (
              <li key={p.id} className="border border-border p-3 group">
                <img src={p.image_url} alt={p.title} className="w-full aspect-[4/3] object-cover" />
                <div className="flex items-start justify-between mt-3 gap-2">
                  <div className="min-w-0">
                    <p className="font-display truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.year} · {p.location} · {p.type}</p>
                  </div>
                  <button onClick={() => onDelete(p.id)} className="text-muted-foreground hover:text-destructive p-1">
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
