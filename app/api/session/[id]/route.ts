import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = readDb().sessions.find((s) => s.id === id);
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ session });
}
