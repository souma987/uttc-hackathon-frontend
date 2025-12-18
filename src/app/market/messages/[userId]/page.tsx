import { BoxingWrapper } from "@/components/boxing-wrapper";
import { ChatThread } from "@/components/chat/chat-thread";

interface MessagesPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const { userId } = await params;

  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8" size="sm">
      <ChatThread receiverId={userId} className="h-[70vh]" />
    </BoxingWrapper>
  );
}
