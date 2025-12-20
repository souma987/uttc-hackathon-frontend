import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/lib/api/user';

type UserInfoRowProps = {
  user: UserProfile | null;
  loading?: boolean;
};

export function UserInfoRow({ user, loading }: UserInfoRowProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-muted-foreground">—</div>;
  }

  const displayName = user.name || 'Anonymous User';

  // Get initials for avatar fallback
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <Button variant="ghost" asChild className="justify-start p-0 h-auto w-full">
      <Link href={`/market/users/${user.id}`}>
        <Avatar className="h-10 w-10">
          {user.avatar_url && <AvatarImage src={user.avatar_url} alt={displayName} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{displayName}</span>
      </Link>
    </Button>
  );
}
