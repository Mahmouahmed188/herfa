import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Header.nav' });
  return { title: t('myBookings') };
}

export default function MyBookingsPage() {
  const t = useTranslations('Header.nav');
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('myBookings')}</h1>
      <p className="text-gray-400">Manage your service bookings and track their progress.</p>
    </div>
  );
}
