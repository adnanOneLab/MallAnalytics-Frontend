import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './translations/en.json';
import esTranslations from './translations/es.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations
            },
            es: {
                translation: esTranslations
            },
        },
        fallbackLng: 'en',
        debug: true, // Enable debug to see what's happening
        interpolation: {
            escapeValue: false,
        },
        // Add default namespace
        defaultNS: 'translation',
        ns: ['translation']
    });

export default i18n;