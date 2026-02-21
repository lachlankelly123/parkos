import { NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";
import { getAuthUserId } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { newId, readDb, writeDb } from "@/lib/db";
import { getProvider } from "@/lib/provider";
import { getZones } from "@/lib/zones";

export async function POST(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!checkRateLimit(`purchase:${userId}`, 5, 60_000)) return NextResponse.json({ error: "rate limited" }, { status: 429 });
  let zoneId: string;
  let durationMinutes: number;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    zoneId = body.zoneId;
    durationMinutes = Number(body.durationMinutes);
  } else {
    const form = await req.formData();
    zoneId = String(form.get("zoneId"));
    durationMinutes = Number(form.get("durationMinutes"));
  }
  const db = readDb();
  const user = db.users.find((u) => u.id === userId)!;
  const car = db.cars.find((c) => c.userId === userId && c.isDefault) || db.cars.find((c) => c.userId === userId);
  const zone = getZones().find((z) => z.id === zoneId);
  if (!car || !zone) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  try {
    const provider = getProvider(zone.provider);
    const result = await provider.purchase({ user, carPlate: decrypt(car.plateEncrypted), zone, durationMinutes });
    const start = new Date();
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    const session = {
      id: newId("session"),
      userId,
      carId: car.id,
      zoneId: zone.id,
      provider: zone.provider,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      amountCents: result.amountCents,
      status: "active" as const,
      externalReference: result.externalRef,
      durationMinutes,
      createdAt: new Date().toISOString(),
    };
    db.sessions.push(session);
    db.auditLogs.push({ id: newId("audit"), userId, action: "purchase_success", metadataJson: JSON.stringify({ zoneId, durationMinutes }), createdAt: new Date().toISOString() });
    writeDb(db);
    return NextResponse.json({ sessionId: session.id, redirect: `/session/${session.id}` });
  } catch (error) {
    db.auditLogs.push({ id: newId("audit"), userId, action: "purchase_fail", metadataJson: JSON.stringify({ zoneId, durationMinutes, error: String(error) }), createdAt: new Date().toISOString() });
    writeDb(db);
    return NextResponse.json({ error: "purchase failed" }, { status: 500 });
  }
}
