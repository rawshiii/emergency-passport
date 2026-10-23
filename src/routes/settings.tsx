import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Card, DISCLAIMER } from "@/components/Shell";
import { demoPassport, savePassport } from "@/lib/passport";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Emergency Passport" },
      { name: "description", content: "Install the app, reset demo data and read how your data is stored." },
      { property: "og:title", content: "Settings — Emergency Passport" },
      { property: "og:description", content: "Data lives on this device and in generated QR links." },
    ],
  }),
  component: SettingsPage,
});

type BIP = Event & { prompt: () => Promise<void> };

function SettingsPage() {
  const [prompt, setPrompt] = useState<BIP | null>(null);
  const [done, setDone] = useState("");
  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BIP);
    };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  return (
    <Shell title="Settings">
      <Card className="space-y-1">
        <div className="font-display text-lg font-bold">Emergency Passport</div>
        <p className="text-sm text-muted-foreground">When you can't speak, let your medical information speak for you.</p>
        <p className="text-xs text-muted-foreground">Version 1.0 · Works offline once installed</p>
      </Card>
      <Card className="space-y-3">
        <button
          onClick={async () => {
            if (prompt) {
              await prompt.prompt();
              setPrompt(null);
            } else setDone("Use your browser menu → “Add to Home Screen” to install.");
          }}
          className="w-full rounded-2xl bg-gradient-brand py-3 font-bold text-primary-foreground"
        >
          Install app
        </button>
        <button
          onClick={() => {
            if (confirm("Reset to demo data? Your changes will be lost.")) {
              savePassport(demoPassport());
              setDone("Demo data restored.");
            }
          }}
          className="w-full rounded-2xl border-2 border-primary py-3 font-bold text-primary"
        >
          Reset demo data
        </button>
        {done && <p className="text-center text-sm font-semibold">{done}</p>}
      </Card>
      <Card className="space-y-2 text-sm">
        <div className="font-bold">Your data</div>
        <p className="text-muted-foreground">Data lives on this device and in generated QR links.</p>
        <div className="font-bold">Disclaimer</div>
        <p className="text-muted-foreground">{DISCLAIMER} Information only — no diagnosis or treatment advice.</p>
      </Card>
    </Shell>
  );
}
