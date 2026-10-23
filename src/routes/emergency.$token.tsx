import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DISCLAIMER, Ecg, OfflineBanner } from "@/components/Shell";
import { decode, loadPassport, visibleData, type VisibleData } from "@/lib/passport";

export const Route = createFileRoute("/emergency/$token")({
  head: () => ({
    meta: [
      { title: "🚨 Emergency Passport" },
      { name: "description", content: "Critical medical information shared by the patient for emergency responders." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Emergency Passport" },
      { property: "og:description", content: "Critical information. Available in seconds." },
    ],
  }),
  component: EmergencyPage,
});

function EmergencyPage() {
  const { token } = Route.useParams();
  const [data, setData] = useState<VisibleData | null | undefined>(undefined);
  useEffect(() => {
    const m = window.location.hash.match(/d=([^&]+)/);
    let d = m?.[1] ? decode(m[1]) : null;
    if (!d) {
      try {
        const local = localStorage.getItem("emergency-passport") ? loadPassport() : null;
        if (local && local.token === token) d = visibleData(local);
      } catch {}
    }
    setData(d);
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-brand text-primary-foreground">
      <OfflineBanner />
      <div className="mx-auto max-w-md space-y-4 p-5">
        <div className="text-center font-display text-3xl font-extrabold">🚨 EMERGENCY PASSPORT</div>
        <Ecg className="h-8 w-full" />
        {data === undefined ? null : !data ? (
          <div className="rounded-3xl bg-card p-6 text-center font-bold text-card-foreground">
            Emergency information not found
          </div>
        ) : (
          <div className="space-y-3 rounded-3xl bg-card p-5 text-card-foreground shadow-glow">
            <div className="font-display text-2xl font-extrabold">{data.name}</div>
            <div className="text-xs font-semibold text-muted-foreground">ID: {token}</div>
            {(
              [
                ["🩸 Blood group", data.bloodGroup],
                ["⚠️ Allergies", data.allergies],
                ["💊 Medications", data.medications],
                ["🫁 Conditions", data.conditions],
              ] as const
            ).map(([l, v]) =>
              v ? (
                <div key={l} className="rounded-2xl bg-secondary p-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">{l}</div>
                  <div className="text-xl font-extrabold">{v}</div>
                </div>
              ) : null,
            )}
            {data.contactPhone && (
              <a
                href={`tel:${data.contactPhone.replace(/[^+\d]/g, "")}`}
                className="block rounded-2xl bg-gradient-brand p-4 text-center font-bold text-primary-foreground"
              >
                📞 Call {data.contactName} · {data.contactPhone}
              </a>
            )}
          </div>
        )}
        <p className="text-center font-bold">Critical information. Available in seconds.</p>
        {data?.demo && (
          <p className="text-center text-sm opacity-90">Sample profile for demonstration. Not real patient data.</p>
        )}
        <p className="text-center text-[11px] opacity-80">{DISCLAIMER}</p>
      </div>
    </div>
  );
}
