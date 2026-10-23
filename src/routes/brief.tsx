import { createFileRoute } from "@tanstack/react-router";
import { Shell, Card } from "@/components/Shell";
import { fmtDate, usePassport } from "@/lib/passport";

export const Route = createFileRoute("/brief")({
  head: () => ({
    meta: [
      { title: "Emergency Brief — Emergency Passport" },
      { name: "description", content: "A 15-second summary of your critical medical information." },
      { property: "og:title", content: "Emergency Brief — Emergency Passport" },
      { property: "og:description", content: "8 pages → 15 seconds." },
    ],
  }),
  component: Brief,
});

function Brief() {
  const p = usePassport();
  const rows = [
    ["ALLERGY", p?.allergies],
    ["CONDITION", p?.conditions],
    ["MEDICATION", p?.medications],
    ["CONTACT", p && `${p.contactName} · ${p.contactPhone}`],
    ["LAST VERIFIED", fmtDate(p?.verifiedAt)],
  ];
  return (
    <Shell title="Emergency Brief">
      <div className="rounded-3xl bg-gradient-brand p-6 text-center text-primary-foreground shadow-glow">
        <div className="font-display text-4xl font-extrabold">8 pages → 15 seconds</div>
        <div className="mt-1 text-sm opacity-90">From a long medical file to what matters now.</div>
      </div>
      <Card className="space-y-3">
        <div className="font-display text-xl font-extrabold text-primary">⚡ EMERGENCY BRIEF</div>
        {rows.map(([l, v]) => (
          <div key={l} className="flex justify-between gap-4 border-b pb-2 last:border-0">
            <span className="text-xs font-extrabold tracking-wider text-muted-foreground">{l}</span>
            <span className="text-right font-bold">{v || "—"}</span>
          </div>
        ))}
      </Card>
    </Shell>
  );
}
