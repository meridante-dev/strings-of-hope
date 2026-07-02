# Metronome percussion kits (real meditative samples)

Drop real recorded percussion here to replace the synth click with warm,
meditative rhythmic instruments (frame drum, daf, riq, hang, soft mallets…).

## How a kit works
Create a folder per kit and put **three** one-shot samples in it:

```
audio/metro/<kit-name>/
  strong.mp3   ← the downbeat / accented hit
  mid.mp3      ← medium accent
  soft.mp3     ← the quiet in-between beats
```

Short, dry one-shots work best (let the room/space come from the drone).
`.mp3` (or `.m4a`/`.wav` if you rename the fetch) — keep them small.

## Turning a kit on
Once the three files are in `audio/metro/frame/`, the app can switch to it with:

```js
await Metro.loadKit('frame');   // → uses the samples; falls back to synth on any error
Metro.useSynth();               // → back to the built-in click
```

If loading fails (missing file, decode error), Metro silently stays on the
synth click — nothing breaks. Tell me when your recordings are in and I'll
wire the kit on by default (and add a Sound toggle on the Rhythm screen).
