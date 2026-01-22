import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./${language}/${namespace}.json`)))
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'ar'],
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        defaultNS: 'common',
        ns: ['common'],
    });

export default i18n;
