'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { uploadImage } from '@/lib/services/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldSet, FieldGroup, FieldLegend } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { X } from 'lucide-react';

interface UploadSlot {
  id: string;
  imageUrl: string | null;
  isLoading: boolean;
}

export function CreateListingForm() {
  const t = useTranslations('market.listing.create');
  const [uploadedImages, setUploadedImages] = useState<UploadSlot[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.currentTarget;
    const files = inputElement.files;
    if (!files) return;

    // Create placeholder slots for all files immediately
    const newSlots: UploadSlot[] = Array.from(files).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      imageUrl: null,
      isLoading: true,
    }));

    setUploadedImages((prev) => [...prev, ...newSlots]);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = await uploadImage(file);

        setUploadedImages((prev) => {
          const updated = [...prev];
          const startIndex = prev.length - files.length;
          const slotIndex = startIndex + i;

          if (imageUrl) {
            updated[slotIndex] = { ...updated[slotIndex], imageUrl, isLoading: false };
          } else {
            // Remove failed uploads
            updated.splice(slotIndex, 1);
          }
          return updated;
        });
      }
    } finally {
      // Reset the input
      inputElement.value = '';
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((slot) => slot.id !== id));
  };

  return (
    <form className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Separator />

      {/* File Upload Section */}
      <FieldSet>
        <FieldLegend>{t('images')}</FieldLegend>
        <FieldGroup>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="space-y-2">
                <p className="font-medium">{t('uploadPrompt')}</p>
                <p className="text-sm text-muted-foreground">{t('uploadHint')}</p>
              </div>
            </label>
          </div>

          {/* Image Thumbnails */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedImages.map((slot) => (
                <div key={slot.id} className="relative group">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                    {slot.isLoading ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <Spinner className="w-6 h-6" />
                      </div>
                    ) : (
                      slot.imageUrl && (
                        <Image
                          src={slot.imageUrl}
                          alt="Uploaded image"
                          fill
                          className="object-cover"
                        />
                      )
                    )}
                  </div>
                  {!slot.isLoading && slot.imageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => removeImage(slot.id)}
                      aria-label="Remove image"
                      className="absolute top-2 right-2 z-10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </FieldGroup>
      </FieldSet>

      <Separator />

      {/* Title Field */}
      <FieldSet>
        <FieldGroup>
          <Label htmlFor="title">{t('titleLabel')}</Label>
          <Input
            id="title"
            type="text"
            placeholder={t('titlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FieldGroup>
      </FieldSet>

      {/* Description Field */}
      <FieldSet>
        <FieldGroup>
          <Label htmlFor="description">{t('descriptionLabel')}</Label>
          <Textarea
            id="description"
            placeholder={t('descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FieldGroup>
      </FieldSet>

      {/* Price Field */}
      <FieldSet>
        <FieldGroup>
          <Label htmlFor="price">{t('priceLabel')}</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">¥</InputGroupAddon>
            <InputGroupInput
              id="price"
              type="number"
              placeholder="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="100"
            />
          </InputGroup>
        </FieldGroup>
      </FieldSet>

      {/* Condition Field */}
      <FieldSet>
        <FieldGroup>
          <Label>{t('conditionLabel')}</Label>
          <RadioGroup value={condition} onValueChange={setCondition}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="new" id="condition-new" />
              <Label htmlFor="condition-new" className="cursor-pointer">{t('conditions.new')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="excellent" id="condition-excellent" />
              <Label htmlFor="condition-excellent" className="cursor-pointer">{t('conditions.excellent')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="good" id="condition-good" />
              <Label htmlFor="condition-good" className="cursor-pointer">{t('conditions.good')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="not_good" id="condition-not-good" />
              <Label htmlFor="condition-not-good" className="cursor-pointer">{t('conditions.not_good')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="bad" id="condition-bad" />
              <Label htmlFor="condition-bad" className="cursor-pointer">{t('conditions.bad')}</Label>
            </div>
          </RadioGroup>
        </FieldGroup>
      </FieldSet>

      {/* Quantity Field */}
      <FieldSet>
        <FieldGroup>
          <Label htmlFor="quantity">{t('quantityLabel')}</Label>
          <Input
            id="quantity"
            type="number"
            placeholder={t('quantityPlaceholder')}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
        </FieldGroup>
      </FieldSet>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline">{t('cancel')}</Button>
        <Button>{t('publish')}</Button>
      </div>
    </form>
  );
}
