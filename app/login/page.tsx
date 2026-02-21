"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit() {
    setError("");
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!res.ok) return setError("Authentication failed");
    router.push("/setup");
  }

  return <main><h1>Help Me Park</h1><p>Login or create account</p><input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><div style={{display:"flex",gap:8,marginTop:8}}><button onClick={submit}>{mode === "signup" ? "Sign up" : "Login"}</button><button onClick={()=>setMode(mode==="signup"?"login":"signup")}>Switch to {mode === "signup" ? "login" : "signup"}</button></div><p style={{color:"red"}}>{error}</p></main>;
}
