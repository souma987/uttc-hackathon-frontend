import {getApp, getApps, initializeApp} from "firebase/app";
import {browserLocalPersistence, getAuth, setPersistence, User} from "firebase/auth";
import {getStorage} from "firebase/storage";
import {firebase, firebaseConfig} from "./common";
import {Notifier} from "@/lib/notify";

export function tryInitializeBrowserFirebase() {
  if (typeof window === "undefined") return;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firebase.auth = getAuth(app);
  firebase.auth.onIdTokenChanged((user) => {
    updateUserToken(user)
      .then(() => console.log("Successfully set auth token cookie"))
  })
  setPersistence(firebase.auth, browserLocalPersistence)
    .catch(e => console.error("Failed to setPersistence:", e));
  firebase.storage = getStorage(app);
}

export const tokenUpdateNotifier = new Notifier<boolean>();

async function updateUserToken(user: User | null) {
  try {
    const idToken = await user?.getIdToken();
    await fetch('/api/update-auth-token', {
      method: 'POST',
      body: JSON.stringify({token: idToken ?? null}),
    });
    tokenUpdateNotifier.notify(true);
  } catch (e) {
    console.error("Failed to update auth token:", e);
    await firebase.auth?.signOut();
    tokenUpdateNotifier.notify(false);
  }
}
