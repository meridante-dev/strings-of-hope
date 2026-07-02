# Recorded drones — how to add your Shruti box / harp-in-the-wind recordings

The app plays a looping drone that **auto-follows the key** of the Modes wheel (and the Drone Studio).
To use your own recordings instead of the synth, drop audio files here.

## Folders (one per "sound set")
- `shruti/`   → the Shruti box drones  (shows as **"Shruti Box"** in the app)
- `harpwind/` → the harp-in-the-wind drones (shows as **"Harp in the Wind"**)

(You can add more sets later — make a folder and tell me its name.)

## File names — one looping file per pitch (12 total)
Name each file by its note, **using flats**, with a `.mp3` extension:

    C.mp3   Db.mp3  D.mp3   Eb.mp3  E.mp3   F.mp3
    Gb.mp3  G.mp3   Ab.mp3  A.mp3   Bb.mp3  B.mp3

So `shruti/D.mp3` is a D-tonic Shruti drone, `shruti/Eb.mp3` is E♭, etc.
A C♯ key automatically uses `Db.mp3` (same pitch), F♯ uses `Gb.mp3`, and so on.

## Tips
- Make each file **loop seamlessly** (trim to a whole number of cycles, no gap/click at the loop point).
- Keep levels consistent across the 12 files.
- `.mp3` is safest for phones; `.m4a`/`.ogg` also work if you rename the extension in the code.
- You don't need all 12 to start — any key that's missing a file gracefully falls back to the warm synth pad.

That's it. Once the files are here, pick **Shruti Box** in the Drone Studio (or tap **Hear the drone** on the Modes wheel) and it plays your recording in the current key.
