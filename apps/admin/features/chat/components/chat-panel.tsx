"use client"

import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

type ChatMessage = {
  id: string
  from: "visitor" | "admin"
  body: string
}

type Conversation = {
  id: string
  name: string
  preview: string
  messages: ChatMessage[]
}

const initialConversations: Conversation[] = [
  {
    id: "hiring",
    name: "Avery Chen",
    preview: "Are you open to a contract role?",
    messages: [
      {
        id: "hiring-1",
        from: "visitor",
        body: "Hi Julius, I saw the portfolio. Are you open to a contract role this quarter?",
      },
    ],
  },
  {
    id: "project",
    name: "Mina Ortiz",
    preview: "Can you walk through project one?",
    messages: [
      {
        id: "project-1",
        from: "visitor",
        body: "Could you walk through the first project on the site? I want to know which parts you built.",
      },
    ],
  },
]

export function ChatPanel() {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeId, setActiveId] = useState(initialConversations[0]?.id ?? "")
  const [draft, setDraft] = useState("")

  const active = conversations.find((conversation) => conversation.id === activeId)

  function sendMessage() {
    const body = draft.trim()
    if (!body || !active) return

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === active.id
          ? {
              ...conversation,
              preview: body,
              messages: [
                ...conversation.messages,
                { id: `${active.id}-${conversation.messages.length + 1}`, from: "admin", body },
              ],
            }
          : conversation
      )
    )
    setDraft("")
  }

  return (
    <div className="mx-4 grid min-h-[32rem] overflow-hidden rounded-xl border lg:mx-6 lg:grid-cols-[16rem_1fr]">
      <aside className="border-b lg:border-r lg:border-b-0">
        <p className="border-b px-4 py-3 text-sm font-medium">Inbox</p>
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => setActiveId(conversation.id)}
                className={cn(
                  "flex w-full flex-col gap-1 px-4 py-3 text-left text-sm hover:bg-muted",
                  conversation.id === activeId && "bg-muted"
                )}
              >
                <span className="font-medium">{conversation.name}</span>
                <span className="line-clamp-1 text-muted-foreground">
                  {conversation.preview}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="flex min-h-80 flex-col">
        <p className="border-b px-4 py-3 text-sm font-medium">
          {active?.name ?? "Select a conversation"}
        </p>
        <div className="flex flex-1 flex-col gap-3 p-4">
          {active?.messages.map((message) => (
            <p
              key={message.id}
              className={cn(
                "max-w-md rounded-lg px-3 py-2 text-sm",
                message.from === "admin"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.body}
            </p>
          ))}
        </div>
        <form
          className="flex items-end gap-2 border-t p-4"
          onSubmit={(event) => {
            event.preventDefault()
            sendMessage()
          }}
        >
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Reply to this inquiry"
            rows={2}
          />
          <Button type="submit" disabled={!draft.trim()}>
            Send
          </Button>
        </form>
      </section>
    </div>
  )
}
