"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Monitor, Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const options = [
  { key: "light" as const, Icon: Sun },
  { key: "dark" as const, Icon: Moon },
  { key: "system" as const, Icon: Monitor },
];

export function ThemeToggleMobile() {
  const t = useTranslations("market.header");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const selected = (theme ?? "system") as typeof options[number]["key"];

  return (
    <ToggleGroup
      type="single"
      value={mounted ? selected : "system"}
      onValueChange={(value) => {
        if (value) setTheme(value as typeof options[number]["key"]);
      }}
      className="flex"
    >
      {options.map(({ key, Icon }) => {
        const label = t(`theme.${key}`);
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <span> {/* Needed to consume the data-state attribute */}
                <ToggleGroupItem
                  value={key}
                  aria-label={label}
                  className="h-10 w-10 data-[state=on]:bg-accent"
                >
                  <Icon className="h-5 w-5" />
                </ToggleGroupItem>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </ToggleGroup>
  );
}
