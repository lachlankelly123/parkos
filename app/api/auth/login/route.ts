import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/crypto";
import { readDb } from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = readDb().users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  await setAuthCookie(user.id);
  return NextResponse.json({ ok: true });
}
