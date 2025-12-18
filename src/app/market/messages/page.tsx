import { BoxingWrapper } from "@/components/boxing-wrapper";
import { ThreadsList } from "./_components/threads-list";

export default function MessagesIndexPage() {
  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8" size="sm">
      <ThreadsList />
    </BoxingWrapper>
  );
}
