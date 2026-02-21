import { ParkingSession, User, Zone } from "./types";

export type ProviderResult = { externalRef: string; amountCents: number };

export interface ParkingProvider {
  purchase(input: { user: User; _carPlate: string; zone: Zone; durationMinutes: number }): Promise<ProviderResult>;
  renew(input: { session: ParkingSession; _carPlate: string; zone: Zone; durationMinutes: number }): Promise<ProviderResult>;
}

class DemoParkingProvider implements ParkingProvider {
  async purchase({ user, _carPlate, zone, durationMinutes }: { user: User; _carPlate: string; zone: Zone; durationMinutes: number }) {
    const amountCents = Math.ceil((zone.rate_cents_per_hour * durationMinutes) / 60);
    const externalRef = `demo-${user.id}-${Date.now()}`;
    return { externalRef, amountCents };
  }

  async renew({ session, zone, durationMinutes }: { session: ParkingSession; _carPlate: string; zone: Zone; durationMinutes: number }) {
    const amountCents = Math.ceil((zone.rate_cents_per_hour * durationMinutes) / 60);
    const externalRef = `renew-${session.id}-${Date.now()}`;
    return { externalRef, amountCents };
  }
}

export function getProvider(name: string): ParkingProvider {
  if (name === "DemoParkingProvider") return new DemoParkingProvider();
  throw new Error(`Unsupported provider ${name}`);
}
