'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {MIN_PRICE, useCreateListing} from '@/app/market/listings/new/_hooks/use-create-listing';
import {useListingSuggestions} from '@/app/market/listings/new/_hooks/use-listing-suggestions';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {FieldGroup, FieldLegend, FieldSet} from '@/components/ui/field';
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Separator} from '@/components/ui/separator';
import {Spinner} from '@/components/ui/spinner';
import Image from 'next/image';
import {X} from 'lucide-react';
import React from "react";

export function CreateListingForm() {
  const t = useTranslations('market.listing.create');
  const locale = useLocale();
  const router = useRouter();
  const {
    formData,
    uploadedImages,
    errors,
    isSubmitting,
    updateField,
    handleImageUpload,
    removeImage,
    submit,
  } = useCreateListing(t);

  const suggestionLanguage = locale === 'ja' ? 'ja' : 'en';

  const {
    suggestions,
    isLoading: isLoadingSuggestions,
    error: suggestionsError,
    hasInput: hasDescriptionInput,
    hasMinimumInput: hasMinimumDescription,
  } = useListingSuggestions({
    title: formData.title,
    description: formData.description,
    condition: formData.condition,
    language: suggestionLanguage,
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit(true);
  };

  const handleCancel = () => {
    router.push('/market');
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleImageUpload(e.target.files);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
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
              onChange={handleImageInputChange}
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
          {errors.images && (
            <p className="text-sm text-destructive">{errors.images}</p>
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
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            aria-invalid={!!errors.title}
            required
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </FieldGroup>
      </FieldSet>

      {/* Description Field */}
      <FieldSet>
        <FieldGroup>
          <Label htmlFor="description">{t('descriptionLabel')}</Label>
          <Textarea
            id="description"
            placeholder={t('descriptionPlaceholder')}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
          <div className="mt-3 rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('suggestions.title')}</p>
                <p className="text-xs text-muted-foreground">
                  {isLoadingSuggestions
                    ? t('suggestions.loading')
                    : t('suggestions.subtitle')}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {isLoadingSuggestions ? (
                <div className="space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-muted-foreground/30" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted-foreground/30" />
                </div>
              ) : suggestionsError ? (
                <p className="text-sm text-destructive">{t('suggestions.error')}</p>
              ) : !hasDescriptionInput ? (
                <p className="text-sm text-muted-foreground">{t('suggestions.prompt')}</p>
              ) : !hasMinimumDescription ? (
                <p className="text-sm text-muted-foreground">{t('suggestions.moreDetail')}</p>
              ) : suggestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('suggestions.none')}</p>
              ) : (
                <ul className="space-y-2 list-disc pl-5 text-sm leading-relaxed">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
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
              placeholder={String(MIN_PRICE)}
              min={MIN_PRICE}
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              aria-invalid={!!errors.price}
              required
            />
          </InputGroup>
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price}</p>
          )}
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
            min="1"
            value={formData.quantity}
            onChange={(e) => updateField('quantity', e.target.value)}
            aria-invalid={!!errors.quantity}
            required
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity}</p>
          )}
        </FieldGroup>
      </FieldSet>

      {/* Condition Field */}
      <FieldSet>
        <FieldGroup>
          <Label>{t('conditionLabel')}</Label>
          <RadioGroup
            value={formData.condition}
            onValueChange={(value) => updateField('condition', value)}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="new" id="condition-new" />
              <Label htmlFor="condition-new" className="cursor-pointer">
                {t('conditions.new')}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="excellent" id="condition-excellent" />
              <Label htmlFor="condition-excellent" className="cursor-pointer">
                {t('conditions.excellent')}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="good" id="condition-good" />
              <Label htmlFor="condition-good" className="cursor-pointer">
                {t('conditions.good')}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="not_good" id="condition-not-good" />
              <Label htmlFor="condition-not-good" className="cursor-pointer">
                {t('conditions.not_good')}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="bad" id="condition-bad" />
              <Label htmlFor="condition-bad" className="cursor-pointer">
                {t('conditions.bad')}
              </Label>
            </div>
          </RadioGroup>
          {errors.condition && (
            <p className="text-sm text-destructive">{errors.condition}</p>
          )}
        </FieldGroup>
      </FieldSet>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          {t('cancel')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => submit(false)}
          disabled={isSubmitting}
        >
          {t('saveDraft')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('publish')}
        </Button>
      </div>
    </form>
  );
}
