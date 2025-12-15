'use client';

import {useEffect, useRef, useState} from 'react';
import type {User} from 'firebase/auth';
import {awaitCurrentUser, type DBUser, fetchCurrentUserFromBackend, subscribeToAuthChanges} from '@/lib/services/auth';

export type UseAuthResult = {
  user: User | null;
  dbUser: DBUser | null;
  loading: boolean;
};

// Watches Firebase auth state and exposes user/loading flags.
// Usage: const { user, loading, isAuthenticated } = useAuth();
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const lastFetchedUid = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleUserChange = async (nextUser: User | null) => {
      if (!isMounted) return;

      setUser(nextUser);

      if (!nextUser) {
        lastFetchedUid.current = null;
        setDbUser(null);
        setLoading(false);
        return;
      }

      if (lastFetchedUid.current === nextUser.uid) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchCurrentUserFromBackend();
        if (!isMounted) return;
        setDbUser(profile);
        lastFetchedUid.current = nextUser.uid;
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch db user:", err);
        setDbUser(null);
        lastFetchedUid.current = null;
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    awaitCurrentUser()
      .then(handleUserChange)

    const unsubscribe = subscribeToAuthChanges(
      (nextUser) => {
        void handleUserChange(nextUser);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { user, dbUser, loading };
}
