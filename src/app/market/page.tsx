import {getTranslations} from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import {fetchListingsFeed} from "@/lib/services/feed";

export default async function MarketTopPage() {
  const [t, listings] = await Promise.all([
    getTranslations("market.feed"),
    fetchListingsFeed(),
  ]);

  if (listings.length === 0) {
    return (
      <section className="mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("emptyState.title")}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          {t("emptyState.subtitle")}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-8">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t("heading")}
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {t("subheading")}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {listings.map((listing) => (
          <article key={listing.id}>
            <Link
              href={`/market/listings/${listing.id}`}
              aria-label={listing.title}
              className="group flex flex-col gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="relative overflow-hidden rounded-2xl bg-muted">
                <div className="relative aspect-square">
                  <Image
                    src={listing.mainImage}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 960px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                    <span className="inline-flex rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                      {`￥${listing.price}`}
                    </span>
                  </div>
                </div>
              </div>
              <h2 className="line-clamp-2 text-xs font-medium leading-snug text-foreground sm:text-sm">
                {listing.title}
              </h2>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
