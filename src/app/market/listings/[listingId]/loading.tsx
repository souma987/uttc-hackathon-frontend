import { Skeleton } from '@/components/ui/skeleton';

export default function ListingLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Skeleton className="h-[400px] w-full rounded-lg mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-20 w-20 rounded-md" />
            <Skeleton className="h-20 w-20 rounded-md" />
            <Skeleton className="h-20 w-20 rounded-md" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-12 w-full md:w-1/2" />
        </div>
      </div>
    </div>
  );
}
