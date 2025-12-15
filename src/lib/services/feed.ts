import {listingsApi, type GetListingsFeedParams, type Listing} from '../api/listings';

export type ListingsFeedItem = {
  id: string;
  title: string;
  price: number;
  mainImage: string;
};

// Extract first image url for feed cards
function pickMainImage(images: Listing['images']): string | null {
  if (!images?.length) return null;
  const first = images[0];
  const url = typeof first === 'string' ? first : first.url;
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

// Fetch listings feed and surface only fields needed by the UI
export async function fetchListingsFeed(
  params?: GetListingsFeedParams
): Promise<ListingsFeedItem[]> {
  const listings = await listingsApi.getListingsFeed(params);
  return listings
    .map(({id, title, price, images}) => {
      const mainImage = pickMainImage(images);
      return mainImage
        ? {
            id,
            title,
            price,
            mainImage,
          }
        : null;
    })
    .filter((item): item is ListingsFeedItem => item !== null);
}

