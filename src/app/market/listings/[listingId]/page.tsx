'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { listingsApi, Listing } from '@/lib/api/listings';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ListingDetailsPageProps {
  params: Promise<{
    listingId: string;
  }>;
}

export default function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { listingId } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const fetchedListing = await listingsApi.getListing(listingId);
        setListing(fetchedListing);
      } catch (err) {
        console.error('Failed to fetch listing:', err);
        setError('Failed to load listing. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Skeleton className="h-[400px] w-full rounded-lg mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-12 w-full md:w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section - Left */}
        <div className="flex flex-col gap-4">
          {listing.images && listing.images.length > 0 ? (
            <>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={typeof listing.images[0] === 'string' ? listing.images[0] : listing.images[0].url}
                  alt={typeof listing.images[0] === 'string' ? listing.title : listing.images[0].alt || listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.images.map((image, index) => (
                  <div key={index} className="relative h-20 w-20 flex-none overflow-hidden rounded-md border bg-muted cursor-pointer hover:opacity-80 transition-opacity">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={typeof image === 'string' ? image : image.url}
                      alt={typeof image === 'string' ? `View ${index + 1}` : image.alt || `View ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border bg-muted">
              <span className="text-muted-foreground">No Image Available</span>
            </div>
          )}
        </div>

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
                 {listing.status}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground block mb-1">Condition</span>
                <p className="font-medium capitalize text-lg">{listing.item_condition.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Quantity</span>
                <p className="font-medium text-lg">{listing.quantity} available</p>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <Button size="lg" className="w-full text-lg py-6" disabled={listing.status !== 'active'}>
                {listing.status === 'active' ? 'Buy Now' : 'Sold Out'}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}