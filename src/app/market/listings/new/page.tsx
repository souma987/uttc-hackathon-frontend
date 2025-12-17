import {redirect} from 'next/navigation';
import {getServerAuth} from '@/lib/firebase/server';
import {BoxingWrapper} from '@/components/boxing-wrapper';
import {CreateListingForm} from './_components/create-listing-form';

export default async function NewListingPage() {
  const auth = await getServerAuth();

  if (!auth.currentUser) {
    redirect('/auth?next=/market/listings/new');
  }

  return (
    <BoxingWrapper className="px-4 py-8 lg:p-8" size="sm">
      <CreateListingForm/>
    </BoxingWrapper>
  );
}
