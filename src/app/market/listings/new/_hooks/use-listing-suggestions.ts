'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {generateNewListingSuggestions} from '@/lib/services/suggestions';

type SuggestionLanguage = 'en' | 'ja';

interface UseListingSuggestionsParams {
  title: string;
  description: string;
  condition: string;
  language: SuggestionLanguage;
}

const MIN_DESCRIPTION_LENGTH = 10;
const TYPING_DEBOUNCE_MS = 700;

export function useListingSuggestions({
  title,
  description,
  condition,
  language,
}: UseListingSuggestionsParams) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchSuggestions = useCallback(async () => {
    const trimmedDescription = description.trim();

    if (trimmedDescription.length < MIN_DESCRIPTION_LENGTH) {
      setSuggestions([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const requestId = Date.now();
    requestIdRef.current = requestId;
    setIsLoading(true);

    try {
      const nextSuggestions = await generateNewListingSuggestions({
        title: title.trim(),
        description: trimmedDescription,
        condition,
        language,
      });

      if (requestIdRef.current !== requestId) return;

      setSuggestions(nextSuggestions);
      setError(null);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      console.error('Failed to generate listing suggestions', err);
      setError('suggestions');
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, [title, description, condition, language]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void fetchSuggestions();
    }, TYPING_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [fetchSuggestions]);

  const hasInput = useMemo(() => description.trim().length > 0, [description]);
  const hasMinimumInput = useMemo(
    () => description.trim().length >= MIN_DESCRIPTION_LENGTH,
    [description]
  );

  return {
    suggestions,
    isLoading,
    error,
    refresh: fetchSuggestions,
    hasInput,
    hasMinimumInput,
  };
}
