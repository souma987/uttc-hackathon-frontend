import {listingsApi, type CreateListingRequest, type Listing} from '../api/listings';
import {awaitCurrentUser} from './auth';

export type CreateListingParams = CreateListingRequest;

// Higher-level listing creation that handles authentication on the client.
// - Ensures there is a logged-in Firebase user
// - Fetches an ID token
// - Calls POST /listings via listingsApi
export async function createListing(
  params: CreateListingParams
): Promise<Listing> {
  const user = await awaitCurrentUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const idToken = await user.getIdToken();

  return listingsApi.createListing(idToken, params);
}
