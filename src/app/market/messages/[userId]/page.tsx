import { BoxingWrapper } from "@/components/boxing-wrapper";
import { ChatThread } from "@/components/chat/chat-thread";

export default async function MessagesPage({ params }: PageProps<'/market/messages/[userId]'>) {
  const { userId } = await params;

  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8" size="sm">
      <ChatThread receiverId={userId} className="h-[70vh]" />
    </BoxingWrapper>
  );
}
