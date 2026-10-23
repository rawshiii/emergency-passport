import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Card, DemoBadge } from "@/components/Shell";
import { BLOOD_GROUPS, fmtDate, savePassport, usePassport, validate, type FieldKey, type Passport } from "@/lib/passport";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "My Passport — Emergency Passport" },
      { name: "description", content: "Edit your emergency medical details and choose what responders can see." },
      { property: "og:title", content: "My Passport — Emergency Passport" },
      { property: "og:description", content: "Progressive disclosure: you decide what a responder can see." },
    ],
  }),
  component: PassportPage,
});

const toggles: [FieldKey, string][] = [
  ["bloodGroup", "Blood group"],
  ["allergies", "Allergies"],
  ["medications", "Medications"],
  ["contact", "Emergency contact"],
  ["conditions", "Conditions"],
  ["history", "Medical history"],
  ["sensitive", "Sensitive information"],
];

const input = "w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring";

function PassportPage() {
  const stored = usePassport();
  const [p, setP] = useState<Passport | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (stored && !p) setP(stored);
  }, [stored, p]);
  if (!p) return <Shell title="My Passport">{null}</Shell>;
  const set = (k: keyof Passport, v: string) => setP({ ...p, [k]: v });

  const save = () => {
    const e = validate(p);
    setErr(e);
    if (e) return;
    const next = { ...p, verifiedAt: new Date().toISOString() };
    savePassport(next);
    setP(next);
    setMsg(`✓ Passport verified · Last verified: ${fmtDate(next.verifiedAt)}`);
  };

  const text = (k: keyof Passport, label: string, ph = "") => (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input className={input} value={p[k] as string} maxLength={300} placeholder={ph} onChange={(e) => set(k, e.target.value)} />
    </label>
  );

  return (
    <Shell title="My Passport">
      {p.demo && <DemoBadge />}
      <Card className="space-y-3">
        {text("name", "Full name")}
        <label className="block space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Blood group</span>
          <select className={input} value={p.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>
            <option value="">Unknown</option>
            {BLOOD_GROUPS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        {text("allergies", "Allergies", "e.g. Penicillin")}
        {text("medications", "Medications")}
        {text("conditions", "Conditions")}
        {text("contactName", "Emergency contact name")}
        {text("contactPhone", "Emergency contact phone", "+91 …")}
      </Card>

      <Card className="space-y-3">
        <div className="font-display text-lg font-bold">Emergency access ≠ unlimited access</div>
        <div className="rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground">
          Progressive Disclosure — You decide what a responder can see.
        </div>
        {toggles.map(([k, l]) => (
          <label key={k} className="flex items-center justify-between py-1">
            <span className="font-semibold">{l}</span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-primary"
              checked={p.visibility[k]}
              onChange={(e) => setP({ ...p, visibility: { ...p.visibility, [k]: e.target.checked } })}
            />
          </label>
        ))}
        <p className="text-xs text-muted-foreground">Note: Enabled fields are inside the QR link, not encrypted.</p>
      </Card>

      {err && <div className="rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">{err}</div>}
      {msg && <div className="rounded-xl bg-accent p-3 text-sm font-bold text-accent-foreground">{msg}</div>}
      <button onClick={save} className="w-full rounded-2xl bg-foreground py-3.5 font-bold text-background">
        Save & verify
      </button>
    </Shell>
  );
}
