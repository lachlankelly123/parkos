import { NextResponse } from "next/server";
import { findZone } from "@/lib/zones";

export async function POST(req: Request) {
  const { lat, lng } = await req.json();
  const zone = findZone(Number(lat), Number(lng));
  if (!zone) return NextResponse.json({ error: "Zone not supported" }, { status: 404 });
  return NextResponse.json({ zone });
}
