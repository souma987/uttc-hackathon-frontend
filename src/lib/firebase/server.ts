import {FirebaseServerAppSettings, initializeServerApp} from "firebase/app";
import {firebaseConfig} from "@/lib/firebase/config";
import {getAuth} from "firebase/auth";
import {cookies} from "next/headers";

const TOKEN_COOKIE = "FIREBASE_ID_TOKEN";

export async function getServerAuth() {
  if (typeof window !== "undefined") throw new Error("Cannot use getServerAuth on browser");
  const serverCookies = await cookies();

  const idToken = serverCookies.get(TOKEN_COOKIE)?.value;
  const appSettings: FirebaseServerAppSettings = {
    authIdToken: idToken,
    releaseOnDeref: serverCookies,
  };
  const serverApp = initializeServerApp(firebaseConfig, appSettings);
  const auth = getAuth(serverApp);
  await auth.authStateReady();
  return auth;
}

export async function setTokenCookie(token: string | null) {
  if (typeof window !== "undefined") throw new Error("Cannot use getServerAuth on browser");

  const serverCookies = await cookies();
  if (token) {
    serverCookies.set({
      name: TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7200, // 2 hours
      sameSite: 'strict',
    });
  } else {
    serverCookies.delete(TOKEN_COOKIE);
  }
}
