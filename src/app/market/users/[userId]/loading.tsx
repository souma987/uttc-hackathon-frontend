import { BoxingWrapper } from '@/components/boxing-wrapper';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingUserProfile() {
  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8" size="sm">
      <div className="mb-6">
        <div className="h-7 w-40">
          <Skeleton className="h-7 w-40" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </BoxingWrapper>
  );
}
