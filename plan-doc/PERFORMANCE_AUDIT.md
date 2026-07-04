# PERFORMANCE AUDIT — Full Codebase (IELTS Ace)

**Mode:** Read-only audit. No source was changed for this document. Implementation waits for approval.
**Date:** 2026-07-04
**Supersedes/expands:** the earlier scoped audit (paid-learning core). The money-path **Correctness Risks** from that pass are preserved verbatim in §7 so nothing is lost.

> ### ⚠️ CORRECTIONS (added after implementation — read before acting on FE-1)
> 1. **The FE-1 font finding was wrong.** Fraunces and Inter are **variable fonts**, so `next/font` ships one file *per unicode-range subset*, **not per weight** — the "412 kB / 13 files" is what's on disk, but an English page only downloads the **`latin` subset (~132 kB, 3 files)**; the cyrillic/greek/vietnamese files are never fetched (unicode-range gated). **Trimming the weight array is a no-op** and was implemented but saved ~0 kB. next/font had already optimised this correctly. The only real lever is dropping Fraunces *italic* (~40 kB), which we kept for design. Treat the "~160 kB / 40% saving" below as **retracted**.
> 2. **The site has since grown well beyond this audit's snapshot.** It now has interactive client tools (`/practice`, `/listening`, `/calculator`, `/study-plan` — small client JS each) and **remote `<img>` images** (Unsplash/pravatar, ~13 on the homepage). The relevant *live* perf item today is therefore **FE-4 (image discipline)**, not fonts: those `<img>` tags should become `next/image` + a `next.config` `remotePatterns` entry to auto-serve resized WebP/AVIF — the genuine Bangladesh-low-bandwidth win now.

---

## 0. Scope reality check (read first — it changes every finding)

The brief assumes a large server application (SQL query plans, Redis, queues, background jobs, API endpoints, connection pools, workers, containers). **None of that exists in the live codebase.** What is actually deployable today:

| Brief assumes | Actually present |
|---|---|
| SQL DB + query plans + indexes | **No live DB.** Only an orphan Mongoose skeleton, excluded from the build. |
| Redis / query / response cache | **None.** Static pages are CDN-cacheable by default. |
| Queues / background jobs / workers | **None.** |
| API endpoints, serialization, DTO validation | **None live.** (One orphan `route.ts`, excluded.) |
| Connection pooling, container config | **None.** No `next.config.js`, no Dockerfile, no `vercel.json`. |
| Heavy frontend, client JS, hydration | **Zero app hydration JS** — every route is a Server Component. |

**What the live app really is:** a statically-prerendered Next.js 15 / React 19 marketing site — 6 routes (`/`, `/login`, `/signup`, `/teacher`, `/blog`, `/_not-found`), all Server Components, plus `globals.css` and self-hosted fonts.

Consequently, most of the brief's investigation areas are **Not Applicable** and I will not fabricate findings for them (§8 lists them explicitly). The audit concentrates where real cost exists: **asset/font payload and static-render config.** This matters more than usual because the Bangladesh research (`plan-doc/BANGLADESH_UX_RESEARCH.md`) established that **mobile data cost is a first-class affordability barrier** for our users — so bytes-over-the-wire is the metric that counts.

---

## 1. Measured baseline (real numbers, this build)

- **First Load JS:** ~105 kB shared, per route +148 B. (Next/React framework baseline; near-irreducible.)
- **App hydration JS from our code:** **0** — no `"use client"` anywhere.
- **CSS shipped:** 1 file, **44 kB** (unminified-source 345 lines; Next minifies in prod).
- **Fonts shipped:** **13 × `.woff2` = 412 kB total** (largest single 84 kB). ⟵ *the headline number*
- **Routes:** 5 static (`○`), **1 dynamic (`ƒ`): `/signup`**.
- **Dependencies:** 3 (`next`, `react`, `react-dom`) — minimal, healthy. No bloat.
- **Images:** none yet (photo slots are CSS/SVG placeholders); `next/image` not used.

**How to capture real field numbers (do this before/after any fix):** Lighthouse mobile (throttled 3G/4x-CPU) on `/`, WebPageTest from a Dhaka test node, and the Network tab's total transfer + font bytes. The font fix's impact is best measured as **total KB transferred on first visit** and **CLS**, not JS time.

---

## 2. Frontend / asset findings (the real surface), ROI-tagged

### FE-1 — Font payload ⟵ ❌ RETRACTED (see corrections at top). Actual transfer ≈132 kB latin subset; weight-trim is a no-op for variable fonts.
**Location:** `app/layout.tsx` — `Fraunces({ weight: ["400","500","600","700"], style: ["normal","italic"] })` + `Inter({ weight: ["400","500","600","700","800"] })`.
**What it is:** We request **8 Fraunces instances** (4 weights × normal+italic) and **5 Inter instances** = 13 static font files, 412 kB.
**Root cause:** Requesting more named instances than the design uses. Audit of actual usage in `globals.css`:
- **Fraunces** is used at weight **400** (quotes, italic tagline/quote-mark), **600** (all headings), **700** (numerals: prices, stats, step numbers). Weight **500 is never used.** Italic is used **only at 400** (the `.serif` tagline + quote mark) — headings/numerals are upright.
- **Inter** is used at **400** (body), **600** (nav, buttons), **700** (list ticks, headings), **800** (eyebrows, brand, tags, rating). Weight **500 is never used.** No italic.
**Estimated impact:** Trimming to Fraunces `{normal:400,600,700 + italic:400}` (4 files) and Inter `{400,600,700,800}` (4 files) → **13 → ~8 files, ~412 → ~250 kB (~40%, ~160 kB saved on first visit).** On a throttled 3G Dhaka connection (~400 kbps effective) that's roughly **~3 s → ~1.8 s** of font transfer, and a direct **~160 kB less mobile data per new visitor** — the exact cost the BD research flagged. `font-display: swap` already prevents invisible text, so the win is **CLS + data cost + final paint**, not blocking. **Confidence: High** (byte math is deterministic; the ms is Med).
**Recommended fix:** Drop unused weights/styles (above). Optionally go further: Fraunces is a **variable** font — omitting `weight` to ship a single variable file can cover all weights in ~one download (test both; static-4 vs variable-1). Keep `subsets:["latin"]` (already set). Preload only the two above-the-fold faces if needed.
**Blast radius:** Very low — purely which instances are fetched; visual result is identical since unused weights are removed. No markup/CSS change required.

### FE-2 — `/signup` is server-rendered on every request (not static) 🟡 LOW impact / LOW risk
**Location:** `app/signup/page.tsx` — `async` page awaiting `searchParams` to toggle the `?plan=premium` copy.
**What it is:** Reading `searchParams` opts the route out of static prerendering (`ƒ` Dynamic), so it can't be served purely from the CDN edge cache like the other pages.
**Impact:** A tiny per-request server render instead of a static hit. For a marketing page this is negligible today, but it forgoes free full-page CDN caching. **Confidence: High** (it's why the build marks it `ƒ`).
**Recommended fix:** Either (a) make it static and read the plan flag on the client (small `"use client"` island — but that adds hydration JS, a worse trade for one headline), or (b) leave it — the cost is trivial. **Recommendation: leave as-is** unless `/signup` becomes high-traffic; the dynamic render is cheaper than shipping client JS. Documented so it's a conscious choice, not an accident.
**Blast radius:** n/a (no change recommended now).

### FE-3 — No `next.config.js`: missing a few cheap prod levers 🟡 LOW impact / LOW risk
**Location:** project root (absent).
**What it is:** Running on defaults. Defaults are mostly good (gzip/brotli via the host, SWC minify, CSS minify). But there's no place to configure `images` (formats/sizes) for when real photos land, no explicit `compress`, no cache-header tuning.
**Impact:** No regression today; it's a **readiness gap**. When photo slots become real `<img>`s, absence of an image pipeline will bite (see FE-4). **Confidence: High.**
**Recommended fix:** Add a minimal `next.config.js` when we introduce images, configuring `images.formats: ['image/avif','image/webp']`. Not urgent.
**Blast radius:** Low.

### FE-4 — Image discipline for the photo slots (preventive) 🟢 HIGH future impact / LOW risk
**Location:** `app/_components/site.tsx` `PhotoSlot`, used in hero, 3 editorial rows, avatars, CTA.
**What it is:** Slots are currently pure CSS/SVG (0 image bytes — good). The moment real photography is dropped in, unoptimized `<img>` tags would be the single largest payload on the site (photos dwarf 412 kB of fonts).
**Impact:** Preventive. Getting this right is the difference between a fast and a slow site for BD mobile. **Confidence: High.**
**Recommended fix:** When swapping in photos, use **`next/image`** (AVIF/WebP, responsive `sizes`, lazy-load below the fold, explicit width/height to avoid CLS). Serve appropriately small dimensions — the hero slot is 1200×1500 but should ship a mobile-sized variant. This directly implements the BD research's WebP/low-bandwidth guidance.
**Blast radius:** Low, but must be done at swap-in time, not after.

### FE-5 — CSS is a single 44 kB stylesheet 🟡 LOW impact / LOW risk
**Location:** `app/globals.css` (345 lines).
**What it is:** One global stylesheet, minified in prod, covering all routes. 44 kB is a touch large for a landing page but well within norms; it's render-blocking but small and cached after first load.
**Impact:** Minor. Not worth splitting (route-level CSS would add complexity for little gain at this size). **Confidence: High.**
**Recommended fix:** None now. Revisit only if it grows past ~80–100 kB. Avoid premature optimization.
**Blast radius:** n/a.

---

## 3. Application / server layer

**Nothing to optimize in the live path.** All routes are Server Components rendering static markup; there is no per-request data fetching, serialization, validation, DI, or event handling in production code. Dependency count is minimal (3). No `REQUEST`-scoped providers, no serialization cost, no N+1 — because there are no queries. This is the *good* kind of empty.

---

## 4. Database

**No live database.** Query plans, index usage, composite indexes, eager loading, pagination, aggregates, bulk ops — **all N/A** for the deployed app. The only DB code is the orphan Mongoose skeleton (`index.ts`, `route.ts`, `user.model.ts`, `bkash.provider.ts`), which is **excluded from the build** (`tsconfig.json`) and never executed. Its access-pattern issues are catalogued in §7 (they become live only if that code is wired up).

---

## 5. Caching / Queues / API / Infra

- **Caching:** Static routes are inherently CDN/edge-cacheable (immutable hashed assets, prerendered HTML). No Redis needed at this stage. **N/A.**
- **Queues / background jobs:** none. **N/A.**
- **API performance / payload / serialization:** no live endpoints. **N/A.**
- **Infrastructure:** no deployment config present. When deploying (e.g., Vercel), static export + edge CDN is the correct, cheap target. Connection pooling/workers are **N/A** until a backend exists.

---

## 6. Orphan backend skeleton (not live — flagged for completeness)

`route.ts`, `index.ts`, `bkash.provider.ts`, `user.model.ts` are excluded from the build and import a `lib/db` layer that doesn't exist. **They do not run.** Their *performance* characteristics (if wired):
- `hasActivePremium` (`index.ts:5-17`) does a Mongo `findOne` **per access check** — a per-request round-trip with no request-scoped memoization (N gates → N identical reads).
- Hot queries (`providerPaymentId` lookup, subscription filter) need indexes that can't be confirmed (models absent).
- bKash provider mints a fresh access token on **every** create/execute call (`bkash.provider.ts:14`) — an avoidable external round-trip; no timeout/abort on `fetch`.

These are **future** concerns. Do not spend effort here until the backend is real.

---

## 7. CORRECTNESS RISKS (money + access) — preserved, still binding if the backend is wired

> These are **not** perf wins; they are must-fix-before-launch defects in the orphan payment/entitlement code. Kept here so they aren't lost when that code goes live.

- **CR-1 🔴 Unauthenticated callback** — `route.ts:5-21` executes any payment from an unauthenticated body `paymentID`; no session/ownership/signature check.
- **CR-2 🔴 Non-idempotent, non-transactional grant** — `route.ts:13-56`: racy "already completed?" read → concurrent/retried callbacks can call bKash `executePayment` twice (double-charge); subscription upsert + payment update aren't in one transaction (torn write → re-grant).
- **CR-3 🟠 No amount/currency verification** — gateway result trusted without checking settled amount against the stored payment.
- **CR-4 🟡 Renewal resets period** — `route.ts:32` sets `currentPeriodEnd = now+30d`, silently losing remaining paid time.
- **CR-5 Paywall/preview & CR-7 submission integrity** — the media-serving, test, and grading layers don't exist yet; audit when built (answer-key leak, durable/idempotent submissions, signed-URL gating).

Any performance work on payments **must not** weaken these (atomicity, idempotency, access control before speed).

---

## 8. Explicitly N/A (so the brief's checklist is accounted for, not silently skipped)

SQL query plans · index usage · composite indexes · eager loading · aggregate queries · bulk operations · Redis · query/response cache · cache invalidation · queues · retry policies · batch jobs · queue throughput · API payload/serialization · HTTP endpoint timings · connection pooling · worker config · container optimization — **none present in the live codebase.** Bundle/lazy-load/asset/render — covered in §2.

---

## 9. Bottom line

~~There is exactly one high-ROI performance fix… trim the font payload~~ — **retracted** (see corrections at top; fonts were already optimal). The real live perf item now that images have been added is **FE-4: convert the remote `<img>` tags to `next/image` + `next.config` `remotePatterns`** so photos are served as resized WebP/AVIF — the genuine Bangladesh-low-bandwidth win. Everything else is a conscious trivial trade (FE-2) or genuinely absent (backend/DB/queues). The codebase is still small and clean; the honest recommendation remains a **surgical fix, not a refactor.**
