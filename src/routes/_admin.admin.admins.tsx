import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/admins")({
  component: AdminsPage,
});

type AdminRow = { user_id: string; email: string; created_at: string };

function AdminsPage() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  async function load() {
    const { data: { session } } = await supabase.auth.getSession();
    setCurrentUserId(session?.user.id ?? null);
    const { data, error } = await supabase.rpc("list_admins");
    if (error) {
      toast.error(error.message);
      return;
    }
    setAdmins((data as AdminRow[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("grant_admin_by_email", {
      _email: email.trim().toLowerCase(),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const result = data as { ok: boolean; error?: string };
    if (!result.ok) {
      toast.error(result.error ?? "Failed to grant admin");
      return;
    }
    toast.success(`${email} is now an admin`);
    setEmail("");
    load();
  }

  async function revoke(userId: string) {
    if (userId === currentUserId) {
      toast.error("You can't revoke your own admin access");
      return;
    }
    if (!confirm("Revoke admin access for this user?")) return;
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Admin access revoked");
    load();
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl">Admins</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Grant other people admin access. They must sign up at /login first using the same email.
        </p>
      </div>

      <form onSubmit={addAdmin} className="flex gap-3 max-w-xl">
        <Input
          type="email"
          placeholder="person@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Adding…" : "Grant admin"}
        </Button>
      </form>

      <div className="border border-border rounded-md divide-y divide-border">
        {admins.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No admins yet.</div>
        ) : (
          admins.map((a) => (
            <div key={a.user_id} className="flex items-center justify-between p-4">
              <div>
                <div className="text-sm">{a.email}</div>
                <div className="text-xs text-muted-foreground">
                  Since {new Date(a.created_at).toLocaleDateString()}
                  {a.user_id === currentUserId && " · you"}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => revoke(a.user_id)}
                disabled={a.user_id === currentUserId}
              >
                Revoke
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
