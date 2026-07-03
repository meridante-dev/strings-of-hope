# Strings of Hope — Platform Roadmap
*Updated 2026-07-02 · Repo: https://github.com/meridante-dev/strings-of-hope (private)*

North star: **the world's premium lever-harp learning platform** — Netflix-grade experience, sacred-minimal Strings of Hope branding, everything mapped to the lever harp, Harpie as the ever-present guide.

---

## Phase 1 — Premium surface (SHIPPED 2026-07-02)
- ✅ Netflix-style Home: cinematic **Continue-learning hero** (espresso + gold harp-string glow), horizontal **content rails** (Jacob's Universe · Music Theory · Simcha's Course · Practice & Tools · Sacred & Daily), poster cards, **progress tracking** (`soh-progress`).
- ✅ GitHub repo + full history (media & raw transcripts excluded by design).

## Phase 1.5 — Vision adoption: "the harp Swiss army knife" (SHIPPED 2026-07-03)
Adopted from the full product-vision doc (Duolingo habit × Yousician feedback × tonebase depth × Netflix library):
- ✅ **Harp profile + onboarding** (3-step wizard: instrument 22-str lap→pedal · tuning · styles; auto-opens for new users; tap the streak pill to edit; syncs `tuneBase`).
- ✅ **Today's Harp Path** — the daily loop: composed, timed, checkable plan (tune → warm → rotating drill (sight/ear/rhythm) → resume lesson → style-aware close); per-day persistence; completion blessing.
- ✅ **Pilgrimage gamification** — levels (Beginning→Radiance), 10 badges, gentle streak-flame language ("your harp is remembering you"); rendered in Journal.
- ✅ **Personalized Harpie** — the AI coach now knows harp type, string count, tuning, and loved styles.
- Deliberately NOT adopted yet (need backend/accounts): community, teacher dashboard, uploads, certificates-as-documents, payments → Phase 5. Real-time audio feedback: already partially AHEAD (sight-reading pitch detection live); full scoring → Phase 4.

## Phase 2 — Overhaul the inner surfaces (next)
1. **Course hubs as cinema**: Theory & Jacob hubs get poster-grid treatment, per-chapter progress rings, "up next" logic (needs per-lesson completion tracking, not just last-visited).
2. **Lesson player polish**: chapter art headers, refined stepper (progress bar not dots for long chapters), end-of-chapter "Next up" card (Netflix autoplay-style), completion celebrations.
3. **Search** (Harpie-powered): one search field over all 96+ lessons, modes, tools, psalms.
4. **Profiles & streaks**: richer journal → learning stats, weekly goals, badges (finish a semester, first harmonic, 7-day streak).
5. **Design-system pass**: unify all remaining views on the rail/poster/hero tokens; dark-mode audit; typography audit (skill: design-audit).

## Phase 3 — Jacob's Universe deep build
1. **Map remaining corpus**: June Lee Pts 1–3 (deepest: negative harmony, microtonal voice-leading, tuning — transcripts already gathered), Sydney, NYU/Sony, Belasco; re-fetch Berklee/Moon River/USC (rate-limited).
2. **Full lessons per module** (multi-lesson chapters like the theory course, quizzes included).
3. **Toys**: ② Light/Dark brightness ring (extend Circle of Fifths) · ③ **Negative-Harmony Mirror** (type a chord/progression → mirrored version, lever-reachable flags, hear both) · ④ **Reharm Lab** (Amazing Grace / Happy Birthday, staged substitutions) · ⑤ Give-the-note-an-exit sandbox · ⑥ Overtone chord builder (Cloudburst partials).
4. **Harpie × Jacob**: add `JACOB_MODULES` + concept map to `buildHarperKB()` so Harpie answers Jacob questions with pathways + timestamped watch links.
5. **Listening trails**: curated timestamped deep-link playlists per module (copyright-safe: always link out).

## Phase 4 — The living platform
1. **Per-lesson completion + resume-inside-chapter** (the real Netflix feel).
2. **Practice loop**: daily mixed queue (1 lesson + 1 ear drill + 1 tool exercise), spaced repetition on quizzes.
3. **Audio everywhere**: every lesson example playable via harpPluck/Drone; VexFlow examples that sound on tap.
4. **Repertoire growth**: arrangements library with lever maps + difficulty; "learn this piece" pathways.
5. **PWA install polish**: offline manifest, install prompt, app icons/splash.

## Phase 5 — Community & reach (later)
- Accounts/sync (move progress off localStorage), teacher/student sharing, community showcases.
- Public site + GitHub Pages preview builds; re-evaluate hosting (Netlify credits) or GitHub Pages for prod.
- Optional online AI mode for Harpie (hosted model) as paid tier; monetization per `harp-companion-vision`.

## Standing rules
- Every concept **lever-harp-mapped**. Scripture only in contemplative modules. Jacob material: our words + link out, transcripts stay local. Preview locally (port 4137), push to GitHub; no Netlify deploys.
