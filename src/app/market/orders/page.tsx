import {BoxingWrapper} from '@/components/boxing-wrapper'
import {getServerAuth} from '@/lib/firebase/server'
import {redirect} from 'next/navigation'
import {getTranslations} from 'next-intl/server'
import {OrdersList} from './_components/orders-list'
import {type Order} from '@/lib/api/orders'
import {fetchMyOrders} from "@/lib/services/orders";

export default async function OrdersIndexPage() {
  const auth = await getServerAuth()
  if (!auth?.currentUser) {
    redirect('/auth?next=/market/orders')
  }

  const t = await getTranslations('market.ordersList')
  const userId = auth.currentUser.uid
  let orders: Order[] = []
  try {
    orders = await fetchMyOrders()
  } catch (e) {
    // Keep empty orders on error; OrdersList handles empty state
    console.error(e)
  }

  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8">
      <h1 className="mb-4 text-xl font-semibold">{t('title')}</h1>
      <OrdersList currentUserId={userId} orders={orders} />
    </BoxingWrapper>
  )
}
