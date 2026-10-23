import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card } from "@/components/Shell";
import { loadPassport, savePassport, type Passport } from "@/lib/passport";

export const Route = createFileRoute("/assist")({
  head: () => ({
    meta: [
      { title: "AI Assist — Emergency Passport" },
      { name: "description", content: "Turn long medical documents into a verified emergency summary." },
      { property: "og:title", content: "AI Assist — Emergency Passport" },
      { property: "og:description", content: "8 pages to a 15-second emergency brief." },
    ],
  }),
  component: Assist,
});

const STEPS = ["MEDICAL DOCUMENT", "AI EXTRACTION", "USER VERIFICATION", "EMERGENCY SUMMARY"];
type Item = { key: keyof Passport; label: string; value: string; status: "pending" | "ok" | "no" };
const FAKE: Item[] = [
  { key: "allergies", label: "Allergy", value: "Penicillin", status: "pending" },
  { key: "conditions", label: "Condition", value: "Asthma", status: "pending" },
  { key: "medications", label: "Medication", value: "Salbutamol inhaler", status: "pending" },
  { key: "contactPhone", label: "Contact", value: "+91 XXXXX XXXXX", status: "pending" },
];

function Assist() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);

  const extract = () => {
    setStep(1);
    setTimeout(() => {
      setItems(FAKE.map((i) => ({ ...i })));
      setStep(2);
    }, 1400);
  };
  const upd = (i: number, patch: Partial<Item>) => setItems(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const saveApproved = () => {
    const p = loadPassport();
    const next: Passport = { ...p, verifiedAt: new Date().toISOString() };
    items.filter((i) => i.status === "ok").forEach((i) => ((next as any)[i.key] = i.value.slice(0, 300)));
    savePassport(next);
    nav({ to: "/brief" });
  };

  return (
    <Shell title="AI Assist">
      <ol className="grid grid-cols-4 gap-1.5">
        {STEPS.map((s, i) => (
          <li key={s} className={`rounded-xl p-2 text-center text-[9px] font-extrabold leading-tight ${i <= step ? "bg-gradient-brand text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Card className="space-y-4">
          <div className="font-display text-lg font-bold">Pick a medical document</div>
          <p className="text-sm text-muted-foreground">Your file stays on this device — it is never uploaded.</p>
          <input
            type="file"
            accept=".pdf,image/*,.txt"
            onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")}
            className="block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-bold file:text-secondary-foreground"
          />
          <button onClick={extract} disabled={!file} className="w-full rounded-2xl bg-foreground py-3 font-bold text-background disabled:opacity-40">
            Extract key information
          </button>
          <button onClick={() => { setFile("sample-discharge-summary.pdf"); extract(); }} className="w-full text-sm font-semibold text-primary">
            Try with a sample document
          </button>
        </Card>
      )}

      {step === 1 && (
        <Card className="text-center">
          <div className="animate-pulse font-display text-lg font-bold text-primary">Reading {file}…</div>
        </Card>
      )}

      {step >= 2 && (
        <Card className="space-y-3">
          <div className="rounded-xl bg-accent p-3 text-sm font-semibold text-accent-foreground">
            AI found potentially important information. Please verify before saving.
          </div>
          {items.map((it, i) => (
            <div key={it.key} className={`space-y-2 rounded-2xl border p-3 ${it.status === "no" ? "opacity-50" : ""}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{it.label}</div>
              <input className="w-full rounded-xl border bg-background px-3 py-2" value={it.value} maxLength={300} onChange={(e) => upd(i, { value: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => upd(i, { status: "ok" })} className={`rounded-xl py-2 text-sm font-bold ${it.status === "ok" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>✓ Approve</button>
                <button onClick={() => upd(i, { status: "no" })} className={`rounded-xl py-2 text-sm font-bold ${it.status === "no" ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>✕ Reject</button>
              </div>
            </div>
          ))}
          <button onClick={saveApproved} disabled={!items.some((i) => i.status === "ok")} className="w-full rounded-2xl bg-foreground py-3 font-bold text-background disabled:opacity-40">
            Save approved & view brief
          </button>
        </Card>
      )}
    </Shell>
  );
}
