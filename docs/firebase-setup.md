# Firebase setup — Google Login + cloud sync (≈5 minutes)

The app code is **already built**. To switch it on, create a free Firebase project and paste its config. (I can't create the project for you — it needs your Google account — but these are the exact steps.)

## 1. Create the project
1. Go to **https://console.firebase.google.com** → **Add project**.
2. Name it e.g. `strings-of-hope`. You can turn Google Analytics off. Create.

## 2. Add a Web app + copy the config
1. On the project home, click the **`</>` (Web)** icon → register app (nickname `Strings of Hope`, no hosting needed).
2. You'll see a `firebaseConfig = { apiKey: "...", authDomain: "...", ... }` block.
3. Copy those values into **`app/firebase-config.js`** (replace the empty strings). These values are **public by design** — safe to commit.

## 3. Turn on Google Sign-In
1. Left menu → **Build → Authentication → Get started**.
2. **Sign-in method** tab → **Google** → **Enable** → pick a support email → Save.
3. **Settings → Authorized domains** → **Add domain** → add:
   - `meridante-dev.github.io`  (your live site)
   - `localhost`  (for local testing)

## 4. Create the database
1. Left menu → **Build → Firestore Database → Create database** → **Production mode** → pick a region → Enable.
2. Open the **Rules** tab, replace with the rules below, **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Each signed-in person can read/write ONLY their own document.
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## 5. Commit & deploy
Commit `app/firebase-config.js` with your values and push. Done — the **You** tab now shows **“Sign in with Google,”** and progress syncs across devices.

---

### How it behaves
- **Logged out:** works exactly as before — everything saved on the device.
- **Sign in:** local + cloud data are **merged** (progress is never lost — arrays union, counters take the max), then kept in sync automatically (debounced on every change, plus on app close).
- **Another device:** sign in with the same Google account → your journey appears.
- **Security:** the rules above mean a user can only ever touch their own data. The config keys are not secrets; they identify the project, and the rules do the protecting.

### Free tier
Firebase's free "Spark" plan is generous (Firestore: ~50k reads / 20k writes per day, 1 GiB stored) — far more than an early community test needs. No credit card required.

### Notes / options
- On installed iOS PWAs, Google sign-in uses a redirect fallback automatically if the popup is blocked.
- Theme choice (`soh-theme`) is intentionally **not** synced — it stays per-device.
- To retire a stale offline cache after a big release, bump `CACHE` in `app/sw.js`.
