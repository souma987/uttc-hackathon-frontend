import {Skeleton} from "@/components/ui/skeleton";

export default function MarketLoading() {
  const placeholders = Array.from({length: 12});

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-3 w-56 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {placeholders.map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-3 w-4/5 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
