export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  phoneEncrypted?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  createdAt: string;
};

export type Car = {
  id: string;
  userId: string;
  plateEncrypted: string;
  label: string;
  isDefault: boolean;
};

export type ParkingSession = {
  id: string;
  userId: string;
  carId: string;
  zoneId: string;
  provider: string;
  startTime: string;
  endTime: string;
  amountCents: number;
  status: "active" | "expired" | "failed";
  externalReference: string;
  durationMinutes: number;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  userId: string;
  action: string;
  metadataJson: string;
  createdAt: string;
};

export type DbShape = {
  users: User[];
  cars: Car[];
  sessions: ParkingSession[];
  auditLogs: AuditLog[];
};

export type Zone = {
  id: string;
  name: string;
  provider: string;
  rate_cents_per_hour: number;
  bbox: [number, number, number, number];
};
