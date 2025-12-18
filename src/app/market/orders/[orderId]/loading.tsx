import { BoxingWrapper } from '@/components/boxing-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function OrderDetailsLoading() {
  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8">
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>

        <Separator />

        {/* Item Information Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-32" />
          <div className="flex gap-6">
            <Skeleton className="h-32 w-32 rounded-lg flex-shrink-0" />
            <div className="flex flex-col justify-center space-y-3">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Information Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-7 w-48" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-7 w-32" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoxingWrapper>
  );
}
