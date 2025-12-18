import { suggestionsApi, type NewListingSuggestionRequest } from '../api/suggestions';
import { awaitCurrentUser } from './auth';

export type NewListingSuggestionParams = NewListingSuggestionRequest;

export async function generateNewListingSuggestions(
  params: NewListingSuggestionParams
): Promise<string[]> {
  const user = await awaitCurrentUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const idToken = await user.getIdToken();
  return suggestionsApi.generateNewListingSuggestions(idToken, params);
}
