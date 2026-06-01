import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    let active = true;
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) navigate({ to: "/login" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      if (!active) return;
      if (roles && roles.length > 0) setStatus("ok");
      else setStatus("denied");
    }
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/login" });
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  if (status === "checking") {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (status === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl">Not authorised</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account doesn't have admin access. Sign in with the admin email (nenongwen@gmail.com).
          </p>
          <Button onClick={signOut} className="mt-6">Sign out</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { to: "/admin/projects", label: "Projects" },
    { to: "/admin/pricelists", label: "Pricelist" },
    { to: "/admin/admins", label: "Admins" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container-x flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-display text-lg">Nthumeni Admin</Link>
            <nav className="flex gap-6 text-sm">
              {tabs.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  className={path.startsWith(t.to) ? "text-accent" : "text-foreground/70 hover:text-accent"}
                >
                  {t.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-muted-foreground hover:text-accent">View site</Link>
            <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </header>
      <main className="container-x py-10">
        <Outlet />
      </main>
    </div>
  );
}
