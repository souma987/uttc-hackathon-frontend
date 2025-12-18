"use client"

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import { SendHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type ChatMessage = {
  id: string
  content: string
  direction: "incoming" | "outgoing"
  sender?: string
  timestamp?: string
  avatarUrl?: string
}

type ChatThreadProps = {
  messages: ChatMessage[]
  className?: string
  isSending?: boolean
  onSendMessage?: (message: string) => void
}

export function ChatThread({
  messages,
  className,
  isSending = false,
  onSendMessage,
}: ChatThreadProps) {
  const t = useTranslations("chat")
  const [draft, setDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const sendDraft = () => {
    const trimmed = draft.trim()
    if (!trimmed || isSending) return

    onSendMessage?.(trimmed)
    setDraft("")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendDraft()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      sendDraft()
    }
  }

  const scrollToBottom = () => {
    const scrollArea = scrollRef.current;
    if (!scrollArea) return

    scrollArea.scrollTop = scrollArea.scrollHeight;
  }

  useEffect(() => {
    scrollToBottom();
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [messages.length])

  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-3", className)}>
      <div className="flex-1 min-h-0 overflow-y-scroll" ref={scrollRef}>
        <div className="flex flex-col gap-3 px-1 pr-2 py-2 pb-6">
          {messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("emptyState")}
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full items-start gap-2",
                  message.direction === "outgoing" ? "justify-end" : "justify-start"
                )}
              >
                {message.direction === "incoming" ? (
                  <Avatar>
                    {message.avatarUrl ? (
                      <AvatarImage
                        src={message.avatarUrl}
                        alt={message.sender ?? ""}
                      />
                    ) : null}
                    <AvatarFallback>
                      {(message.sender ?? "?").slice(0, 1).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                <div className="flex min-w-[140px] max-w-[75%] flex-col gap-1">
                  {message.direction === "incoming" && message.sender ? (
                    <span className="text-xs font-semibold text-muted-foreground">
                      {message.sender}
                    </span>
                  ) : null}

                  <div
                    className={cn(
                      "flex items-end gap-2",
                      message.direction === "outgoing" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.direction === "outgoing" && message.timestamp ? (
                      <span className="text-[11px] leading-none text-muted-foreground">
                        {message.timestamp}
                      </span>
                    ) : null}

                    <div
                      className={cn(
                        "flex flex-col gap-1 rounded-2xl px-3 py-2 text-sm",
                        message.direction === "outgoing"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <span>{message.content}</span>
                    </div>

                    {message.direction === "incoming" && message.timestamp ? (
                      <span className="text-[11px] leading-none text-muted-foreground">
                        {message.timestamp}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        <InputGroup className="items-start">
          <InputGroupTextarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("inputPlaceholder")}
            rows={3}
            className="pr-12"
          />
          <InputGroupButton
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={isSending || draft.trim().length === 0}
            className="absolute bottom-2 right-2 rounded-full"
            aria-label={isSending ? t("sending") : t("send")}
          >
            <SendHorizontal className="size-4" />
          </InputGroupButton>
        </InputGroup>
      </form>
    </div>
  )
}
