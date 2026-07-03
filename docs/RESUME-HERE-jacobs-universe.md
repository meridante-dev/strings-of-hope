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
- **Phase 3 started:** June Lee Pts 1–3 deep-mapped (`docs/jacob-concept-map.md` batch 3); **Negative-Harmony Mirror toy live** (Module 3). Corpus 10/18 mapped.

## ⏳ AWAITING USER ANSWERS — OMT integration (4 questions asked)
Open Music Theory V2 scanned: **CC BY-SA 4.0, NO NC clause** → commercial OK; adaptations stay BY-SA, per-chapter author attribution required.
1. **Scope:** new unit "Theory in the Real World" (~10 chapters we lack: pop schemas, fragile/absent/emergent tonics, galant schemas, Tonnetz, pop form, orchestration→harp, drumbeats, sight-singing) — RECOMMENDED — vs full second course?
2. **Mic chord tests:** ship arpeggio-based (monophonic engine, reliable) first — RECOMMENDED — then polyphonic chromagram as beta?
3. **Gamification:** extend pilgrimage vs add scored challenge track w/ mastery %? (lean: challenge track on top)
4. **Priority:** OMT next vs finish Jacob modules 2–10 (Light/Dark + Reharm Lab toys specced)?

## Next actions (whichever priority wins)
- **Jacob path:** modules 2–10 full lessons; Light/Dark toy (extend Circle of Fifths); Reharm Lab; add Jacob KB to Harpie `buildHarperKB()`; map JC010/011/017; re-fetch JC007/008/015/018 (rate-limited).
- **OMT path:** per answers above; per-chapter attribution pattern like Hutchinson/Schmidt-Jones credits.
- Backlog: mic engine upgrade for chords (pitchy = monophonic; polyphonic needs chromagram), song library w/ harp-type compatibility, Phase 5 backend (community/teacher).
