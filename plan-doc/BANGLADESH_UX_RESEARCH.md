# Making IELTS Ace User-Friendly & Effective for Bangladesh — Research Report

**Question:** How to improve our freemium IELTS prep website to be highly user-friendly and effective for the broad Bangladesh IELTS learner market (study-abroad, university students, General Training job seekers), across UX, pricing/payments, content/pedagogy, and growth/trust.

**Method:** Deep-research workflow — 5 search angles, 24 sources fetched, 93 falsifiable claims extracted, 25 adversarially verified (3-vote, need 2/3 to kill). **22 confirmed, 3 killed.** The workflow's auto-synthesis step emitted a malformed stub, so this report was reconstructed from the run journal (`journal.jsonl`). Confidence tags reflect source quality + verification.

> **How to read this:** each section ends with **→ What to change on IELTS Ace** — concrete edits mapped to what we've actually built.

---

## 0. The three most important truths for Bangladesh

1. **Mobile-first and low-bandwidth is the hard constraint, not a nice-to-have.** ~98% of social/internet access is mobile, Android is 95%+, and learners literally add mobile-data cost into the price of a course. [futurestartup; hashmeta; ResearchGate mobile-learning BD]
2. **Bangla / bilingual support is the biggest untapped differentiator.** Official providers (British Council, IDP) offer only generic English materials; local players win on bilingual support, and Bangla video content gets materially higher engagement. [flyielts; ngital]
3. **People already pay for exam prep — but our current price is high for the market.** ~⅓ of Bangladeshi household education spend goes to coaching/tutors, yet online video subscriptions benchmark near **৳3,000/year**, and offline IELTS courses run **৳9,500–13,800**. Our ৳1,200/mo = ৳14,400/yr sits above even offline coaching. [businessinspection; futurestartup; mentors.com.bd]

---

## 1. UX & Usability (mobile-first, low-bandwidth, onboarding)

| Finding | Confidence | Source |
|---|---|---|
| Social/internet access in BD is overwhelmingly mobile (98%+ mobile-only) and Android-dominant (95%+); desktop is minimal. | High | hashmeta |
| Students factor **mobile-data cost into the total cost of a course** — a real affordability barrier, not just a UX one. | High | futurestartup |
| A **PWA** dramatically cuts data + load time: Twitter Lite reduced data use ~70%, loads <5s on 3G, uses <3% of device storage vs native, and cut bounce rate 20%. | High | spaceotechnologies (case studies) |
| Airbnb's PWA: +25% mobile-web conversions, app footprint 200MB→12MB. Alibaba PWA: +76% conversions. | Medium | spaceotechnologies |
| **WebP images** cut file sizes substantially with no visible quality loss — recommended for low-bandwidth. | High | axway/spaceo |
| **Offline-first** design (local caching + request queuing, sync when network returns) keeps apps usable on poor connectivity. | High | axway |
| **Lightweight/"Lite" builds** that strip non-essentials (e.g., video autoplay) preserve core function on slow networks — cf. Facebook Lite <1MB, installs in 5s on 2G. | High | axway |
| Mobile learning apps have significant potential to improve higher-ed outcomes in Bangladesh (mixed-methods validation). | Medium | ResearchGate (primary, BD) |

**→ What to change on IELTS Ace**
- **Make it a PWA** (installable, offline-capable). This is the single highest-leverage UX move for BD. Cache lessons/tests; queue submissions offline and sync on reconnect (this also dovetails with the durable-submission requirement from our correctness audit).
- **Ship WebP** for the photo slots you swap in; lazy-load images; keep the bundle tiny (we already **code-split the video player** — keep that discipline; our First-Load JS is ~105kB, good).
- **Design for Android + one-hand mobile first.** Our current layout is responsive; pressure-test it on a low-end Android at 3G throttling.
- **Show data-weight honesty:** offer a "data-saver" toggle (audio-only lessons, downloadable-for-offline). Directly addresses the data-cost barrier.
- **Onboarding:** a fast diagnostic-test-first flow (see §3) rather than a long signup — mobile users bounce on friction.

---

## 2. Pricing & Payments (bKash/Nagad, affordability, conversion)

| Finding | Confidence | Source |
|---|---|---|
| **bKash is effectively mandatory** — 50M+ active users; consumer platforms must accept it. | High | geekssort |
| bKash merchant fee ≈ **1.5–1.85%** per transaction. | Medium | geekssort |
| **SSLCommerz** is a single-integration aggregator: **33+ methods** (bKash, Nagad, Rocket, cards, net banking, 30+ EMI banks), **PCI DSS Level 1**, Bangladesh-Bank **PSO-licensed** (1 of only 3), 12,960+ merchants; ~2.0–3.0% depending on method; free 7-day trial, 5-min signup. | High | sslcommerz.com |
| Official IELTS test fee (~**৳29,600**, UKVI ৳33,200) dwarfs prep-course fees — total learner spend is dominated by the exam fee, so prep must feel cheap relative to it. | High | idp/mentors |
| Offline IELTS coaching benchmark (Mentors, Dhaka): **৳13,800** for 3.5-month Regular (incl. 20 mocks), **৳9,500** crash. Mock bundles **৳2,100 (3) → ৳5,500 (20)** ≈ ৳275–700/mock. | High | mentors.com.bd |
| Affordable online video subscription benchmark: **Upskill ৳3,000/year** for 34+ lessons. | Medium | businessinspection |
| Willingness to pay is real: ~**⅓ of household education spend** goes to coaching/private tutors — the single largest slice. | High | businessinspection |
| BD's leading edtech (10 Minute School) uses **"scale first, then monetize"** freemium; most local edtechs monetize from day one. | Medium | futurestartup |

**KILLED / do not rely on:**
- ❌ *"10 Minute School IELTS LIVE Batch = 10,000 BDT / 12-month validity"* — **refuted 0–3** (page didn't substantiate; treat exact figure as unverified).
- ❌ *"Nagad has 80M accounts and charges lower fees than bKash with stronger rural penetration"* — **refuted 1–2** (fee/penetration comparison not substantiated). Nagad is still worth accepting; just don't claim it's cheaper.

**→ What to change on IELTS Ace**
- **Reprice for the market.** ৳1,200/mo (৳14,400/yr) is above offline coaching. Options: introduce an **annual plan** near the ৳3,000–6,000/yr band, and/or **à-la-carte mock-test bundles** (৳2,100–5,500 is the proven price ladder). Keep a monthly option but make the annual the anchor.
- **Payments: don't hard-wire only bKash.** Integrate **bKash + Nagad** at minimum; strongly consider **SSLCommerz as the aggregator** so one integration covers 33+ methods (and gives you PCI-DSS coverage). Our current code has a bespoke bKash provider — SSLCommerz would replace much of it and reduce the payment-correctness surface flagged in the audit.
- **Freemium conversion:** lead with a genuinely useful free tier (free diagnostic + free lesson previews — we have the 5-min preview concept). "Scale first" is viable but our small size argues for a clear paid ladder early.
- **Anchor price against the exam fee** in copy ("less than 5% of your test fee") — reframes affordability.

---

## 3. Content & Pedagogy (what actually raises band scores)

| Finding | Confidence | Source |
|---|---|---|
| **What learners do between mocks — targeted study from error analysis — drives improvement more than the number of mocks taken.** | High | careerwiseenglish |
| A valid mock must **replicate the real exam**: all four sections, strict timing, natural-speed audio, real-length passages, official task wording. Partial 1–2 section tests give an incomplete readiness picture. | High | careerwiseenglish |
| Effective feedback = **score & categorize errors the same day** (timing, vocab, distractor, question-type); for W/S compare against **official band descriptors** and **record yourself**. | High | careerwiseenglish |
| Structured post-mock plan: spend **60–70% of study time on the top two error types** via timed drills, then re-test after ~7 days. | Medium | careerwiseenglish |
| Confirm readiness with **≥2 consecutive mocks** hitting target overall + every section minimum (one score can be luck/topic/energy). | Medium | careerwiseenglish |
| Writing feedback must be **specific, constructive, actionable** (point to concrete errors, not vague overall notes) and target the **four criteria** (task response, grammar, coherence/cohesion, vocabulary). Fix **one area at a time**. | High | writingchex |
| Feedback should come from someone who **understands the exam** (professional tutor) — expert feedback is tailored to the learner. | Medium | writingchex |
| **Automated essay scoring is a supplement, not a replacement.** A fine-tuned DistilBERT model hit MAE **0.666 bands**, only **45.2% within ±0.5 band**, 74.8% within ±1.0. Adaptive auto-feedback gave a **tiny +0.060 band** mean gain; **coherence-focused auto-edits actually *reduced* scores**. Surface-level corrections beat aggressive structural ones. | High | arXiv 2512.24460 (primary) |
| Speaking: constructive feedback on fluency/vocab/grammar/pronunciation, **simulated test conditions** (timer/format) to cut anxiety, **record & self-review**, and **question banks mirroring the real format**. | Medium | portasapientia |

**KILLED / soften:**
- ❌ *"A structured, consistent approach **significantly** improves Speaking band scores"* — **refuted 1–2** (the strong causal "significantly" wasn't supported). The softer practices above (feedback, simulated conditions, recording) are still well-founded — just don't overclaim effect size.

**→ What to change on IELTS Ace**
- **Build the mock engine around error analytics, not just scoring.** After each auto-marked Reading/Listening test, categorize wrong answers by **question-type / distractor / timing** and generate a **"study next" plan** weighting the top-2 error types. This is the feature most tied to actual band gains — and it's a differentiator.
- **Keep full 4-section, strictly-timed mocks** with natural-speed audio and real-length passages. Don't ship only partial section tests as the core product.
- **Teacher grading stays the heart of Writing/Speaking** (matches our design). If we add AI scoring, **position it explicitly as a practice aid**, not a verdict — the evidence says AES alone is unreliable (only 45% within half a band) and structural auto-feedback can backfire. Have AES flag surface errors; humans handle coherence/task response.
- **Writing feedback UI**: structure it by the **four official criteria**, with inline, specific error callouts and a "focus on one thing" nudge.
- **Speaking**: record-and-playback, self-review against band descriptors, timed simulated parts 1–3, and a question bank in exact exam format.

---

## 4. Growth & Trust (acquisition, social proof, retention)

| Finding | Confidence | Source |
|---|---|---|
| **Facebook dominates** BD (~45–72.5M users; ~90% of social users) — the primary acquisition channel. | High | hashmeta; ngital |
| **YouTube is #2** (~35M; reach +11.7% YoY). Among Dhaka university students, **79.2% use YouTube** and **75.4% use Facebook** for informal study; **93.1% are in Facebook groups**. | High | ngital; ResearchGate (Dhaka, primary) |
| **Bangla video content outperforms English**: ~**34% higher engagement**, ~22% lower cost-per-result. | Medium | ngital |
| Video content gets **3–5× engagement** vs static images in BD; CPCs are a fraction of Western markets. | Medium | hashmeta |
| BD's top edtech (10 Minute School) **began as a YouTube channel** (now 1.79M subs, 1M+ app installs) — proof YouTube is a viable IELTS-acquisition engine. | High | futurestartup |
| IELTS candidates use **Facebook groups for peer feedback on writing and to find speaking partners** (thematic analysis of 2,030 posts across 5 groups). | High | ResearchGate (IELTS FB groups, primary) |
| Trust is conveyed via **named student testimonials citing achieved bands (8.5, 8.0, 7.0)** and aggregated **star ratings** (Google 4.8/5, Clutch 5/5). | Medium | 10MS listing; notionhive |
| TikTok (46.5M adults) is a **low-cost** emerging channel; Google Search CPCs inflated 30–60% in 3 years. | Medium | ngital |

**→ What to change on IELTS Ace**
- **Add Bangla / bilingual support** — UI toggle + Bangla explanations in lessons. This is both a UX win and the clearest differentiator vs British Council/IDP. High priority.
- **Content-led acquisition via YouTube + Facebook**, in **Bangla video**. Mirror the 10 Minute School playbook: free YouTube tutorials per module → funnel to the site. (We already have the FB page linked in the footer — good; make it a content channel, not just a link.)
- **Community feature / official Facebook group** for peer writing feedback and **speaking-partner matching** — this is proven self-organized learner behavior; productize it.
- **Strengthen social proof:** our testimonials already show band scores (good) — make them **verifiable/named**, add an aggregate **★ rating** (we added a 4.8/500+ badge; back it with real reviews as they come), and show university-acceptance context.
- **Retention:** consider light **gamification** (points/streaks/leaderboards) — used by BD edtechs for engagement; benchmark leaders keep bounce low (~28%) with high pages/visit.

---

## 5. Competitive landscape (context)

- **Incumbents:** British Council & IDP (official, free generic materials, computer-based IELTS with ~1-day results, 16 test cities), **10 Minute School** (recorded video, dominant, YouTube-born), **FlyIELTS** (live Zoom/Meet classes, 8,000+ exercises, bilingual), **Mentors** (offline benchmark pricing). [flyielts; idp; mentors; similarweb]
- **Named gaps we can attack:** official free materials are "too generic," recorded-only platforms "lack live two-way interaction," and bilingual Bangla support is scarce. Our wedge = **mobile-first + affordable + bilingual + teacher-graded feedback + error-analytics mocks.**
- **Engagement benchmarks:** 10MS ~5.06 pages/visit, 5m28s session, 52% bounce; leader Shikho ~11.69 pages/visit, 28% bounce — targets for our retention.

---

## 6. Prioritized action list for IELTS Ace (ROI-ordered)

**Tier 1 — high impact, feasible now**
1. **PWA + data-saver + WebP + offline submission queue** (mobile-first BD is the #1 constraint; also satisfies durable-submission from the audit).
2. **Bangla / bilingual toggle** (top differentiator; UX + growth win).
3. **Reprice:** add an annual plan (~৳3,000–6,000) + mock-test bundles (৳2,100–5,500 ladder); anchor vs the ~৳29,600 exam fee.
4. **Payments:** integrate bKash **and** Nagad, or adopt **SSLCommerz** aggregator (also shrinks the payment-correctness risk surface).

**Tier 2 — high impact, more build**
5. **Mock engine with error analytics → auto study-plan** (the feature most tied to real band gains).
6. **Teacher-graded W/S UI structured by the 4 criteria**; AI only as a labeled practice aid.
7. **YouTube + Facebook Bangla content engine** for acquisition; official FB community group.

**Tier 3 — retention & polish**
8. Verifiable named testimonials + aggregate rating; gamification (streaks/points); university-acceptance context.

---

## 7. Sources (24 fetched; quality noted)

- **Primary:** arXiv 2512.24460 (AES); ResearchGate — mobile-learning BD, FB/YouTube Dhaka students, IELTS Facebook groups; sslcommerz.com; ielts.idp.com/bangladesh; mentors.com.bd; 10minuteschool.com.
- **Secondary:** futurestartup (state of edtech BD); businessinspection (edtech overview); portasapientia JALES (speaking); similarweb.
- **Blog/industry:** hashmeta, ngital, notionhive (BD digital marketing); axway, spaceotechnologies (low-bandwidth/PWA); careerwiseenglish, writingchex (pedagogy); geekssort (payments); flyielts (competitor list).
- **Low-reliability (excluded from claims):** britishcouncil.org.bd page, BanglayIELTS FB page, sanketlade blog.

*3 claims killed by adversarial verification are listed inline in §2 and §3 — do not cite them as fact.*
