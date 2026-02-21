"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppPage() {
  const router = useRouter();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [intent, setIntent] = useState("coffee");

  function detectGeo() {
    navigator.geolocation.getCurrentPosition((p) => {
      setLat(String(p.coords.latitude));
      setLng(String(p.coords.longitude));
    });
  }

  async function go() {
    const res = await fetch("/api/zones/lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lat: Number(lat), lng: Number(lng) }) });
    if (!res.ok) return alert("Zone not supported");
    const data = await res.json();
    router.push(`/park/confirm?zoneId=${data.zone.id}&intent=${encodeURIComponent(intent)}`);
  }

  return <main><h2>Help me park</h2><button onClick={detectGeo}>Use GPS</button><p>or manual location</p><input placeholder="lat" value={lat} onChange={(e)=>setLat(e.target.value)} /><input placeholder="lng" value={lng} onChange={(e)=>setLng(e.target.value)} /><input placeholder="intent phrase" value={intent} onChange={(e)=>setIntent(e.target.value)} /><button style={{fontSize:24,padding:12,marginTop:8}} onClick={go}>Help me park</button></main>;
}
