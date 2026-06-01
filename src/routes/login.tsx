import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin sign in — Nthumeni Architecture" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/projects" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/projects` },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin/projects" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-display text-2xl mb-1">Nthumeni</Link>
        <p className="eyebrow text-center mb-8">Admin area</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="mt-6 w-full text-xs text-muted-foreground hover:text-accent"
        >
          {mode === "signup" ? "Already have an account? Sign in" : "First time? Create an account"}
        </button>
        <p className="mt-8 text-xs text-muted-foreground text-center">
          Admin access is granted to nenongwen@gmail.com.
        </p>
      </div>
    </div>
  );
}
