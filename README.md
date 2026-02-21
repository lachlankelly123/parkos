# Help Me Park (MVP)

Help Me Park is a demo MVP where a parked user presses **Help me park** and buys parking for the detected zone.

## Features
- Auth with email + password (`/login`)
- One-time setup (`/setup`) for name, phone, default car, and mock Stripe vaulting
- Main flow (`/app`) with GPS or manual lat/lng, zone lookup from `data/zones.json`
- Intent phrase to duration mapper (`quick errand`, `coffee`, `dinner date`, `movie`, default)
- Confirmation and purchase (`/park/confirm`)
- Session receipt/countdown (`/session/:id`)
- Demo provider portal (`/provider-portal`) and adapter abstraction
- Worker sends SMS reminder 10 mins before expiry; webhook handles YES renewals
- Audit logs for purchase attempts in `data/db.json`

> Demo provider portal and automation are **demo only**.

## Monorepo layout
- `app/` Next.js web app + API routes
- `lib/` shared logic (auth, encryption, provider adapter, rate limit, zones)
- `worker/` reminder worker
- `agent/providers/demo/` demo automation stub
- `prisma/` schema + seed scaffold
- `data/` zones dataset and JSON persistence file

## One-command-ish local setup
1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install` (or `pnpm install` if preferred)
4. `npm run prisma:migrate`
5. `npm run prisma:seed`
6. Run app and worker in separate terminals:
   - `npm run dev`
   - `npm run worker`

## Environment variables
See `.env.example` for:
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `APP_ENCRYPTION_KEY`
- `BASE_URL`

## Mock mode
- Missing Stripe keys => setup stores mock Stripe IDs.
- Missing Twilio keys => SMS logs to console.

## Tests
- `npm test`
  - intent mapper unit test
  - zone lookup integration-ish test
  - purchase flow smoke test (demo provider pricing)

## Adding real providers next
1. Implement `ParkingProvider` in `lib/provider.ts`.
2. Add real Playwright automation in `agent/providers/<provider>/`.
3. Add provider-specific credentials env vars.
4. Map zones to the new provider in `data/zones.json`.
5. Move persistence from JSON to Prisma/Postgres runtime implementation.
