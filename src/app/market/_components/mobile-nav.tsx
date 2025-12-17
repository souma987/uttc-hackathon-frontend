"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Menu, LayoutGrid, MessageSquare, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ThemeToggleMobile } from "@/app/_components/theme-toggle-mobile";

export function MobileNav() {
  const t = useTranslations("market.header");
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/market", label: t("nav.browse"), Icon: LayoutGrid },
    { href: "/market/listings/new", label: t("nav.sell"), Icon: Store },
    { href: "/market/messages", label: t("nav.messages"), Icon: MessageSquare },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("nav.toggle")}</span>
        </Button>
      </SheetTrigger>
      {/* Rebuilt mobile experience: top sheet, full-height, large tappable actions */}
      <SheetContent side="top" className="h-[100vh] p-0 overflow-auto">
        <div className="p-4">
          <SheetHeader>
            <SheetTitle>{t("logo")}</SheetTitle>
          </SheetHeader>
        </div>

        <Separator />

        <nav className="flex flex-col gap-2 p-4">
          {navItems.map(({ href, label, Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start h-12 text-base">
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-2 px-4">
          <Separator />
        </div>

        <div className="p-4 flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">{t("themeLabel")}</span>
          <ThemeToggleMobile />
        </div>
      </SheetContent>
    </Sheet>
  );
}
