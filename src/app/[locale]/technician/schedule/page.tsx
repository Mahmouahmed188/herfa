import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Header.nav' });
  return { title: t('schedule') };
}

export default function TechnicianSchedulePage() {
  const t = useTranslations('Header.nav');
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('schedule')}</h1>
      <p className="text-gray-400">Manage your work schedule and availability.</p>
    </div>
  );
}
