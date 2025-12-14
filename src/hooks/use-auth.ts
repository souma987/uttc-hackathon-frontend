'use client';

import { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { fetchCurrentUserFromBackend, subscribeToAuthChanges, type DBUser } from '@/lib/services/auth';

export type UseAuthResult = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  dbUser: DBUser | null;
};

// Watches Firebase auth state and exposes user/loading flags.
// Usage: const { user, loading, isAuthenticated } = useAuth();
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(
      (u) => {
        setUser(u);
        setLoading(false);

        // Fetch backend user profile when signed in
        if (u) {
          setLoading(true);
          fetchCurrentUserFromBackend()
            .then((profile) => {
              setDbUser(profile);
            })
            .catch(() => {
              // For hackathon scope, swallow errors; callers can decide what to do
              setDbUser(null);
            })
            .finally(() => setLoading(false));
        } else {
          // Signed out
          setDbUser(null);
          setLoading(false);
        }
      },
      () => {
        // On error we just mark as not loading; errors can be handled by callers if needed.
        setUser(null);
        setLoading(false);
        setDbUser(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return { user, loading, isAuthenticated, dbUser };
}
