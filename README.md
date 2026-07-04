# IELTS Platform — backend spine (Slice 00 build)

> This is the runnable **foundation**, not a finished product. The data model,
> auth, entitlements, and bKash payment flow are wired. UI and the test-taking
> engine (question rendering, raw→band scoring, W/S grading) are later slices.

## What's here
- **Data model** — all 10 Mongoose models with indexes (`lib/db/models/`)
- **DB** — cached mongoose connection (`lib/db/mongoose.ts`)
- **Auth** — Auth.js v5 + Mongo adapter, Google provider (`lib/auth/`)
- **Payments** — `PaymentProvider` interface + bKash tokenized-checkout skeleton
  (`lib/payments/`) and route handlers (`app/api/payments/bkash/*`)
- **Entitlements** — freemium gating (`lib/entitlements/`)
- **Actions** — `startAttempt`, `submitAttempt`, `markLessonComplete`
- **Seed** — minimal free course/lesson/test (`scripts/seed.ts`)

## Run
```bash
npm install
cp .env.example .env.local   # fill in values; run `npx auth secret` for AUTH_SECRET
# start a local MongoDB (or point MONGODB_URI at Atlas)
npm run seed
npm run dev
```

## Not run/verified here
I generated these files but did **not** execute them against a live MongoDB or
the bKash sandbox. Before relying on payments: get sandbox creds and confirm the
bKash endpoint/field names against current docs (marked in `bkash.provider.ts`).

## Decisions baked in (change freely)
- Auth.js v5 + Mongo adapter (no Firebase)
- Money stored in integer minor units (poisha)
- Video behind a provider interface, `none` adapter by default
- `examType: academic | general` supported
- Speaking audio is a ref only (storage not wired)

## Suggested next slices
1. **Scoring** — raw→band conversion for L/R (Academic/General tables) + attempt scoring on submit.
2. **Test-taking UI** — render questions per type, save answers, submit.
3. **W/S grading** — submission queue + evaluation (ai/human/self).
4. **Billing UI** — pricing page + the create→redirect→callback loop end-to-end.
5. **Admin CMS** — author courses/lessons/tests/questions.
