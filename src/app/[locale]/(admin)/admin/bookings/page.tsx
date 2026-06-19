import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Header.nav' });
  return { title: t('bookings') };
}

export default function AdminBookingsPage() {
  const t = useTranslations('Header.nav');
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('bookings')}</h1>
      <p className="text-gray-400">Oversee and manage all platform bookings.</p>
    </div>
  );
}
