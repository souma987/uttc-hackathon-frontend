"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Monitor, Moon, Sun, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options = [
  { key: "light" as const, Icon: Sun },
  { key: "dark" as const, Icon: Moon },
  { key: "system" as const, Icon: Monitor },
];

export function ThemeMenu() {
  const t = useTranslations("market.header");
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // What user selected (persisted to localStorage). Defaults to system.
  const selected = (theme ?? "system") as typeof options[number]["key"];

  // What is actually rendered (resolved from OS when on system).
  const resolved = useMemo(() => {
    if (!mounted) return "system" as const;
    if (selected === "system") {
      return (systemTheme ?? "system") as typeof options[number]["key"];
    }
    return selected;
  }, [mounted, selected, systemTheme]);

  const ActiveIcon = options.find(({ key }) => key === resolved)?.Icon ?? Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={t("theme.menuLabel")}
          className="hidden md:inline-flex"
        >
          <ActiveIcon className="h-5 w-5" />
          <span className="sr-only">{t("theme.menuLabel")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {options.map(({ key, Icon }) => {
          const isSelected = selected === key;
          return (
            <DropdownMenuItem
              key={key}
              className="flex items-center gap-2"
              onSelect={() => setTheme(key)}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-sm">{t(`theme.${key}`)}</span>
              {isSelected ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
