"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Order, OrderStatus } from '@/lib/api/orders'

type OrdersListProps = {
  currentUserId: string
  orders: Order[]
}

export function OrdersList({ currentUserId, orders }: OrdersListProps) {
  const t = useTranslations('market.ordersList')
  const statusT = useTranslations('market.order.statuses')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const statuses: OrderStatus[] = ['paid', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed']

  const filteredOrders = useMemo(() => {
    return statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  const { bought, sold } = useMemo(() => {
    const bought = filteredOrders.filter((o) => o.buyer_id === currentUserId)
    const sold = filteredOrders.filter((o) => o.seller_id === currentUserId)
    return { bought, sold }
  }, [filteredOrders, currentUserId])

  const renderList = (list: Order[], emptyKey: string) => {
    if (list.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">{t(`empty.${emptyKey}`)}</p>
      )
    }

    return (
      <ul className="flex flex-col divide-y rounded-md border">
        {list.map((order) => {
          const isSeller = order.seller_id === currentUserId
          return (
            <li key={order.id}>
              <Link
                href={`/market/orders/${order.id}`}
                className="flex items-center gap-4 p-4 transition hover:bg-muted/60"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={order.listing_main_image}
                    alt={order.listing_title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{order.listing_title}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {isSeller ? (
                      <>×{order.quantity}</>
                    ) : (
                      <>×{order.quantity} • ¥{order.total_price.toLocaleString()}</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isSeller ? (
                    <span className="text-xl font-bold text-green-600">
                      ¥{order.net_payout.toLocaleString()}
                    </span>
                  ) : null}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : order.status === 'cancelled' || order.status === 'disputed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : order.status === 'shipped' || order.status === 'delivered'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {statusT(order.status)}
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{t('filter.status')}</span>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('filter.all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filter.all')}</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{statusT(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="bought">
      <TabsList>
        <TabsTrigger value="bought">{t('tabs.bought')}</TabsTrigger>
        <TabsTrigger value="sold">{t('tabs.sold')}</TabsTrigger>
      </TabsList>
      <div className="mt-4" />
      <TabsContent value="bought">{renderList(bought, 'bought')}</TabsContent>
      <TabsContent value="sold">{renderList(sold, 'sold')}</TabsContent>
      </Tabs>
    </div>
  )
}
