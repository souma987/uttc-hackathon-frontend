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
import { fetchMessagesWithUser, sendMessage } from "@/lib/services/messages"
import { awaitCurrentUser } from "@/lib/services/auth"
import type { Message as ApiMessage } from "@/lib/api/messages"

type ChatMessage = {
  id: string
  content: string
  direction: "incoming" | "outgoing"
  sender?: string
  timestamp?: string
  avatarUrl?: string
}

type ChatThreadProps = {
  receiverId: string
  receiverName?: string
  receiverAvatarUrl?: string
  className?: string
}

export function ChatThread({
  receiverId,
  receiverName,
  receiverAvatarUrl,
  className,
}: ChatThreadProps) {
  const t = useTranslations("chat")
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const sendDraft = () => {
    const trimmed = draft.trim()
    if (!trimmed || isSending) return
    if (!currentUserId) {
      setError(t("authRequired"))
      return
    }

    setIsSending(true)
    setError(null)

    sendMessage({ receiver_id: receiverId, content: trimmed })
      .then((created) => {
        setMessages((prev) => [
          ...prev,
          mapApiMessage(created, currentUserId, receiverName, receiverAvatarUrl),
        ])
        setDraft("")
      })
      .catch((err) => {
        console.error("Failed to send message", err)
        setError(t("errorGeneric"))
      })
      .finally(() => setIsSending(false))
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

  useEffect(() => {
    let active = true

    const loadMessages = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const user = await awaitCurrentUser()
        if (!user) {
          setCurrentUserId(null)
          if (active) setError(t("authRequired"))
          return
        }

        setCurrentUserId(user.uid)

        const data = await fetchMessagesWithUser(receiverId)
        if (!active) return

        const safeData = Array.isArray(data) ? data.filter(Boolean) : []
        setMessages(
          safeData.map((message) =>
            mapApiMessage(message, user.uid, receiverName, receiverAvatarUrl)
          )
        )
      } catch (err) {
        console.error("Failed to load messages", err)
        if (active) setError(t("errorGeneric"))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadMessages();

    return () => {
      active = false
    }
  }, [receiverId, receiverName, receiverAvatarUrl, t])

  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-3", className)}>
      <div className="flex-1 min-h-0 overflow-y-scroll" ref={scrollRef}>
        <div className="flex flex-col gap-3 px-1 pr-2 py-2 pb-6">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("loading")}
            </p>
          ) : error ? (
            <p className="py-8 text-center text-sm text-destructive">
              {error}
            </p>
          ) : messages.length === 0 ? (
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
            disabled={isSending || isLoading || Boolean(error)}
          />
          <InputGroupButton
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={
              isSending ||
              isLoading ||
              Boolean(error) ||
              draft.trim().length === 0
            }
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

function mapApiMessage(
  apiMessage: ApiMessage,
  currentUserId: string,
  receiverName?: string,
  receiverAvatarUrl?: string,
): ChatMessage {
  const direction = apiMessage.sender_id === currentUserId ? "outgoing" : "incoming"

  return {
    id: apiMessage.id,
    content: apiMessage.content,
    direction,
    sender: direction === "incoming" ? receiverName : undefined,
    avatarUrl: direction === "incoming" ? receiverAvatarUrl : undefined,
    timestamp: new Date(apiMessage.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}
