import apiClient from './client';

export type NewListingSuggestionRequest = {
  title: string;
  description: string;
  condition: string;
  language: 'ja' | 'en';
};

export type NewListingSuggestionResponse = {
  suggestions: string[];
};

// POST /suggestions/newListing — generates suggestions for a new listing
// Required headers:
//   - Authorization: Bearer <Firebase ID token>
//   - Content-Type: application/json (set by apiClient)
export async function generateNewListingSuggestions(
  idToken: string,
  payload: NewListingSuggestionRequest
): Promise<string[]> {
  const response = await apiClient.post<NewListingSuggestionResponse>(
    '/suggestions/newListing',
    payload,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      // Success: 200 OK
      // Error cases like 400/500 are surfaced via axios rejection
      validateStatus: (status) => status === 200,
    }
  );

  return Array.isArray(response.data?.suggestions)
    ? response.data.suggestions
    : [];
}

export const suggestionsApi = {
  generateNewListingSuggestions,
};
