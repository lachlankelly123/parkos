import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";
import { newId, readDb, writeDb } from "@/lib/db";

export async function POST(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { name, phone, carLabel, plate } = await req.json();
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
  user.name = name;
  user.phoneEncrypted = encrypt(phone);
  user.stripeCustomerId = process.env.STRIPE_SECRET_KEY ? `cus_${user.id}` : "mock_customer";
  user.stripePaymentMethodId = process.env.STRIPE_SECRET_KEY ? `pm_${Date.now()}` : "mock_payment_method";
  db.cars.push({ id: newId("car"), userId, label: carLabel, plateEncrypted: encrypt(plate), isDefault: true });
  writeDb(db);
  return NextResponse.json({ ok: true });
}
