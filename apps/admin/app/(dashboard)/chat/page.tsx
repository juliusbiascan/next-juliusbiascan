import { ChatPanel } from "@/features/chat/components/chat-panel"
import { PageHeading } from "@/features/site/components/page-heading"

export default function ChatPage() {
  return (
    <>
      <PageHeading
        title="Chat"
        description="Messages from people who reach the portfolio."
      />
      <ChatPanel />
    </>
  )
}
