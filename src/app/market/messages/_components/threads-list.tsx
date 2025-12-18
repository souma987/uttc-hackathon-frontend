"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { Conversation } from "@/lib/api/messages"
import { fetchConversations } from "@/lib/services/messages"


export function ThreadsList() {
  const t = useTranslations("market.messagesList")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await fetchConversations()
        if (!active) return
        setConversations(data)
      } catch (e) {
        console.error(e)
        if (!active) return
        setError(t("errorGeneric"))
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [t])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

      {loading ? (
        <div className="flex flex-col divide-y rounded-md border">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : conversations.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
      ) : (
        <ul className="flex flex-col divide-y rounded-md border">
          {conversations.map((item) => (
            <li key={item.user.id}>
              <Link
                href={`/market/messages/${item.user.id}`}
                className="flex items-center gap-3 p-4 transition hover:bg-muted/60"
              >
                <Avatar className="h-10 w-10">
                  {item.user.avatar_url ? (
                    <AvatarImage src={item.user.avatar_url} alt={item.user.name} />
                  ) : null}
                  <AvatarFallback>
                    {item.user.name?.slice(0, 1).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium truncate">{item.user.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.message.content}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
