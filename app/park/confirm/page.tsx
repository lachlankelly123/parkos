"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { mapIntentToDuration } from "@/lib/intent";
import zones from "@/data/zones.json";

export default function ConfirmPage() {
  const search = useSearchParams();
  const router = useRouter();
  const zoneId = search.get("zoneId") || "";
  const intent = search.get("intent") || "";
  const zone = useMemo(() => zones.find((z) => z.id === zoneId), [zoneId]);
  const [duration, setDuration] = useState(mapIntentToDuration(intent));

  if (!zone) return <main>Zone missing</main>;

  async function buy() {
    const res = await fetch("/api/park/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ zoneId: zone.id, durationMinutes: duration }) });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "failed");
    router.push(data.redirect);
  }

  return <main><h2>Confirm parking</h2><p>Zone: {zone.name}</p><p>Provider: {zone.provider}</p><p>Rate: ${(zone.rate_cents_per_hour/100).toFixed(2)}/hr</p><label>Duration minutes</label><input value={duration} onChange={(e)=>setDuration(Number(e.target.value))} /><button onClick={buy}>Buy parking</button></main>;
}
