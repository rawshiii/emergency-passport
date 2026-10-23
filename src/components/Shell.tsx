import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Home, IdCard, Sparkles, Settings, QrCode, WifiOff } from "lucide-react";

export const DISCLAIMER =
  "Emergency Passport provides information access and decision support. It does not replace professional medical judgment.";

export function Ecg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 40" className={className} fill="none" aria-hidden>
      <path
        className="ecg-path"
        d="M0 20h90l10-14 12 28 10-30 10 26 8-10h160"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const u = () => setOnline(navigator.onLine);
    u();
    window.addEventListener("online", u);
    window.addEventListener("offline", u);
    return () => {
      window.removeEventListener("online", u);
      window.removeEventListener("offline", u);
    };
  }, []);
  return online;
}

export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div className="flex items-center justify-center gap-2 bg-foreground px-3 py-2 text-xs font-semibold text-background">
      <WifiOff className="h-4 w-4" /> Offline — showing last saved information
    </div>
  );
}

export function DemoBadge() {
  return (
    <div className="rounded-full bg-accent px-3 py-1 text-center text-[10px] font-bold tracking-widest text-accent-foreground">
      DEMO DATA — NOT REAL PATIENT DATA
    </div>
  );
}

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/passport", label: "My Passport", icon: IdCard },
  { to: "/assist", label: "AI Assist", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Shell({ title, children }: { title: string; children: ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <OfflineBanner />
      <header className="flex items-center gap-2 px-5 pt-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-lg font-black text-primary-foreground">
          ✚
        </span>
        <div className="font-display text-lg font-bold">{title}</div>
        <Ecg className="ml-auto h-6 w-24 text-primary" />
      </header>
      <main className="flex-1 space-y-5 px-5 pb-48 pt-4">
        {children}
        <p className="pt-4 text-center text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md">
        <div className="px-4 pb-2">
          <button
            onClick={() => nav({ to: "/qr" })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand py-3.5 font-display font-extrabold tracking-wide text-primary-foreground shadow-glow"
          >
            <QrCode className="h-5 w-5" /> SHOW EMERGENCY QR
          </button>
        </div>
        <nav className="grid grid-cols-4 border-t bg-card">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              <t.icon className="h-5 w-5" />
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border bg-card p-5 shadow-soft ${className}`}>{children}</div>;
}
