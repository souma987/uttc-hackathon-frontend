import {FirebaseApp, getApp, getApps, initializeApp} from "firebase/app";
import {Auth, browserLocalPersistence, getAuth, setPersistence, User} from "firebase/auth";
import {FirebaseStorage, getStorage} from "firebase/storage";
import {firebaseConfig} from "@/lib/firebase/config";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined") {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  auth.onIdTokenChanged((user) => {
    updateUserToken(user)
      .then(() => console.log("Successfully set auth token cookie"))
  })
  setPersistence(auth, browserLocalPersistence)
    .catch(e => console.error("Failed to setPersistence:", e));
  storage = getStorage(app);
}

async function updateUserToken(user: User | null) {
  try {
    const idToken = await user?.getIdToken();
    await fetch('/api/update-auth-token', {
      method: 'POST',
      body: JSON.stringify({token: idToken ?? null}),
    });
  } catch (e) {
    console.error("Failed to update auth token:", e);
    await auth?.signOut();
  }
}

export {auth, storage};
