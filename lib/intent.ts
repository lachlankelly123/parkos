export function mapIntentToDuration(intent?: string) {
  const normalized = (intent || "").toLowerCase().trim();
  if (normalized === "quick errand") return 30;
  if (normalized === "coffee") return 60;
  if (normalized === "dinner date") return 150;
  if (normalized === "movie") return 180;
  return 120;
}
