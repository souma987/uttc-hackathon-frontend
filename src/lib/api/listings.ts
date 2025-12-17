import apiClient from './client';

export type ListingStatus = 'draft' | 'active' | 'sold';
export type ItemCondition = 'new' | 'excellent' | 'good' | 'not_good' | 'bad';

export type ListingImage =
  | {
      url: string;
      /** Optional alt text if backend provides it */
      alt?: string;
    }
  | string;

export type Listing = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  images: ListingImage[];
  price: number;
  quantity: number;
  status: ListingStatus;
  item_condition: ItemCondition;
  created_at: string;
  updated_at: string;
};

export type GetListingsFeedParams = {
  limit?: number;
  offset?: number;
};

// Request payload type for creating a new listing
export type CreateListingRequest = {
  title: string;
  description?: string;
  images: {
    url: string;
  }[];
  price: number;
  quantity?: number;
  item_condition?: ItemCondition;
  is_active: boolean,
};

// GET /listings/feed — fetches active listings feed
async function getListingsFeed(
  params: GetListingsFeedParams = {}
): Promise<Listing[]> {
  const {limit = 20, offset = 0} = params;
  const response = await apiClient.get<Listing[]>('/listings/feed', {
    params: {limit, offset},
    validateStatus: (status) => status === 200,
  });
  return response.data;
}

// GET /listings/{id} — fetches a specific listing by ID
async function getListing(id: string): Promise<Listing | null> {
  const response = await apiClient.get<Listing>(`/listings/${id}`, {
    validateStatus: (status) => status === 200 || status === 404,
  });

  if (response.status === 404) {
    return null;
  }

  return response.data;
}

// POST /listings — creates a new listing
// Required headers:
//   - Authorization: Bearer <Firebase ID token>
//   - Content-Type: application/json (set by apiClient)
async function createListing(
  idToken: string,
  payload: CreateListingRequest
): Promise<Listing> {
  const response = await apiClient.post<Listing>('/listings', payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    validateStatus: (status) => status === 201,
  });

  return response.data;
}

export const listingsApi = {
  getListingsFeed,
  getListing,
  createListing,
};
