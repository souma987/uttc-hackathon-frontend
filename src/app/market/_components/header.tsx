"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserMenu } from "./user-menu";
import { LanguageToggle } from "./language-toggle";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const t = useTranslations("market.header");

  const navItems = [
    { href: "/market", label: t("nav.browse") },
    { href: "/market/sell", label: t("nav.sell") },
    { href: "/market/messages", label: t("nav.messages") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Note: Outer layout already provides horizontal padding; avoid double-padding on mobile */}
      <div className="w-full">
        <div className="flex h-16 items-center justify-between">
          {/* Left cluster: Mobile, Logo, Nav (left-aligned) */}
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link href="/market" className="flex items-center space-x-2">
              <span className="font-bold text-xl">{t("logo")}</span>
            </Link>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right cluster: Language & User */}
          <div className="flex items-center space-x-4">
            {/* Hide Language toggle on small screens; it is available inside the mobile menu */}
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
