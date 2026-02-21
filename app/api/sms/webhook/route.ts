import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { newId, readDb, writeDb } from "@/lib/db";
import { getProvider } from "@/lib/provider";
import { getZones } from "@/lib/zones";

export async function POST(req: Request) {
  const form = await req.formData();
  const from = String(form.get("From") || "");
  const body = String(form.get("Body") || "").trim().toUpperCase();
  if (!checkRateLimit(`sms:${from}`, 10, 60_000)) return NextResponse.json({ ok: false }, { status: 429 });

  const db = readDb();
  const user = db.users.find((u) => u.phoneEncrypted);
  const session = db.sessions.filter((s) => s.status === "active").at(-1);
  if (!user || !session) return NextResponse.json({ ok: true });

  if (body === "YES") {
    const zone = getZones().find((z) => z.id === session.zoneId)!;
    const provider = getProvider(zone.provider);
    const result = await provider.renew({ session, carPlate: "", zone, durationMinutes: session.durationMinutes });
    const newEnd = new Date(new Date(session.endTime).getTime() + session.durationMinutes * 60_000);
    session.endTime = newEnd.toISOString();
    session.externalReference = result.externalRef;
    session.amountCents += result.amountCents;
    db.auditLogs.push({ id: newId("audit"), userId: user.id, action: "renew_success", metadataJson: JSON.stringify({ sessionId: session.id }), createdAt: new Date().toISOString() });
    writeDb(db);
  }
  return NextResponse.json({ ok: true });
}
