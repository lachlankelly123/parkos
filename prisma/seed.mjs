import fs from "node:fs";
import path from "node:path";

const zonesPath = path.join(process.cwd(), "data", "zones.json");
const zones = JSON.parse(fs.readFileSync(zonesPath, "utf8"));
console.log(`Loaded ${zones.length} zones. Runtime reads zones.json directly for MVP.`);
