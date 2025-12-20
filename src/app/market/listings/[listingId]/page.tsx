import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { listingsApi } from '@/lib/api/listings';
import { userApi } from '@/lib/api/user';
import { BoxingWrapper } from '@/components/boxing-wrapper';
import { ListingDetailsContent } from './_components/listing-details-content';

export default async function ListingDetailsPage({ params }: PageProps<'/market/listings/[listingId]'>) {
  const { listingId } = await params;
  const locale = await getLocale();
  
  const listing = await listingsApi.getListing(listingId);

  if (!listing) {
    notFound();
  }

  const seller = await userApi.getUserProfile(listing.seller_id);

  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8">
      <ListingDetailsContent listing={listing} seller={seller} locale={locale} />
    </BoxingWrapper>
  );
}