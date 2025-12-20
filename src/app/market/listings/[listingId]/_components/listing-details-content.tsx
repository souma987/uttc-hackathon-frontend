'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Languages, Loader2 } from 'lucide-react';
import { ListingGallery } from './listing-gallery';
import { PurchaseDialog } from './purchase-dialog';
import { UserInfoRow } from '@/components/user/user-info-row';
import { translateListing, type TranslateResult } from '@/lib/services/translation';
import type { Listing } from '@/lib/api/listings';
import type { UserProfile } from '@/lib/api/user';

interface ListingDetailsContentProps {
  listing: Listing;
  seller: UserProfile | null;
  locale: string;
}

export function ListingDetailsContent({ listing, seller, locale }: ListingDetailsContentProps) {
  const t = useTranslations('market.listing');
  const [translatedData, setTranslatedData] = useState<TranslateResult | null>(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [canTranslate, setCanTranslate] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    async function handleTranslation() {
      setIsTranslating(true);
      try {
        const result = await translateListing({
          title: listing.title,
          description: listing.description,
          target_language: locale,
        });

        if (result) {
          setTranslatedData(result);
          setCanTranslate(true);
          setIsTranslated(true);
        }
      } catch (error) {
        console.error('Failed to translate listing:', error);
      } finally {
        setIsTranslating(false);
      }
    }

    void handleTranslation();
  }, [listing.title, listing.description, locale]);

  const displayTitle = isTranslated && translatedData ? translatedData.translated_title : listing.title;
  const displayDescription = isTranslated && translatedData ? translatedData.translated_description : listing.description;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Section - Left */}
      <ListingGallery images={listing.images} title={displayTitle} />

      {/* Details Section - Right */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{displayTitle}</h1>
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
          <Toggle
            pressed={isTranslated}
            onPressedChange={setIsTranslated}
            disabled={!canTranslate || isTranslating}
            aria-label="Translate"
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            {isTranslating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Languages className="h-4 w-4" />
            )}
            {isTranslated ? t('showOriginal') : t('translate')}
          </Toggle>
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
            <PurchaseDialog listing={listing} />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('seller')}</h3>
          <UserInfoRow user={seller} />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('description')}</h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {displayDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
