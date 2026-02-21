"use client";

import { useState } from "react";

export default function ProviderPortal() {
  const [step, setStep] = useState(1);
  const [zone, setZone] = useState("");
  const [plate, setPlate] = useState("");
  const [duration, setDuration] = useState("120");
  return <main><h2>DemoParkingProvider Portal (DEMO ONLY)</h2>{step===1&&<div><p>Step 1: confirm zone</p><input value={zone} onChange={(e)=>setZone(e.target.value)} placeholder="Zone" /><button onClick={()=>setStep(2)}>Next</button></div>}{step===2&&<div><p>Step 2: plate + duration</p><input value={plate} onChange={(e)=>setPlate(e.target.value)} placeholder="Plate" /><input value={duration} onChange={(e)=>setDuration(e.target.value)} placeholder="Duration" /><button onClick={()=>setStep(3)}>Next</button></div>}{step===3&&<div><p>Step 3: Pay now</p><button onClick={()=>alert(`Purchased ${zone} ${plate} ${duration}`)}>Pay now</button></div>}</main>;
}
