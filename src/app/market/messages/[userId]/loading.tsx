import { Skeleton } from "@/components/ui/skeleton";
import { BoxingWrapper } from "@/components/boxing-wrapper";

export default function MessagesLoading() {
  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8" size="sm">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="h-[60vh] w-full rounded-lg" />
      </div>
    </BoxingWrapper>
  );
}
