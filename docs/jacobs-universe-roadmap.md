# Jacob's Universe — Roadmap
**Target week: 2026-06-22 → 06-28** · Status: planning (no build yet)

Goal: map → gather → transcribe → process **every** Jacob Collier video, masterclass, teaching,
conference, interview and teaching artifact, then build a new in-app section **"Jacob's Universe"**
that teaches the concepts we already cover — but reframed through Jacob's approach, and (per our
standing rule) always mapped to the **lever harp**.

---

## 0. Guiding principle & the copyright line (read first)
Jacob's *ideas and methods* (negative harmony, microtonality, color-as-feeling, reharmonization)
are not copyrightable — his *specific recordings, performances and exact words* are.

So the rule for this whole project:
- **Transcribe & index his material for internal study only.** Do not republish transcripts or
  host his audio/video in the app.
- **Teach the concepts in our own words**, with our own examples, lever-harp-mapped.
- **Link out** to his original videos for "watch the source" (deep-link, timestamped), never embed/host.
- Attribute clearly ("as Jacob explains in …", with a link). Quote sparingly (≤1 short quote, attributed).
- Consider a courtesy outreach to Jacob's team — best case is a blessing/collab; worst case we're
  already safe by teaching ideas + linking, not republishing.

---

## 1. Map the corpus (build the master catalog)
Deliverable: `docs/jacob-corpus.csv` — one row per item with: title, type, source URL, channel,
duration, date, has-captions?, theory-density (1–5), key concepts, status.

Source categories to sweep (use the deep-research / market-intel skills to enumerate exhaustively):
- **His own YouTube channel** — "In My Room", behind-the-scenes / Djesse track breakdowns,
  livestreams & Q&As, audience-choir clips, harmonizer demos.
- **June Lee analysis & interviews** — the viral *"Jacob Collier – Harmony"* (negative-harmony)
  video, and June Lee's long-form theory interviews (the richest single pedagogical vein).
- **Rick Beato** interviews/breakdowns.
- **NPR Tiny Desk**, **Genius "Verified"**, Mahogany, COLORS, KEXP-style sessions.
- **Masterclasses / clinics / college talks** (Berklee, conservatoires, music-ed conferences, keynotes).
- **Production / Logic Pro breakdowns** (his arranging + harmonizer workflow).
- **Podcasts** (Broken Record, Dolby, Song Exploder-style, etc.) — audio interviews, very concept-dense.
- **Print/long-form interviews** (transcribe-free, just cite) for cross-checking concepts.

Method: `yt-dlp --flat-playlist` to dump channel + playlist inventories → de-dupe → score
theory-density → prioritize the top ~40 highest-density items for full transcription first.

---

## 2. Acquisition & transcription pipeline (all free / local)
1. **Download** audio only: `yt-dlp -f bestaudio -x --audio-format m4a --write-auto-subs --write-subs
   --sub-langs en` into `jacob-corpus/audio/`. Keep human captions where they exist (faster, accurate).
2. **Transcribe** the rest with **Whisper** (openai-whisper / faster-whisper, `large-v3`, local & free)
   → timestamped `.txt` + `.json` per item into `jacob-corpus/transcripts/`.
3. **Clean & segment** — strip filler, segment by topic, keep timestamps so we can deep-link
   ("watch Jacob say this at 14:32").
- Storage: the drive has ~665 GB free. Audio-only + transcripts is small (a few GB). We do **not**
  keep full video.

---

## 3. Process → knowledge base + concept map
- **Concept extraction**: tag every transcript segment with the concept(s) it covers (negative harmony,
  microtonality, color, reharm, polyrhythm, voicing, harmonic series…).
- **Build `jacob-kb`** in the same shape as the existing Harpie knowledge base (`buildHarperKB`):
  `{type:'jacob', title, concept, sourceUrl, timestamp, summary, harpMapping}`. Because Harpie's KB is
  auto-built from live data, dropping these docs in **auto-trains Harpie on Jacob's universe** — no retraining.
- **Concept map** (`docs/jacob-concept-map.md`): each signature idea → what it is (our words) → which
  existing app chapter it deepens → how it lives on a lever harp → a source link.

---

## 4. Jacob's signature concepts → the curriculum spine (each lever-harp-mapped)
These are the modules of "Jacob's Universe". Note where each *extends a chapter we already wrote*:

1. **The harmonic series is everything** — his north star. → deepens our *Science of Sound* unit.
   Harp: octaves/fifths as the pure ratios already under your strings.
2. **Color & feeling first** — chords as emotions/colors, not labels (his synesthetic framing).
   → fits our "modes as moods/colors" model perfectly. Harp: the character-note idea, extended.
3. **Negative harmony** — mirror harmony around the tonic↔dominant axis. → deepens *Harmony/Chromatic*.
   Harp: build the negative-harmony mirror tool; show which mirrored chords are lever-reachable.
4. **Microtonality / the "in-between" notes** — notes between the 12 (his famous half-sharps).
   The honest tension: a lever harp is diatonic+half-step — **it can't bend pitch**. So this module
   teaches the *concept* and how to *evoke* it (retuning a string slightly, choosing keys, listening),
   and is candid that true Collier microtonality is a pedal-harp / voice / fretless idea.
5. **Reharmonization** — passing chords, chromatic mediants, modal interchange, tritone subs.
   → deepens *Secondary Dominants / Mode Mixture / Neapolitan*. Harp: reachable reharm moves + lever choreography.
6. **Cluster & close voicings / upper structures / polychords** — his choir-stacked density.
   → deepens *Seventh chords / Beyond triads*. Harp: which clusters two hands can hold; rolled vs blocked.
7. **Bass & root motion** — how the lowest note recolors everything. → deepens our left-hand teaching.
8. **Rhythm: groove, polyrhythm, metric modulation, "the pocket"** → deepens *Rhythm* + the Rhythm engine.
9. **Improvisation & play** — "yes-and", audience-choir conducting, fearless wrong notes.
   → ties to the Modes wheel + Drone + Practice Room.
10. **Voice leading as melody for every voice** → deepens our *Voice Leading* chapters.

---

## 5. "Jacob's Universe" — in-app section design
- A new view `jacob` (entry on the home grid + a feature tile), styled distinctly ("his universe")
  but consistent with the sacred-minimal aesthetic.
- Structure mirrors the theory course (units → lessons → quiz → harp mapping), reusing the lesson
  stepper, VexFlow, and the in-lesson **Harpie side-bubble**.
- **Interactive toys** (the fun, Jacob-flavored part):
  - *Negative-Harmony Mirror* — type a chord/progression → see its negative-harmony reflection +
    which version is lever-playable + hear both over a drone.
  - *Color-Chord Explorer* — pick a feeling → get the chord/voicing + the harp shape (extends Modes).
  - *Reharm Lab* — take a simple progression and apply Jacob-style substitutions step by step.
  - *Listening trails* — curated, timestamped deep-links into his real videos beside our analysis.
- Every lesson carries the **"On your lever harp"** box (standing rule) and links into the existing
  Tuner / Levers / Circle of Fifths / Ear Training tools.

## 6. Harpie integration
- Add the `jacob-kb` docs to `buildHarperKB()` → Harpie answers Jacob-universe questions with
  precision + pathways, and the in-lesson "Ask Harpie" can de-jargon his ideas and pull the
  source-video links. (Architecture already supports this; see memory `harper-ai-coach`.)

---

## 7. Phased plan for the week
- **Mon** — Corpus mapping: build `jacob-corpus.csv`; rank by theory-density; lock the top ~40.
- **Tue** — Pipeline up: yt-dlp + Whisper batch; download/transcribe the priority set.
- **Wed** — Processing: concept extraction, `jacob-kb`, `jacob-concept-map.md`.
- **Thu** — Curriculum: write Module 1–4 lessons (harmonic series, color, negative harmony, microtonality),
  fully lever-harp-mapped, with source links + quizzes.
- **Fri** — Modules 5–10 + the Negative-Harmony Mirror toy; wire Harpie; internal review.
- **Buffer** — verify in preview; (deploy only when you say so).

---

## 8. Decisions to lock before we start (need from you)
1. **Scope** — *everything* (could be 100s of videos, multi-day transcription) vs a curated
   high-density top ~40 first, then expand? (Recommend: top-40 first.)
2. **Copyright posture** — link-out + teach-in-our-words only (safe, recommended), or do you want to
   pursue Jacob's-team permission for anything richer (embeds, quotes, collab)?
3. **Microtonality stance** — how candid to be that the lever harp can't truly do his in-between notes
   (teach concept + evoke), vs. focus the section on what *is* fully harp-playable?
4. **Section placement** — top-level "Jacob's Universe" alongside Music Theory, or a special unit
   *inside* the theory course?
5. **Outreach** — want me to draft a note to Jacob/his team proposing it?

---
*Saved 2026-06-19. This is a plan only — nothing built or deployed yet.*
