import { decrypt } from "../lib/crypto";
import { readDb, writeDb } from "../lib/db";
import { sendSms } from "../lib/sms";

setInterval(async () => {
  const db = readDb();
  const now = Date.now();
  for (const session of db.sessions) {
    if (session.status !== "active") continue;
    const msLeft = new Date(session.endTime).getTime() - now;
    if (msLeft <= 0) {
      session.status = "expired";
      continue;
    }
    if (msLeft <= 10 * 60_000 && !session.reminderSentAt) {
      const user = db.users.find((u) => u.id === session.userId);
      if (user?.phoneEncrypted) {
        const hhmm = new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        await sendSms(decrypt(user.phoneEncrypted), `Parking expires at ${hhmm}. Reply YES to renew for ${session.durationMinutes} minutes, or NO.`);
      }
      session.reminderSentAt = new Date().toISOString();
    }
  }
  writeDb(db);
}, 15000);

console.log("Worker started");
