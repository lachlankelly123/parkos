/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

type Session = { endTime: string; status: string; amountCents: number };

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, setSession] = useState<Session | null>(null);
  const [now, setNow] = useState(0);
  const [id, setId] = useState("");
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setNow(new Date().getTime());
    const timer = setInterval(async () => {
      const res = await fetch(`/api/session/${id}`);
      const data = await res.json();
      setSession(data.session);
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [id]);

  if (!session) return <main>Loading session...</main>;
  const leftMs = new Date(session.endTime).getTime() - now;
  const leftMin = Math.max(0, Math.floor(leftMs / 60000));
  return <main><h2>Parking active</h2><p>Status: {session.status}</p><p>Time remaining: {leftMin} min</p><p>Amount: ${(session.amountCents/100).toFixed(2)}</p></main>;
}
