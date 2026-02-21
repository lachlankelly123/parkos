import fs from "node:fs";
import path from "node:path";
import { DbShape } from "./types";

const dbPath = path.join(process.cwd(), "data", "db.json");

export function readDb(): DbShape {
  return JSON.parse(fs.readFileSync(dbPath, "utf8")) as DbShape;
}

export function writeDb(db: DbShape) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
