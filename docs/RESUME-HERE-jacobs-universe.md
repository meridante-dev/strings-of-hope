# ▶ RESUME HERE — Strings of Hope
*Checkpoint 2026-07-03 (evening). Working tree clean, all pushed, deploy verified live.*

## Live & repo
- **App:** https://meridante-dev.github.io/strings-of-hope/ (public, auto-deploys on every push to main; the Pages queue is flaky — the verify loop auto-reruns failed deploys)
- **Repo:** https://github.com/meridante-dev/strings-of-hope (public) · last commit `9444614`
- Workflow: local build → Playwright screenshots from a scratchpad COPY (macOS blocks headless Chromium on the Ultra Touch volume) → user approves visuals → commit/push. **No Netlify.**

## State of the world (all shipped & live)
- **Design:** Dark Luxe · Judean Desert identity + Klaf light toggle (☀/☾ topbar) + procedural SVG art on all cards. Jacob's Universe art = **heavenly clouds** (user direction: clouds, not planets).
- **Core loop:** harp-profile onboarding (auto-opens; edit via streak pill) · Today's Harp Path (daily checkable plan) · pilgrimage levels/badges (Journal) · Harpie personalized by profile.
- **Phase 2.1:** per-lesson completion (`soh-lessons`) → chapter n/m + ✓, unit progress bars, Jacob seen-✓.
- **Phase 3 started:** June Lee Pts 1–3 deep-mapped (`docs/jacob-concept-map.md` batch 3). Corpus 10/18 mapped.
- **Jacob toys live (commit `1bb64cc`, deployed):** Negative-Harmony Mirror (Mod 3), **Arrivals** — same chord, two approaches ☀/☁ (Mod 2), **Reharm Lab** — Amazing Grace in 3 escalating levels (Mod 6). **Check-your-understanding quiz on every module (0–10)** with show/hide answers.

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
