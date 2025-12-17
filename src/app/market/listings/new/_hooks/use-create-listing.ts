'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createListing } from '@/lib/services/listings';
import { uploadImage } from '@/lib/services/storage';
import type { ItemCondition } from '@/lib/api/listings';

export interface UploadSlot {
  id: string;
  imageUrl: string | null;
  isLoading: boolean;
}

export interface FormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  quantity: string;
}

export interface FormErrors {
  title?: string;
  price?: string;
  quantity?: string;
  images?: string;
  condition?: string;
}

export interface UseCreateListingResult {
  formData: FormData;
  uploadedImages: UploadSlot[];
  errors: FormErrors;
  isSubmitting: boolean;
  updateField: (field: keyof FormData, value: string) => void;
  handleImageUpload: (files: FileList | null) => Promise<void>;
  removeImage: (id: string) => void;
  validate: () => boolean;
  submit: (isActibe: boolean) => Promise<void>;
  reset: () => void;
}

export const MIN_PRICE = 100;

export function useCreateListing(
  t: (key: string) => string
): UseCreateListingResult {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    condition: '',
    quantity: '1',
  });
  const [uploadedImages, setUploadedImages] = useState<UploadSlot[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  }, [errors]);

  const handleImageUpload = useCallback(async (files: FileList | null) => {
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
    } catch (error) {
      console.error('Image upload error:', error);
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setUploadedImages((prev) => prev.filter((slot) => slot.id !== id));
    // Clear images error if images exist
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = t('errors.titleRequired');
    } else if (formData.title.trim().length < 3) {
      newErrors.title = t('errors.titleMinLength');
    }

    // Validate price
    if (!formData.price.trim()) {
      newErrors.price = t('errors.priceRequired');
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum < MIN_PRICE) {
        newErrors.price = t('errors.priceMin');
      }
    }

    // Validate quantity
    if (formData.quantity && formData.quantity.trim()) {
      const quantityNum = parseInt(formData.quantity, 10);
      if (isNaN(quantityNum) || quantityNum < 1) {
        newErrors.quantity = t('errors.quantityMin');
      }
    }

    // Validate condition
    if (!formData.condition) {
      newErrors.condition = t('errors.conditionRequired');
    }

    // Validate images
    const validImages = uploadedImages.filter(
      (slot) => !slot.isLoading && slot.imageUrl !== null
    );
    if (validImages.length === 0) {
      newErrors.images = t('errors.imagesRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, uploadedImages, t]);

  const submit = useCallback(async (isActive: boolean) => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const validImages = uploadedImages.filter(
        (slot) => !slot.isLoading && slot.imageUrl !== null
      );

      const listingData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        images: validImages.map((slot) => ({ url: slot.imageUrl! })),
        price: parseFloat(formData.price),
        quantity: formData.quantity ? parseInt(formData.quantity, 10) : undefined,
        item_condition: (formData.condition || undefined) as ItemCondition | undefined,
        is_active: isActive,
      };

      const listing = await createListing(listingData);
      toast.success(t('toastSuccess'));
      reset();
      router.push(`/market/listings/${listing.id}`);
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast.error(t('errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, uploadedImages, validate, t, router]);

  const reset = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      price: '',
      condition: '',
      quantity: '1',
    });
    setUploadedImages([]);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    uploadedImages,
    errors,
    isSubmitting,
    updateField,
    handleImageUpload,
    removeImage,
    validate,
    submit,
    reset,
  };
}

