# PERFORMANCE PLAN — Full Codebase (IELTS Ace)

**Mode:** Plan only. No code changed. Awaiting approval before implementation.
**Companion:** `PERFORMANCE_AUDIT.md` (full findings, real measurements, confidence).

> **Honest framing.** The live app is a small, clean, statically-rendered Next.js marketing site with **zero app hydration JS** and **no backend in the request path**. There is essentially **one** worthwhile performance change today. This plan resists inventing work: no refactor, no premature optimization, no touching the money-path correctness code under the banner of "speed."

---

## Tier 1 — High impact / Low risk (do first)

### T1-1 — Trim the font payload (FE-1)
- **Files:** `app/layout.tsx` only.
- **Change:** Request only the weights/styles actually used —
  - **Fraunces:** `weight: ["400","600","700"]`, `style: ["normal","italic"]` *(and, if the visual check passes, drop italic to a single 400-italic by keeping only where used)* — from 8 instances to ~4.
  - **Inter:** `weight: ["400","600","700","800"]` — drop the unused `500`.
  - Keep `subsets: ["latin"]`, `display: "swap"`.
- **Optional stretch:** evaluate shipping **Fraunces as a single variable font** (omit `weight`) vs. the trimmed static set; pick whichever transfers fewer bytes for the weights we use.
- **Expected impact:**
  - **First-visit transfer:** ❌ **RETRACTED** — no measurable change. Fraunces/Inter are variable fonts; next/font ships one file per unicode-range subset, so an English page already only loads the ~132 kB latin subset regardless of the weight array. The trim was implemented and saved ~0 kB. The only real lever (dropping Fraunces italic, ~40 kB) was kept for design.
  - **Response time:** unchanged server-side; **~1 s faster** font transfer on throttled 3G; better CLS/final paint. `swap` already prevents FOIT.
  - **Throughput / DB / memory / infra cost:** unchanged (static assets) — marginally less CDN egress.
- **Index/migration:** none. **Test impact:** visual diff only — confirm headings, tagline italic, prices/stats, and testimonial quotes render identically. **Rollback:** revert one file; instant.
- **Confidence:** High on bytes, Med on ms.

*(That is the whole of Tier 1. Correctly, it is small.)*

---

## Tier 2 — High impact but deferred until their trigger (do when the trigger fires, not now)

### T2-1 — `next/image` pipeline for real photography (FE-4) — trigger: swapping real photos into `PhotoSlot`
- **Files:** `app/_components/site.tsx` (PhotoSlot → `next/image`), new `next.config.js` (`images.formats: ['image/avif','image/webp']`).
- **Why deferred:** no images exist yet; doing it now optimizes nothing. But it is **high impact the moment photos land** — unoptimized hero/photo images would dwarf the entire current payload.
- **Expected impact (at swap-in):** AVIF/WebP + responsive `sizes` + lazy-load typically cut image bytes 50–80% vs. raw JPEG/PNG, and explicit dimensions prevent CLS. Implements the BD research's WebP/low-bandwidth guidance.
- **Dependency order:** add `next.config.js` first, then convert `PhotoSlot`. **Test:** Lighthouse mobile before/after on `/`. **Rollback:** revert to CSS slots.

### T2-2 — PWA + offline/data-saver (from BD research) — trigger: product decision to invest in mobile UX
- **Files:** `next.config.js` (or a PWA plugin), a web-app manifest, a service worker.
- **Why here, not Tier 1:** it's a genuine build task, not a tweak, and it's a product bet — but it's the single biggest *mobile* UX lever for Bangladesh (installable, offline lessons, cached shell, queued submissions). Called out so it isn't forgotten.
- **Expected impact:** dramatic repeat-visit load reduction and offline resilience; ties into the audit's data-cost theme. **Test:** Lighthouse PWA audit. **Rollback:** remove SW registration + manifest.

---

## Tier 3 — Optional / watch-list (do only if a threshold is crossed)

- **T3-1 — `/signup` static conversion (FE-2):** **No action recommended.** The dynamic render is cheaper than shipping a client-JS island for one headline. Revisit only if `/signup` becomes high-traffic. Documented as a conscious choice.
- **T3-2 — `next.config.js` prod levers (FE-3):** fold into T2-1 (add it when images arrive). No standalone value now.
- **T3-3 — CSS split (FE-5):** **No action.** 44 kB single sheet is fine; revisit past ~80–100 kB.

---

## Correctness fixes (separate track — must-do if/when the backend is wired, not ROI-ranked)

These are **not** performance items and are **not** in the live path today, but they gate any launch of the payment/entitlement code. Listed so they're scheduled with the backend work, not discovered in production:

1. **CR-2** — idempotent + transactional payment grant (`route.ts`) — prerequisite: unique index on `providerPaymentId`.
2. **CR-1** — authenticate/verify the bKash callback.
3. **CR-3** — verify settled amount/currency before granting.
4. **CR-4** — extend subscription from `max(now, currentPeriodEnd)`.
5. Re-audit media/paywall, submissions, and grading when those slices exist.

**Guardrail:** no performance change may weaken atomicity, idempotency, or access control on money/access/submissions.

---

## Execution sequence (proposed)

```
1. T1-1  Trim fonts            ← the one real win; ship now, measure bytes before/after
2. (measure) Lighthouse mobile + Network transfer on /  — confirm ~160 kB saved
3. Hold. Everything else is trigger-gated:
   • real photos arrive       → T2-1 (next/image + next.config)
   • mobile-UX investment      → T2-2 (PWA)
   • backend gets wired        → Correctness track (CR-1..CR-4) + backend perf (§6)
```

## Recommendation for approval

**Update after implementation:** T1-1 (font trim) turned out to be a **no-op** — fonts were already optimal (variable-font unicode-range splitting). The site has since added interactive tools and remote images, so the one real performance action now is **T2-1: move the `<img>` tags to `next/image` + a `next.config` `remotePatterns` entry** (auto WebP/AVIF, resized) — the genuine Bangladesh-low-bandwidth win. Still no broader refactor warranted.
