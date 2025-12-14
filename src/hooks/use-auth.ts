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

        // Fetch backend user profile when signed in
        if (u) {
          fetchCurrentUserFromBackend()
            .then((profile) => {
              setDbUser(profile);
            })
            .catch((err) => {
              console.error("Failed to fetch db user:", err)
              setDbUser(null);
            })
            .finally(() => setLoading(false));
        } else {
          // Signed out
          setDbUser(null);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return { user, loading, isAuthenticated, dbUser };
}
