"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [carLabel, setCarLabel] = useState("My Civic");
  const [plate, setPlate] = useState("");

  async function save() {
    await fetch("/api/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, carLabel, plate }) });
    router.push("/app");
  }

  return <main><h2>One-time setup</h2><input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} /><input placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} /><input placeholder="Car label" value={carLabel} onChange={(e)=>setCarLabel(e.target.value)} /><input placeholder="Plate" value={plate} onChange={(e)=>setPlate(e.target.value)} /><p>Payment method: Stripe mock vault configured for MVP.</p><button onClick={save}>Save setup</button></main>;
}
