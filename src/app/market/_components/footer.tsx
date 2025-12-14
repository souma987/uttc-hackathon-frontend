import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("market.footer");

  const footerLinks = {
    company: [
      { href: "/about", label: t("links.about") },
      { href: "/careers", label: t("links.careers") },
      { href: "/press", label: t("links.press") },
    ],
    support: [
      { href: "/help", label: t("links.help") },
      { href: "/safety", label: t("links.safety") },
      { href: "/contact", label: t("links.contact") },
    ],
    legal: [
      { href: "/terms", label: t("links.terms") },
      { href: "/privacy", label: t("links.privacy") },
      { href: "/cookies", label: t("links.cookies") },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/market" className="font-bold text-xl">
              {t("logo")}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-3">{t("sections.company")}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-3">{t("sections.support")}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-3">{t("sections.legal")}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground py-5">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
