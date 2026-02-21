import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/crypto";
import { newId, readDb, writeDb } from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    return NextResponse.json({ error: "Email exists" }, { status: 400 });
  }
  const user = {
    id: newId("user"),
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  await setAuthCookie(user.id);
  return NextResponse.json({ ok: true });
}
