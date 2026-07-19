# Daily practice reminders — what's shipped, and the one optional backend step

## What ships now (no backend, works today)

- **The reminder is honest on every device.** On iPhone/iPad in a browser tab it no longer offers a toggle that silently does nothing — it explains that notifications need the app added to the Home Screen first, and links to the install steps. (Verified: iOS Safari only delivers notifications to an installed PWA — webkit.org/blog/13878.)
- **A "Send a test notification" button** (in You → Daily practice reminder, once granted) — the member sees exactly what a reminder feels like, immediately.
- **An on-open nudge** — when a member opens the app on a new day and hasn't practised, they get a gentle notification (this already existed; it now routes through the service worker so it works from an installed iOS PWA, which the old `new Notification()` did not).
- **The full push pipeline is in the service worker** (`push` + `notificationclick` handlers). The moment a push is *sent* to a member, it displays and tapping it opens the app. Nothing else needs to change on the client.

## The gap: reminders that fire when the app is CLOSED

A notification that arrives at, say, 8am when the member isn't in the app requires a **server to send it** at that time. The browser cannot schedule a future background notification on iOS (no Notification Triggers API there). This is the only piece that needs infrastructure, and it's genuinely optional — the on-open nudge already re-engages returning members.

To enable true scheduled daily push you need **three things**, all on the Firebase project you already own:

1. **Blaze (pay-as-you-go) plan.** Cloud Functions + Cloud Scheduler require it. For ~63 members sending one push/day, the cost is effectively $0 (well within the free monthly grant) — but a card must be on file.
2. **Client subscription (small addition).** On the "remind me" toggle, also call `pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:<VAPID public key> })` and store the subscription JSON + the member's chosen time on their Firestore user doc. (VAPID keypair: `npx web-push generate-vapid-keys`.)
3. **A scheduled Cloud Function** that runs every ~15 min, finds members whose chosen time matches, and sends a Web Push to each stored subscription:

```js
// functions/index.js  (Firebase Cloud Functions, Node)
const functions = require('firebase-functions');
const admin = require('firebase-admin'); admin.initializeApp();
const webpush = require('web-push');
webpush.setVapidDetails('mailto:info@edenrise.com', VAPID_PUBLIC, VAPID_PRIVATE);

exports.dailyReminder = functions.pubsub.schedule('every 15 minutes').onRun(async () => {
  const hhmm = new Date().toISOString().slice(11,16);            // UTC; store member times in UTC too
  const snap = await admin.firestore().collection('users')
    .where('reminder.time', '==', hhmm).get();
  await Promise.all(snap.docs.map(async d => {
    const sub = d.get('reminder.sub'); if (!sub) return;
    try { await webpush.sendNotification(sub, JSON.stringify({
      title: 'Strings of Hope 🎵', body: 'A few minutes at your harp today?' })); }
    catch (e) { if (e.statusCode === 410) await d.ref.update({ 'reminder.sub': admin.firestore.FieldValue.delete() }); } // prune dead subs
  }));
});
```

Deploy: `firebase deploy --only functions`. The client SW already handles the incoming push — no client change beyond step 2.

## Recommendation

Ship the client work as-is (it's live). Turn on the backend **only if** Pulse shows members enabling reminders but not returning — i.e. only if the data says the on-open nudge isn't enough. Per the product's own principle, don't stand up paid infra on a guess; let `reminders-on` vs `return-d7` in Pulse decide.
