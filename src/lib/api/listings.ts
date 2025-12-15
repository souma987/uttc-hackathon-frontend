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

export const listingsApi = {
  getListingsFeed,
};

