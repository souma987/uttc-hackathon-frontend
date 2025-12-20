import {notFound, redirect} from 'next/navigation';
import {getLocale, getTranslations} from 'next-intl/server';
import {getServerAuth} from '@/lib/firebase/server';
import {fetchOrder} from '@/lib/services/orders';
import {getPublicUserProfile} from '@/lib/services/users';
import {BoxingWrapper} from '@/components/boxing-wrapper';
import {Separator} from '@/components/ui/separator';
import { UserInfoRow } from '@/components/user/user-info-row';
import Image from 'next/image';

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailsPage({ params }: PageProps) {
  const { orderId } = await params;
  const t = await getTranslations('market.order');
  const locale = await getLocale();

  // Check authentication
  const auth = await getServerAuth();
  if (!auth?.currentUser) {
    redirect(`/auth?next=/market/orders/${orderId}`);
  }

  const userId = auth.currentUser.uid;

  // Fetch order using service
  const order = await fetchOrder(orderId);

  if (!order) {
    notFound();
  }

  // Verify user is buyer or seller
  const isBuyer = order.buyer_id === userId;
  const isSeller = order.seller_id === userId;

  if (!isBuyer && !isSeller) {
    notFound();
  }

  // Fetch the seller or buyer profile
  const otherUserId = isBuyer ? order.seller_id : order.buyer_id;
  const otherUserProfile = await getPublicUserProfile(otherUserId);

  // Format dates
  const orderDate = new Date(order.created_at).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lastUpdated = new Date(order.updated_at).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold tracking-tight leading-none">
              {isBuyer ? t('buyerView.heading') : t('sellerView.heading')}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold capitalize self-start mt-1 ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : order.status === 'cancelled' || order.status === 'disputed'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  : order.status === 'shipped' || order.status === 'delivered'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}
            >
              {t(`statuses.${order.status}`)}
            </span>
          </div>
          <p className="text-muted-foreground text-lg">
            {t(isBuyer ? 'buyerView.orderNumber' : 'sellerView.orderNumber', {
              orderId: order.id,
            })}
          </p>
        </div>

        <Separator />

        {/* Item Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            {isBuyer ? t('buyerView.item') : t('sellerView.item')}
          </h2>
          <div className="flex gap-6">
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={order.listing_main_image}
                alt={order.listing_title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-medium">{order.listing_title}</h3>
              <p className="text-2xl font-bold text-primary mt-2">
                ¥{order.listing_price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{t('orderInfo')}</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('status')}</span>
                <span className="font-medium">{t(`statuses.${order.status}`)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('quantity')}</span>
                <span className="font-medium">{order.quantity}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('totalPrice')}</span>
                <span className="font-medium">
                  ¥{order.total_price.toLocaleString()}
                </span>
              </div>

              {isSeller && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t('platformFee')}
                    </span>
                    <span className="font-medium text-orange-600">
                      -¥{order.platform_fee.toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold">
                      {t('netPayout')}
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      ¥{order.net_payout.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {isBuyer ? t('buyerView.seller') : t('sellerView.buyer')}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('profile')}</span>
                <div>
                  <UserInfoRow user={otherUserProfile} />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('orderDate')}</span>
                <span className="font-medium">{orderDate}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('lastUpdated')}</span>
                <span className="font-medium">{lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoxingWrapper>
  );
}
