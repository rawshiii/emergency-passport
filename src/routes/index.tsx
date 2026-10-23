import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Card, DemoBadge, Ecg } from "@/components/Shell";
import { usePassport } from "@/lib/passport";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Emergency Passport — Home" },
      { name: "description", content: "When you can't speak, let your medical information speak for you." },
      { property: "og:title", content: "Emergency Passport" },
      { property: "og:description", content: "Your critical medical info, one QR scan away." },
    ],
  }),
  component: Home,
});

function Home() {
  const p = usePassport();
  return (
    <Shell title="Emergency Passport">
      <p className="text-sm text-muted-foreground">
        When you can't speak, let your medical information speak for you.
      </p>
      {p?.demo && <DemoBadge />}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-xl font-extrabold">
            Emergency Passport — <span className="text-primary">ACTIVE ✓</span>
          </div>
          <div className="text-xs font-semibold text-muted-foreground">ID: {p?.token ?? "…"}</div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-6 text-primary-foreground shadow-glow">
        <div className="font-display text-2xl font-extrabold">{p?.name}</div>
        <Ecg className="mb-3 h-8 w-full opacity-70" />
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["🩸", "Blood", p?.bloodGroup],
            ["⚠️", "Allergy", p?.allergies],
            ["💊", "Medication", p?.medications],
            ["📞", "Contact", p && `${p.contactName}`],
          ].map(([i, l, v]) => (
            <div key={l} className="rounded-2xl bg-primary-foreground/15 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                {i} {l}
              </div>
              <div className="mt-1 font-bold">{v || "—"}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/passport" className="rounded-2xl border-2 border-primary py-3 text-center font-bold text-primary">
          Edit Passport
        </Link>
        <Link to="/assist" className="rounded-2xl bg-secondary py-3 text-center font-bold text-secondary-foreground">
          AI Assist
        </Link>
      </div>
      <Card>
        <div className="text-sm text-muted-foreground">
          Responders scan your QR and see only what you've chosen to share.
        </div>
      </Card>
    </Shell>
  );
}
