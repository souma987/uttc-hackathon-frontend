import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

const SUPPORTED_LOCALES = ['en', 'ja'];
const DEFAULT_LOCALE = 'ja';

export default getRequestConfig(async () => {
  const locale = await getLocale();
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

async function getLocale() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get('locale')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = headerStore.get('accept-language');
  if (acceptLanguage) {
    // Simple parse: takes "en-US,en;q=0.9" and gets "en"
    // FIXME: use the 'negotiator' library for more robust parsing
    const preferred = acceptLanguage.split(',')[0].split('-')[0];
    if (SUPPORTED_LOCALES.includes(preferred)) {
      return preferred;
    }
  }

  return DEFAULT_LOCALE;
}
