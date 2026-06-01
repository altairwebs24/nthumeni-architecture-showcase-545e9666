import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Index" },
  { to: "/projects", label: "Projects" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "Studio" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container-x flex items-center justify-between h-16">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-tight">Nthumeni</span>
            <span className="eyebrow text-[10px] mt-0.5">Architecture</span>
          </Link>
          <nav className="hidden md:flex gap-10 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`transition-colors hover:text-accent ${path === n.to ? "text-accent" : "text-foreground/70"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            aria-label="Menu"
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-border">
            <nav className="container-x py-6 flex flex-col gap-5 text-lg font-display">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={path === n.to ? "text-accent" : ""}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="hairline mt-24">
        <div className="container-x py-12 grid gap-10 md:grid-cols-3 text-sm">
          <div>
            <div className="font-display text-2xl">Nthumeni Architecture</div>
            <p className="text-muted-foreground mt-2 max-w-xs">
              An architectural studio crafting considered spaces rooted in place, light, and material.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-3">Studio</div>
            <p className="text-foreground/80">Sibasa, Thohoyandou 0970</p>
            <p className="text-foreground/80">Limpopo, South Africa</p>
            <a href="tel:+27837505726" className="text-foreground/80 hover:text-accent block mt-2">
              083 750 5726
            </a>
            <a href="mailto:info@nthumeniarchi.co.za" className="text-foreground/80 hover:text-accent block">
              info@nthumeniarchi.co.za
            </a>
          </div>
          <div>
            <div className="eyebrow mb-3">Follow</div>
            <a
              href="https://www.instagram.com/nthumeni.architecture"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent block"
            >
              @nthumeni.architecture
            </a>
            <a
              href={`https://wa.me/27837505726?text=${encodeURIComponent("Hello Nthumeni Architecture, I'd like to enquire about a project.")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent block mt-1"
            >
              WhatsApp +27 83 750 5726
            </a>
          </div>
        </div>
        <div className="hairline">
          <div className="container-x py-5 text-xs text-muted-foreground flex justify-between">
            <span>© {new Date().getFullYear()} Nthumeni Architecture</span>
            <span className="flex gap-4">
              <Link to="/login" className="hover:text-accent">Admin</Link>
              <span>All rights reserved</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
