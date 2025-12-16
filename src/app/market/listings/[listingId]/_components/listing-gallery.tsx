'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ListingImage } from '@/lib/api/listings';

interface ListingGalleryProps {
  images: ListingImage[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const t = useTranslations('market.listing');
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg border bg-muted">
        <span className="text-muted-foreground">{t('noImage')}</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        <Image
          src={typeof selectedImage === 'string' ? selectedImage : selectedImage.url}
          alt={typeof selectedImage === 'string' ? title : selectedImage.alt || title}
          className="object-cover"
          fill
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-1 pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-20 w-20 flex-none overflow-hidden rounded-md border bg-muted transition-all ${
                selectedIndex === index ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={typeof image === 'string' ? image : image.url}
                alt={typeof image === 'string' ? t('viewImage', {index: index + 1}) : image.alt || t('viewImage', {index: index + 1})}
                className="object-cover"
                fill
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
