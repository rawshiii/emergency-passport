import { useEffect, useState } from "react";

export type FieldKey =
  | "bloodGroup"
  | "allergies"
  | "medications"
  | "contact"
  | "conditions"
  | "history"
  | "sensitive";

export interface Passport {
  name: string;
  bloodGroup: string;
  allergies: string;
  medications: string;
  conditions: string;
  contactName: string;
  contactPhone: string;
  visibility: Record<FieldKey, boolean>;
  token: string;
  verifiedAt: string;
  qrAt?: string;
  demo?: boolean;
}

const KEY = "emergency-passport";
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function makeToken() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return "EP-" + Array.from(a, (n) => chars[n % chars.length]).join("");
}

export function demoPassport(): Passport {
  const now = new Date().toISOString();
  return {
    name: "Rashi Jain",
    bloodGroup: "B+",
    allergies: "Penicillin",
    medications: "Salbutamol inhaler",
    conditions: "Asthma",
    contactName: "Mom (Anita)",
    contactPhone: "+91 XXXXX XXXXX",
    visibility: {
      bloodGroup: true,
      allergies: true,
      medications: true,
      contact: true,
      conditions: false,
      history: false,
      sensitive: false,
    },
    token: makeToken(),
    verifiedAt: now,
    qrAt: now,
    demo: true,
  };
}

export function loadPassport(): Passport {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const p = demoPassport();
  savePassport(p);
  return p;
}

export function savePassport(p: Passport) {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("passport-change"));
}

export function usePassport() {
  const [p, setP] = useState<Passport | null>(null);
  useEffect(() => {
    const sync = () => setP(loadPassport());
    sync();
    window.addEventListener("passport-change", sync);
    return () => window.removeEventListener("passport-change", sync);
  }, []);
  return p;
}

export function validate(p: Passport): string | null {
  if (!p.name.trim() || p.name.length > 80) return "Enter a name (max 80 characters).";
  if (p.bloodGroup && !BLOOD_GROUPS.includes(p.bloodGroup)) return "Choose a valid blood group.";
  for (const k of ["allergies", "medications", "conditions", "contactName"] as const)
    if (p[k].length > 300) return `${k} is too long (max 300 characters).`;
  if (p.contactPhone && !/^\+?[0-9X\s()-]{6,20}$/i.test(p.contactPhone))
    return "Enter a valid phone number.";
  return null;
}

export type VisibleData = Partial<
  Pick<Passport, "name" | "bloodGroup" | "allergies" | "medications" | "conditions" | "contactName" | "contactPhone">
> & { demo?: boolean };

export function visibleData(p: Passport): VisibleData {
  const v = p.visibility;
  const d: VisibleData = { name: p.name };
  if (v.bloodGroup) d.bloodGroup = p.bloodGroup;
  if (v.allergies) d.allergies = p.allergies;
  if (v.medications) d.medications = p.medications;
  if (v.conditions) d.conditions = p.conditions;
  if (v.contact) {
    d.contactName = p.contactName;
    d.contactPhone = p.contactPhone;
  }
  if (p.demo) d.demo = true;
  return d;
}

export function encode(d: VisibleData) {
  const bytes = new TextEncoder().encode(JSON.stringify(d));
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decode(s: string): VisibleData | null {
  try {
    const b = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0))));
  } catch {
    return null;
  }
}

export function qrLink(p: Passport) {
  return `${window.location.origin}/emergency/${p.token}#d=${encode(visibleData(p))}`;
}

export const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
