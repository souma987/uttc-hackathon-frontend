import { Skeleton } from '@/components/ui/skeleton'

export default function OrdersLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:p-8">
      <div className="mb-4 h-7 w-40"><Skeleton className="h-7 w-40" /></div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="mt-4 flex flex-col divide-y rounded-md border">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
