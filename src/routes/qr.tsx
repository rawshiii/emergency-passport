import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Shell, Card, DemoBadge } from "@/components/Shell";
import { qrLink, savePassport, usePassport } from "@/lib/passport";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "Emergency QR — Emergency Passport" },
      { name: "description", content: "Scan in an emergency to see critical medical information." },
      { property: "og:title", content: "Emergency QR — Emergency Passport" },
      { property: "og:description", content: "Critical information can be accessed without logging in." },
    ],
  }),
  component: QrPage,
});

function QrPage() {
  const p = usePassport();
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (p) setLink(qrLink(p));
  }, [p]);
  const stale = p && (!p.qrAt || p.verifiedAt > p.qrAt);

  return (
    <Shell title="Emergency QR">
      {p?.demo && <DemoBadge />}
      <Card className="space-y-4 text-center">
        <div className="font-display text-2xl font-extrabold tracking-wide text-primary">SCAN IN AN EMERGENCY</div>
        <div className="mx-auto w-fit rounded-3xl border-4 border-primary bg-card p-4">
          {link && <QRCodeSVG value={link} size={240} fgColor="#3a2a2c" level="M" />}
        </div>
        <div className="font-display text-lg font-bold">{p?.token}</div>
        <p className="text-sm text-muted-foreground">Critical information can be accessed without logging in.</p>
        {stale && (
          <button
            onClick={() => p && savePassport({ ...p, qrAt: new Date().toISOString() })}
            className="w-full rounded-2xl bg-accent py-3 font-bold text-accent-foreground"
          >
            Your data changed — Regenerate QR
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="rounded-2xl border-2 border-primary py-3 font-bold text-primary"
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
          <a href={link} target="_blank" rel="noreferrer" className="rounded-2xl bg-gradient-brand py-3 font-bold text-primary-foreground">
            Open page
          </a>
        </div>
      </Card>
    </Shell>
  );
}
