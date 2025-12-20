import {Auth} from "firebase/auth";
import {FirebaseStorage} from "firebase/storage";
import {tryInitializeBrowserFirebase} from "@/lib/firebase/browser";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export interface Firebase {
  auth: Auth | undefined;
  storage: FirebaseStorage | undefined;
}

export const firebase: Firebase = {
  auth: undefined,
  storage: undefined,
}

tryInitializeBrowserFirebase();
