import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { listingsApi } from '@/lib/api/listings';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ListingGallery } from './_components/listing-gallery';
import { BoxingWrapper } from '@/components/boxing-wrapper';

interface ListingDetailsPageProps {
  params: Promise<{
    listingId: string;
  }>;
}

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { listingId } = await params;
  const t = await getTranslations('market.listing');
  
  const listing = await listingsApi.getListing(listingId);

  if (!listing) {
    notFound();
  }

  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section - Left */}
        <ListingGallery images={listing.images} title={listing.title} />

        {/* Details Section - Right */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{listing.title}</h1>
            <div className="flex items-center gap-4">
               <p className="text-3xl font-bold text-primary">¥{listing.price.toLocaleString()}</p>
               <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                 listing.status === 'active' 
                   ? 'bg-primary/10 text-primary' 
                   : 'bg-muted text-muted-foreground'
               }`}>
                 {t(`status.${listing.status}`)}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground block mb-1">{t('condition')}</span>
                <p className="font-medium capitalize text-lg">{t(`conditions.${listing.item_condition}`)}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">{t('quantity')}</span>
                <p className="font-medium text-lg">{t('available', {count: listing.quantity})}</p>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <Button size="lg" className="w-full text-lg py-6" disabled={listing.status !== 'active'}>
                {listing.status === 'active' ? t('buyNow') : t('soldOut')}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('description')}</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
        </div>
      </div>
    </BoxingWrapper>
  );
}