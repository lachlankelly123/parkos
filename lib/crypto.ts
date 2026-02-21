import crypto from "node:crypto";

const KEY = process.env.APP_ENCRYPTION_KEY || "dev-only-32-byte-key-123456789012";

function getKey() {
  return crypto.createHash("sha256").update(KEY).digest();
}

export function encrypt(plain: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(value?: string) {
  if (!value) return "";
  const [ivHex, encryptedHex] = value.split(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), Buffer.from(ivHex, "hex"));
  const plain = Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]);
  return plain.toString("utf8");
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 200000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const next = crypto.pbkdf2Sync(password, salt, 200000, 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(next));
}
