# Strings of Hope — native app

The ultimate lever-harp companion, rebuilt natively with **Expo Router** (SDK 56,
React Native 0.85, New Architecture). Sacred-minimal premium design, light + dark.

This is the native successor to the web PWA in `../app/`. The music/theory engine
is ported 1:1 from the web app and is framework-agnostic.

## Run it

On a phone (easiest — no Xcode needed):

```bash
cd "Strings of Hope/native"
npm start            # then scan the QR code with Expo Go
# fallback if the .bin shim is missing (this folder is on an exFAT drive):
node node_modules/expo/bin/cli start
```

`npm run ios` / `npm run android` build to a simulator/emulator if you have the
native toolchains installed.

## Architecture

```
src/
  app/                      Expo Router routes (file-based)
    _layout.tsx             Root: theme + native bottom tabs (Today / Modes / Tune / More)
    (today)/index.tsx       Today — greeting, verse of the day, mode of the day, quick tiles
    (modes)/index.tsx       Modal universe — 12 keys × 4 parent worlds → every named mode
    (tune)/index.tsx        Tuner / Drone / Rhythm hub (audio engine = next milestone)
    (more)/index.tsx        The full companion: Journey, Scales, Lever Trainer, Compass…
  components/
    soh-ui.tsx              Card / Overline / Title / Body / NoteDot / Chip primitives
    stack-options.ts        Shared large-title transparent header options
  constants/
    palette.ts              Gold-led sacred-minimal palette + usePalette() (light/dark)
  lib/
    music.ts                Lever-harp engine — bases, families, computeScale, generateScales
    modes-data.ts           Modes, parent worlds, verses, keys, buildScaleContext (modal universe)
```

## Notes for this machine

- The project lives on the **exFAT** "Ultra Touch" SSD, which can't store symlinks and
  scatters AppleDouble `._*` files. `metro.config.js` block-lists those so Metro never
  tries to bundle them. If you ever see a `._index.tsx` syntax error, run
  `dot_clean -m src` and restart.
- Verified by exporting the full iOS bundle (`expo export`) — 1467 modules, compiles clean.

## Next milestones

1. **Audio** (`expo-audio`): drones (synth pad + your Shruti-box recordings), metronome,
   and microphone tuner with live pitch detection.
2. Wire the **More** tools to real screens (Journey lesson, Scales & Chords, Lever Trainer,
   Tuning Explorer, Practice Room, Compass to Jerusalem, Journal, AI Coach, Harp Profile).
3. Brand the icon/splash with the gold lyre wordmark.
