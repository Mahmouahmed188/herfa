'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function TestI18n() {
    const t = useTranslations('Common');
    const locale = useLocale();

    return (
        <div className="p-20 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">I18n Test Page</h1>
            <p>Current Locale: <span className="text-primary">{locale}</span></p>
            <p>Loading Text Translation: <span className="text-primary">{t('loading')}</span></p>
            <div className="flex gap-4">
                <p>Navbar services: {useTranslations('Navbar')('services')}</p>
            </div>
        </div>
    );
}
