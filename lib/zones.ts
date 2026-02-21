import fs from "node:fs";
import path from "node:path";
import { Zone } from "./types";

export function getZones(): Zone[] {
  const zonePath = path.join(process.cwd(), "data", "zones.json");
  return JSON.parse(fs.readFileSync(zonePath, "utf8")) as Zone[];
}

export function findZone(lat: number, lng: number) {
  return getZones().find((z) => {
    const [minLng, minLat, maxLng, maxLat] = z.bbox;
    return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
  });
}
