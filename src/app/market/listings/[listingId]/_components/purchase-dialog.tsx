"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createOrder } from "@/lib/services/orders";
import type { Listing } from "@/lib/api/listings";

type PurchaseDialogProps = {
  listing: Pick<Listing, "id" | "quantity" | "status" | "title" | "price">;
};

export function PurchaseDialog({ listing }: PurchaseDialogProps) {
  const t = useTranslations("market.listing");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUnavailable = listing.status !== "active" || listing.quantity <= 0;

  const handleConfirm = async () => {
    const parsedQuantity = Number(quantity);
    const isInvalidQuantity =
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0 ||
      parsedQuantity > listing.quantity;

    if (isInvalidQuantity) {
      toast.error(t("purchase.errors.invalidQuantity", { max: listing.quantity }));
      return;
    }

    try {
      setIsSubmitting(true);
      const order = await createOrder({
        listing_id: listing.id,
        quantity: parsedQuantity,
      });

      toast.success(t("purchase.toastSuccess"));
      setOpen(false);
      router.push(`/market/orders/${order.id}`);
    } catch (error) {
      console.error("Failed to create order", error);
      const message = (error as Error)?.message;

      if (message === "Not authenticated") {
        toast.error(t("purchase.authRequired"));
        router.push(`/auth?next=/market/listings/${listing.id}`);
        return;
      }

      toast.error(t("purchase.toastError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return;
        setOpen(nextOpen);
        if (nextOpen) {
          setQuantity("1");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="w-full text-lg py-6" disabled={isUnavailable}>
          {listing.status === "active" ? t("buyNow") : t("soldOut")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("purchase.title")}</DialogTitle>
          <DialogDescription>{t("purchase.subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="quantity">{t("purchase.quantityLabel")}</Label>
          <Input
            id="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={listing.quantity}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder={t("purchase.quantityPlaceholder")}
            disabled={isSubmitting}
          />
          <p className="text-sm text-muted-foreground">
            {t("available", { count: listing.quantity })}
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              {t("purchase.cancel")}
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? t("purchase.submitting") : t("purchase.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
