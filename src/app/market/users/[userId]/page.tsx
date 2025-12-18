import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BoxingWrapper } from '@/components/boxing-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getPublicUserProfile } from '@/lib/services/users';

export const revalidate = 0; // Ensure SSR with no caching for freshness

export default async function UserProfilePage({ params }: PageProps<'/market/users/[userId]'>) {
  const { userId } = await params;
  const t = await getTranslations('market.user');

  const profile = await getPublicUserProfile(userId);
  if (!profile) {
    notFound();
  }

  const displayName = profile.name?.trim() || t('noNameSet');
  const initials = profile.name
    ? profile.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8" size="sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">{t('title')}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={displayName} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="text-2xl font-semibold leading-tight">{displayName}</div>
          <p className="text-muted-foreground">ID: {profile.id}</p>
        </div>
      </div>
      <div className="mt-6">
        <Button asChild>
          <Link href={`/market/messages/${profile.id}`}>
            {t('sendMessage')}
          </Link>
        </Button>
      </div>
    </BoxingWrapper>
  );
}
