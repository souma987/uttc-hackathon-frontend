"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const locales = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
];

export function LanguageToggle() {
  const t = useTranslations("market.header");
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
      router.refresh();
    });
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange} disabled={isPending}>
      <SelectTrigger className="w-[130px]" aria-label={t("languageLabel")}>
        <SelectValue placeholder={t("languageLabel")} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale.code} value={locale.code}>
            {locale.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}