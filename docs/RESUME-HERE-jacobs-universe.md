# ▶ RESUME HERE — Strings of Hope
*Checkpoint 2026-07-07. Working tree clean, all pushed (`4fc8917`), deploy verified live. **In early-release / beta — shareable with the community now.***

## Live & repo
- **App:** https://meridante-dev.github.io/strings-of-hope/ (public PWA, installable "Add to Home Screen", works offline, auto-deploys on every push to main)
- **Repo:** https://github.com/meridante-dev/strings-of-hope (public) · last commit `4fc8917`
- Workflow: local build → Playwright screenshots from a scratchpad COPY (macOS blocks headless Chromium on the Ultra Touch volume) → user approves visuals → commit/push. **No Netlify.**
- ⚠️ **Deploy gotcha:** never `gh run rerun --failed` the Pages job (duplicate-artifact error). Recover with a FRESH run: `gh workflow run pages.yml --ref main`. See memory [[pages-deploy-gotcha]].

## ✅ Shipped 2026-07-07 (launch-prep + premium sprint)
- **Home & nav redesign** (Direction A): calm **Today** (one Continue hero + path + verse) + **5-pillar bottom bar** Today · Learn · Practice · **Uplift** (=Spirit) · You. New hub views `view-learn-hub`/`view-tools`/`view-spirit`/`view-you` (built in `app.js`), global **Harpie FAB** + Learn search (→ `harpieOpenGlobal`), parent-tab highlighting. Old 21-icon grid retired.
- **Backend LIVE — Firebase** (project `soh-app-defde`): Google + email/password + guest sign-in; Firestore per-user cloud sync, **offline-first merge** (never loses progress). `app/firebase-config.js` (real config committed, public), `app/sync.js`, rules in `docs/firebase-setup.md`. See [[backend-firebase]].
- **Premium profile** (You tab, `buildYou`): rank RING + XP, streak/chapters/certs/badges, adaptive encouragement, "Keep going" resume, certificate seals, per-world bars, pilgrimage badges, **daily-reminder** opt-in (`youMaybeRemind`).
- **Early-release prep:** PWA manifest + generated icons (192/512/maskable/apple), iOS meta, **service worker** `sw.js` (offline), OG/share tags, **Credits & Licenses** page (`CREDITS`), privacy note, beta **welcome card**, version stamp `SOH_VERSION`, "Send feedback" (mailto info@edenrise.com).
- **Apple-tier premium sprint:** ① **flow & motion** — directional view transitions (push/pop/tab in `showView`), springy press, haptics vocab (`haptic()`), staggered reveals; ② **interactive on-screen harp** (`view-play`, `HarpPlay` canvas — pluck + glissando, red-C/blue-F strings); ③ **celebration moments** (`sohCelebrate`/`sohCheckMilestones` — rank-up & streak, confetti + harp flourish + win haptic); ④ **living home** (time-of-day hero palette `data-tod` + shimmer + breathing glow).
- **Microtonality (Jacob Mod 8)** taught-lesson from CC BY source; Kabbalah→Jewish Mysticism; David-as-musician in Shamayim.

## 🚀 Launch-readiness state (2026-07-07)
Smoke-tested: **17/17 main views load with zero console errors.** PWA installable, offline works, all 3 auth methods live, cloud sync merges. **Ready to share with the community for beta testing.** Remaining polish (not blockers): tablet/desktop wide layout (currently centered phone column), background push (FCM), Learn search → true jump-to-results.

## ✅ Shipped 2026-07-06 (prior session — content & legal)
- **Jacob's Universe:** Arrivals + Reharm Lab toys + per-module quizzes; wired into Harpie's KB; 2nd web-scan (40+ legal sources) → per-module "Go deeper" + "Deeper Study" library; **modules → taught lesson-paths** (engine + progress) with **Negative Harmony (Mod 3)** & **Microtonality (Mod 8, from CC BY)** fully authored. *Only 2 of 11 modules have taught lessons so far.*
- **Music Theory:** Semester 6 "Theory in the Real World" (9 OMT chapters, CC BY-SA); **premium gamification** — XP, 8 ranks, progress bars, certificates + course diploma (in `app.js` `sohTheoryStats`, `theoryMasterHTML`, cert modal).
- **NEW section — Shamayim Harp** (`app/shamayim.js`, view `view-shamayim`): contemplative 5-soul-world journey (Edenrise). See [[shamayim-harp]].
- **NEW section — Chen · Musical Symmetry** (`app/chen.js`, view `view-chen`): Ariel Cohen Alloro; octatonic-scale + retrograde toys. See [[chen-section]].
- **Legal pass:** app built 100% legal worldwide — JPS 1917 (PD) scripture, OFL fonts, MIT/BSD/0BSD libs; **Credits & Licenses page** (`view-credits`, `buildCredits`/`CREDITS`). All copyrighted scholarship = cite/link-out, own words. "Kabbalah" → "Jewish Mysticism" app-wide.
- Research preserved: `docs/jewish-music-and-harp-sources.md`, `docs/jacob-web-resources.md` (Scan 2).

## 🗺️ ROADMAP — build next (recommended order)

### ⭐ 0. CONTENT VOICE & EXPANSION PASS (high priority — user feedback 2026-07-06)
All teachings across the app are **too condensed & abrupt**. Rewrite/expand toward a **premium educative university experience**, drawing on the rich source material (the user's PDFs + `docs/jewish-music-and-harp-sources.md` + `docs/jacob-web-resources.md`). Voice spec (see memory [[content-voice]]):
- Educative & flowing full paragraphs (not clipped one-liners); de-jargon every term the moment it appears; easy hand-holding flow, familiar→new; abridged but generous (explain the *why* + an example).
- **Quote the sources sometimes** — freely for public-domain/CC (Idelsohn, Jewish Encyclopedia, JPS 1917); **short + attributed** for copyrighted (Tarsi, JSM, Kleinman, Haïk-Vantoura, Alloro) to stay 100% legal.
- Apply to: Jacob's Universe, Shamayim, Chen, and the Theory course. This is a *quality* pass over existing sections before adding many new ones.

1. **Finish Jacob taught-lessons** across remaining 9 modules + add a **Jacob's Universe certificate** — write them in the new expanded voice from the start.
2. **Jewish Prayer-Modes theory section** (nusach, Freygish/Adonai Malach/Magein Avot, cantillation te'amim, Weekly Maqam) — all sources vetted in `docs/jewish-music-and-harp-sources.md`. Build like Jacob (stepped lessons + harp-mapping + honest attribution).
3. **Mic chord tests + scored Challenge Track** (arpeggio-based first, then polyphonic chromagram beta) → feeds XP/certificates. *The last unbuilt OMT feature.*
4. **Discoverability:** add Shamayim + Chen to the home rails (currently only in the Everything menu); wire both into Harpie's KB.
5. **Expand OMT** into a fuller multi-unit track (deep jazz, post-tonal, form, counterpoint).
6. **Chen/Shamayim polish:** a final-composition toy for Chen; more toys.
7. **Phase 5 backend** (see WhatsApp roadmap given to user 2026-07-06): cloud accounts + cross-device sync, community/groups/duets, teacher dashboard, record-and-get-feedback, cloud-powered Harpie, shared song library, verified shareable certificates, practice reminders, events/retreat booking, payments.
   - **↳ Connect to the Strings of Hope Circle.so community** (their existing community platform). Confirmed capabilities: **SSO/Auth API** (identity bridge), **Headless Member API** (feed/events/posts in-app; push certificates/XP out) — both need **Business plan+**; **webhooks + Zapier/Make** (automation); **Circle AI Agents** + **Circle MCP** (`https://app.circle.so/api/mcp`, connect Claude). The app is a static PWA with no server → the bridge REQUIRES a tiny serverless connector (Cloudflare Worker/Vercel fn) to hold the Circle API key + mint SSO JWTs; the client can't hold the key. Minimum viable connection = **SSO + embed** (members land in-app already logged in), then a serverless connector for real data sync. Circle *is* the fastest way to do Phase 5 without a full custom backend. Docs: api.circle.so/apis/headless, circle.so/ai-agents. NOT building now — mapped only.
8. Legal niceties: Terms/Privacy note + bundle full MIT/BSD license texts (`vendor/LICENSES`).

## Reference — sections & their files
- Music Theory: `theory.js` (6 semesters) · Jacob: `jacob.js` + `JACOB_DEEPER`/`JACOB_LIBRARY` · Shamayim: `shamayim.js` · Chen: `chen.js` · Credits: `CREDITS` in `app.js`. Stepped-lesson engine: `jacobOpenModule`/`jacobRenderStep` in `app.js`.

---
## (Older) checkpoint notes below


## State of the world (all shipped & live)
- **Design:** Dark Luxe · Judean Desert identity + Klaf light toggle (☀/☾ topbar) + procedural SVG art on all cards. Jacob's Universe art = **heavenly clouds** (user direction: clouds, not planets).
- **Core loop:** harp-profile onboarding (auto-opens; edit via streak pill) · Today's Harp Path (daily checkable plan) · pilgrimage levels/badges (Journal) · Harpie personalized by profile.
- **Phase 2.1:** per-lesson completion (`soh-lessons`) → chapter n/m + ✓, unit progress bars, Jacob seen-✓.
- **Phase 3 started:** June Lee Pts 1–3 deep-mapped (`docs/jacob-concept-map.md` batch 3). Corpus 10/18 mapped.
- **Jacob toys live (commit `1bb64cc`, deployed):** Negative-Harmony Mirror (Mod 3), **Arrivals** — same chord, two approaches ☀/☁ (Mod 2), **Reharm Lab** — Amazing Grace in 3 escalating levels (Mod 6). **Check-your-understanding quiz on every module (0–10)** with show/hide answers.
- **Jacob's Universe now wired into Harpie's KB** (all 11 modules + a section doc): the AI coach answers Jacob questions (negative harmony, one-note-many-chords, reharm, pocket…), grounds them in our module text + harp mapping, offers the module quiz as "Try this," and routes to the module with an "Open →" action. `buildHarperKB()` in app.js. **The video *corpus* (10/18 mapped) is a research-tracking doc only — the 11 modules already synthesise concepts across all the source videos; remaining rows need someone to actually watch/transcribe (can't be done headless).**

## ✅ OMT unit SHIPPED (commit `37e3fcf`, live)
"Theory in the Real World" = **Semester 6** of the Music Theory course (9 harp-mapped chapters, n:43–51, from Open Music Theory v.2, CC BY-SA 4.0, attributed in-app): Pop Loops & Schemas · Fragile/Absent/Emergent Tonics · Pop Song Form (SRDC) · Galant Schemas · The Tonnetz & Smooth Moves · Groove/Backbeat/Drum Kit · The Blues · Orchestration & Arranging for Harp · Sight-Singing & Solfège. Each has a 3-Q quiz + 3 lessons. Renderer was already generic (maps all units, shows `src`). **Still TODO from the OMT ask:** mic-activated chord tests (arpeggio-based first, then polyphonic beta) + a scored challenge track on top of pilgrimage.

## ⚠️ DEPLOY GOTCHA (learned 2026-07-06)
Do **NOT** `gh run rerun <id> --failed` on the Pages workflow. Each rerun re-uploads the `github-pages` artifact, and `deploy-pages@v4` hard-fails with "Multiple artifacts named github-pages … Artifact count is N". To recover, start a FRESH run: **`gh workflow run pages.yml --ref main`** (workflow_dispatch is enabled). One clean run = one artifact = green.

## ⏳ (RESOLVED) OMT integration — the 4 questions below were answered "yes" & built
Open Music Theory V2 scanned: **CC BY-SA 4.0, NO NC clause** → commercial OK; adaptations stay BY-SA, per-chapter author attribution required.
1. **Scope:** new unit "Theory in the Real World" (~10 chapters we lack: pop schemas, fragile/absent/emergent tonics, galant schemas, Tonnetz, pop form, orchestration→harp, drumbeats, sight-singing) — RECOMMENDED — vs full second course?
2. **Mic chord tests:** ship arpeggio-based (monophonic engine, reliable) first — RECOMMENDED — then polyphonic chromagram as beta?
3. **Gamification:** extend pilgrimage vs add scored challenge track w/ mastery %? (lean: challenge track on top)
4. **Priority:** OMT next vs finish Jacob modules 2–10 (Light/Dark + Reharm Lab toys specced)?

## Next actions (whichever priority wins)
- **Jacob path:** modules 2–10 full lessons; Light/Dark toy (extend Circle of Fifths); Reharm Lab; add Jacob KB to Harpie `buildHarperKB()`; map JC010/011/017; re-fetch JC007/008/015/018 (rate-limited).
- **OMT path:** per answers above; per-chapter attribution pattern like Hutchinson/Schmidt-Jones credits.
- Backlog: mic engine upgrade for chords (pitchy = monophonic; polyphonic needs chromagram), song library w/ harp-type compatibility, Phase 5 backend (community/teacher).
