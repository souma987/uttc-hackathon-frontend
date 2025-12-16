'use client';

import { auth } from "../firebase/browser";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User, type UserCredential } from "firebase/auth";
import { userApi, type CreateUserRequest, type CreatedUser } from "../api/user";

export type SignInResult = {
  userCredential: UserCredential;
};

// Email/Password sign in (client-only)
export async function signInWithEmailPassword(email: string, password: string): Promise<SignInResult> {
  if (typeof window === "undefined" || !auth) {
    throw new Error("Auth is only available in the browser");
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return { userCredential };
}

// Sign out current user (client-only)
export async function signOutCurrentUser(): Promise<void> {
  if (typeof window === "undefined" || !auth) {
    // No-op on server; keep it explicit to avoid silent misuse
    throw new Error("Auth is only available in the browser");
  }

  await signOut(auth);
}

export type SignUpParams = CreateUserRequest;
export type SignUpResult = {
  createdUser: CreatedUser;
  userCredential: UserCredential;
};

// Sign up via backend (POST /users) then sign in with Firebase (client-only)
export async function signUpThenSignIn(params: SignUpParams): Promise<SignUpResult> {
  // First create user in our backend
  const createdUser = await userApi.createUser({
    email: params.email,
    password: params.password,
    name: params.name,
  });

  // Then authenticate on the client with Firebase
  const { userCredential } = await signInWithEmailPassword(params.email, params.password);

  return { createdUser, userCredential };
}

export type DBUser = CreatedUser;

// Subscribe to Firebase auth state changes (client-only)
export function subscribeToAuthChanges(
  onUserChange: (user: User | null) => void,
): () => void {
  if (typeof window === "undefined" || !auth) {
    // No-op unsubscribe when running on server
    return () => undefined;
  }

  return onAuthStateChanged(
    auth,
    (user) => onUserChange(user),
  );
}

// Fetch the current user's profile from our backend using Firebase ID token (client-only)
export async function fetchCurrentUserFromBackend(): Promise<DBUser> {
  const current = await awaitCurrentUser();
  if (!current) {
    throw new Error("Not authenticated");
  }
  const idToken = await current.getIdToken();
  return await userApi.getMe(idToken);
}

export async function awaitCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined" || !auth) {
    throw new Error("Auth is only available in the browser");
  }
  await auth.authStateReady();
  return auth.currentUser;
}
