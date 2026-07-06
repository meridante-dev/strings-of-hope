# ▶ RESUME HERE — Strings of Hope
*Checkpoint 2026-07-06 (evening). Working tree clean, all pushed (`73462e6`), deploy verified live.*

## Live & repo
- **App:** https://meridante-dev.github.io/strings-of-hope/ (public, auto-deploys on every push to main)
- **Repo:** https://github.com/meridante-dev/strings-of-hope (public) · last commit `73462e6`
- Workflow: local build → Playwright screenshots from a scratchpad COPY (macOS blocks headless Chromium on the Ultra Touch volume) → user approves visuals → commit/push. **No Netlify.**
- ⚠️ **Deploy gotcha:** never `gh run rerun --failed` the Pages job (duplicate-artifact error). Recover with a FRESH run: `gh workflow run pages.yml --ref main`. See memory [[pages-deploy-gotcha]].

## ✅ Shipped 2026-07-06 (today's session)
- **Jacob's Universe:** Arrivals + Reharm Lab toys + per-module quizzes; wired into Harpie's KB; 2nd web-scan (40+ legal sources) → per-module "Go deeper" + "Deeper Study" library; **modules → taught lesson-paths** (engine + progress) with **Negative Harmony (Mod 3)** & **Microtonality (Mod 8, from CC BY)** fully authored. *Only 2 of 11 modules have taught lessons so far.*
- **Music Theory:** Semester 6 "Theory in the Real World" (9 OMT chapters, CC BY-SA); **premium gamification** — XP, 8 ranks, progress bars, certificates + course diploma (in `app.js` `sohTheoryStats`, `theoryMasterHTML`, cert modal).
- **NEW section — Shamayim Harp** (`app/shamayim.js`, view `view-shamayim`): contemplative 5-soul-world journey (Edenrise). See [[shamayim-harp]].
- **NEW section — Chen · Musical Symmetry** (`app/chen.js`, view `view-chen`): Ariel Cohen Alloro; octatonic-scale + retrograde toys. See [[chen-section]].
- **Legal pass:** app built 100% legal worldwide — JPS 1917 (PD) scripture, OFL fonts, MIT/BSD/0BSD libs; **Credits & Licenses page** (`view-credits`, `buildCredits`/`CREDITS`). All copyrighted scholarship = cite/link-out, own words. "Kabbalah" → "Jewish Mysticism" app-wide.
- Research preserved: `docs/jewish-music-and-harp-sources.md`, `docs/jacob-web-resources.md` (Scan 2).

## 🗺️ ROADMAP — build next (recommended order)
1. **Finish Jacob taught-lessons** across remaining 9 modules + add a **Jacob's Universe certificate**.
2. **Jewish Prayer-Modes theory section** (nusach, Freygish/Adonai Malach/Magein Avot, cantillation te'amim, Weekly Maqam) — all sources vetted in `docs/jewish-music-and-harp-sources.md`. Build like Jacob (stepped lessons + harp-mapping + honest attribution).
3. **Mic chord tests + scored Challenge Track** (arpeggio-based first, then polyphonic chromagram beta) → feeds XP/certificates. *The last unbuilt OMT feature.*
4. **Discoverability:** add Shamayim + Chen to the home rails (currently only in the Everything menu); wire both into Harpie's KB.
5. **Expand OMT** into a fuller multi-unit track (deep jazz, post-tonal, form, counterpoint).
6. **Chen/Shamayim polish:** a final-composition toy for Chen; more toys.
7. **Phase 5 backend** (see WhatsApp roadmap given to user 2026-07-06): cloud accounts + cross-device sync, community/groups/duets, teacher dashboard, record-and-get-feedback, cloud-powered Harpie, shared song library, verified shareable certificates, practice reminders, events/retreat booking, payments.
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
