# ▶ RESUME HERE — Jacob's Universe
*Paused 2026-06-25. Read this first to pick up exactly where we left off.*

## Where we are
- **Workflow:** OFF Netlify (low credits). Preview locally on the `modes` server (port 4137) + screenshots in Claude Code. Config in `.claude/launch.json` (servers: `modes`, `native-expo`).
- **Corpus mapped:** see `docs/jacob-corpus.csv` (18 rows) + `docs/jacob-concept-map.md` (the real content).
  - **7 deep-mapped:** JC001 (WIRED 5-Levels/Harmony), JC002 (SUHMM-Lydian, fan analysis), JC009 (Emotional Playground), JC012 (Mexico City), JC013 (GRAMMY U), JC014 (Qwest 2019), JC016 (Whitacre conversation).
  - **6 transcripts gathered, not yet mapped:** JC003–JC005 (interviews), JC010 (Sydney), JC011 (NYU/Sony), JC017 (USC/Belasco) — in `jacob-corpus/transcripts/`.
  - **Pending re-fetch (YouTube rate-limited):** JC007 Moon River, JC008 Berklee full, JC015/JC018 USC "Music & Mindset" (likely dup). Re-run the caption fetch when the rate limit clears.

## Decisions locked
1. **Placement:** Jacob's Universe is a **top-level section** — its own home-grid tile + `view`, alongside Music Theory / Modes / Circle of Fifths. (NOT a unit inside the theory course.)
2. **First build:** scaffold the section shell **+ build the flagship "One Note, Many Chords" toy** end-to-end, verify in local preview.

## The build blueprint (full detail in `docs/jacob-concept-map.md`)
11 modules: 0 Big Idea · **1 One Note, Many Chords ⭐** · 2 Light & Dark · 3 Major=5ths/Minor=4ths (+Negative Harmony) · 4 Give Every Note Somewhere to Go · 5 Voicings & Inversions · 6 Reharmonization · 7 Harmony from Nature · 8 Beyond the 12 Notes · 9 Groove & the Pocket · 10 Audience Choir & Mindset.
Toy build order: ① One-Note-Many-Chords ⭐ · ② Light/Dark circle (extend existing Circle of Fifths) · ③ Negative-Harmony Mirror · ④ Reharm Lab · ⑤ Give-the-note-an-exit · ⑥ Overtone chord builder.

## NEXT ACTION when we resume
1. Add a `view-jacob` section + a home-grid tile (`data-view="jacob"`) + a `showView('jacob')` hook.
2. Build a module list (the 11 modules) reusing the lesson stepper + Harpie side-bubble.
3. Build **Module 1 "One Note, Many Chords"**: hold one harp string ringing (reuse `harpPluck`/`Drone`), swap chords beneath it via pads, name the feeling. Lever-harp-mapped; listening-trail deep-links from the concept map.
4. Verify in local preview (port 4137), screenshot. No Netlify.

## Copyright posture (unchanged)
Teach concepts in our own words; deep-link out to Jacob's videos with timestamps; transcripts are internal study only (do not republish). JC002 is a fan analysis (commentary) — cite the embedded Jacob clip.
